import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Feature } from './entities/feature.entity';

@Controller('teams')
@ApiTags("features")
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  //need to figure out jwt token auth
  @Post("/features/features")
  @ApiCreatedResponse({ type: Feature })
  createFeature(
    @Body() createFeatureDto: CreateFeatureDto,
  ) {
    return this.featuresService.createFeature(createFeatureDto);
  }

  @Get('/features/:featureId')
  findOneFeature(
    @Param('featureId', ParseIntPipe) featureId: number
    ) {
    return this.featuresService.findOneFeature(featureId);
  }

    //need to check route is correct
  @Get('/:teamId/voyage-team-members/features/feature-categories/:featurecategoryId/features')
  findAllFeaturesByCategory(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('featurecategoryId', ParseIntPipe) featurecategoryId: number
  ) {
    return this.featuresService.findAllFeaturesByCategory(teamId, featurecategoryId);
  }

  //need to check route is correct
  @Get('/:teamId/voyage-team-members/features/feature-categories/features')
  findAllFeatures(
    @Param('teamId', ParseIntPipe) teamId: number,
    ) {
    return this.featuresService.findAllFeatures(teamId);
  }

    //need to figure out jwt token auth
  @Patch('/features/:featureId')
  updateFeature(
    @Param('featureId', ParseIntPipe) featureId: number, 
    @Body() updateFeatureDto: UpdateFeatureDto,
    ) {
    return this.featuresService.updateFeature(featureId, updateFeatureDto);
  }

    //need to figure out jwt token auth
  @Delete('/features/:featureId')
  deleteFeature(
    @Param('featureId', ParseIntPipe) featureId: number,
  ) {
    return this.featuresService.deleteFeature(featureId);
  }
}
