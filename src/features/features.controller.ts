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
import { UpdateFeatureOrderAndCategoryDto } from "./dto/update-feature-order-and-category.dto";
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import { Feature } from "./entities/feature.entity";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller()
@ApiTags("Voyage - Features")
export class FeaturesController {
    constructor(private readonly featuresService: FeaturesService) {}

    @ApiOperation({
        summary:
            "Adds a new feature for a team given a teamId (int) and that the user is logged in.",
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("/:teamId/features")
    @ApiCreatedResponse({ type: Feature })
    async createFeature(
        @Request() req,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body() createFeatureDto: CreateFeatureDto,
    ) {
        return this.featuresService.createFeature(
            req,
            teamId,
            createFeatureDto,
        );
    }

    @ApiOperation({
        summary: "Gets all feature category options.",
    })
    @Get("/features/feature-categories")
    findFeatureCategory() {
        return this.featuresService.findFeatureCategories();
    }

    @ApiOperation({
        summary: "Gets one feature given a featureId (int).",
    })
    @Get("/features/:featureId")
    findOneFeature(@Param("featureId", ParseIntPipe) featureId: number) {
        return this.featuresService.findOneFeature(featureId);
    }

    @ApiOperation({
        summary: "Gets all features for a team given a teamId (int).",
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get("/:teamId/features")
    findAllFeatures(
        @Request() req,
        @Param("teamId", ParseIntPipe) teamId: number,
    ) {
        return this.featuresService.findAllFeatures(req, teamId);
    }

    @ApiOperation({
        summary:
            "Updates a feature given a featureId (int) and that the user who created it is logged in.",
    })
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

    @ApiOperation({
        summary:
            "Updates the order and category? of features by team members given a featureId (int), featureCategoryId (int), and order (int).",
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch("/features/:featureId/reorder")
    async updateFeatureOrderAndCategory(
        @Request() req,
        @Param("featureId", ParseIntPipe) featureId: number,
        @Body() updateOrderAndCategoryDto: UpdateFeatureOrderAndCategoryDto,
    ) {
        return this.featuresService.updateFeatureOrderAndCategory(
            req,
            featureId,
            updateOrderAndCategoryDto,
        );
    }

    @ApiOperation({
        summary:
            "Deletes a feature given the featureId (int) and user who created it is logged in.",
    })
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
