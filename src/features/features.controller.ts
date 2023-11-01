import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
    Request,
    HttpException,
    HttpStatus,
    NotFoundException,
} from "@nestjs/common";
import { FeaturesService } from "./features.service";
import { CreateFeatureDto } from "./dto/create-feature.dto";
import { UpdateFeatureDto } from "./dto/update-feature.dto";
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { Feature } from "./entities/feature.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("teams")
@ApiTags("features")
export class FeaturesController {
    constructor(private readonly featuresService: FeaturesService) {}

    //can only create if loggedIn
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("/features")
    @ApiCreatedResponse({ type: Feature })
    createFeature(@Body() createFeatureDto: CreateFeatureDto) {
        return this.featuresService.createFeature(createFeatureDto);
    }

    @Get("/features/feature-categories")
    findFeatureCategory() {
        return this.featuresService.findFeatureCategories();
    }

    @Get("/features/:featureId")
    findOneFeature(@Param("featureId", ParseIntPipe) featureId: number) {
        return this.featuresService.findOneFeature(featureId);
    }

    @Get("/:teamId/features")
    findAllFeatures(@Param("teamId", ParseIntPipe) teamId: number) {
        return this.featuresService.findAllFeatures(teamId);
    }

    //Can only update if loggedIn userId mataches addedBy userId
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch("/features/:featureId")
    async updateFeature(
        @Request() req,
        @Param("featureId", ParseIntPipe) featureId: number,
        @Body() updateFeatureDto: UpdateFeatureDto,
    ) {
        const feature = await this.featuresService.findOneFeature(featureId);

        if (!feature) {
            throw new NotFoundException(
                `featureId (id: ${featureId}) does not exist.`,
            );
        }

        if (feature.addedBy.member.id === req.user.userId) {
            const updatedFeature = await this.featuresService.updateFeature(
                featureId,
                updateFeatureDto,
            );
            return updatedFeature;
        } else {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
        }
    }

    //Can only delete if loggedIn userId mataches addedBy userId
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete("/features/:featureId")
    async deleteFeature(
        @Request() req,
        @Param("featureId", ParseIntPipe) featureId: number,
    ) {
        const feature = await this.featuresService.findOneFeature(featureId);

        if (!feature) {
            throw new NotFoundException(
                `featureId (id: ${featureId}) does not exist.`,
            );
        }

        if (feature.addedBy.member.id === req.user.userId) {
            const deletedFeature =
                await this.featuresService.deleteFeature(featureId);
            return deletedFeature;
        } else {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
        }
    }
}
