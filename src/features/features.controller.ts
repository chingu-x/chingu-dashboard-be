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
    UnauthorizedException,
} from "@nestjs/common";
import { FeaturesService } from "./features.service";
import { CreateFeatureDto } from "./dto/create-feature.dto";
import { UpdateFeatureDto } from "./dto/update-feature.dto";
import { UpdateFeatureOrderAndCategoryDto } from "./dto/update-feature-order-and-category.dto";
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { Feature } from "./entities/feature.entity";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
    BadRequestErrorResponse,
    NotFoundErrorResponse,
    UnauthorizedErrorResponse,
} from "../global/responses/errors";
import {
    FeatureCategoriesResponse,
    ExentedFeaturesResponse,
    FeatureResponse,
} from "./features.response";

@Controller()
@ApiTags("Voyage - Features")
export class FeaturesController {
    constructor(private readonly featuresService: FeaturesService) {}

    @ApiOperation({
        summary:
            "Adds a new feature for a team given a teamId (int) and that the user is logged in.",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Feature Category with given ID does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description:
            "Invalid uuid or teamID. User is not authorized to perform this action.",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Successfully created a new feature.",
        type: FeatureResponse,
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
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully got all feature categories.",
        isArray: true,
        type: FeatureCategoriesResponse,
    })
    @Get("/features/feature-categories")
    findFeatureCategory() {
        return this.featuresService.findFeatureCategories();
    }

    @ApiOperation({
        summary: "Gets one feature given a featureId (int).",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully found feature.",
        type: ExentedFeaturesResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description:
            "Invalid uuid or teamID. User is not authorized to perform this action.",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Feature with given ID does not exist.",
        type: NotFoundErrorResponse,
    })
    @Get("/features/:featureId")
    findOneFeature(@Param("featureId", ParseIntPipe) featureId: number) {
        return this.featuresService.findOneFeature(featureId);
    }

    @ApiOperation({
        summary: "Gets all features for a team given a teamId (int).",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully got all features for project.",
        isArray: true,
        type: ExentedFeaturesResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description:
            "Invalid uuid or teamID. User is not authorized to perform this action.",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description:
            "Could not find features for project. Team with given ID does not exist.",
        type: NotFoundErrorResponse,
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
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Feature with given ID does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "user is unauthorized to perform this action",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid Req.body or featureId ",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully updated feature.",
        type: FeatureResponse,
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
            throw new HttpException(
                "user is unauthorized to perform this action",
                HttpStatus.UNAUTHORIZED,
            );
        }
    }

    @ApiOperation({
        summary:
            "Updates the order and/or category of features by team members given a featureId (int), featureCategoryId (int), and order (int).",
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "user is unauthorized to perform this action",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Feature category with given ID does not exist.",
        type: BadRequestErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description:
            "Could not find features for project. Team with given ID does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully updated feature category and ID.",
        isArray: true,
        type: ExentedFeaturesResponse,
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
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Feature with given ID does not exist.",
        type: NotFoundErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "user is unauthorized to perform this action",
        type: UnauthorizedErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully deleted feature.",
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
            throw new UnauthorizedException(
                `uuid ${req.user.userId} does not match addedBy teamMemberID ${feature.addedBy.member.id}`,
            );
        }
    }
}
