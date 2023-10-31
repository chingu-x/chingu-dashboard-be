import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';

@Injectable()
export class FeaturesService {
  constructor(private prisma: PrismaService){}

  async createFeature( createFeatureDto: CreateFeatureDto) {
    const { teamMemberId, featureCategoryId, description } = createFeatureDto;
    const newFeature = await this.prisma.projectFeature.create({
      data: {
        teamMemberId,
        featureCategoryId,
        description
      }
    })
    return newFeature;
  }

  async findOneFeature(featureId: number) {
    const projectFeature = await this.prisma.projectFeature.findUnique({
      where: { 
        id: featureId 
      },
      select: {
        id: true,
        teamMemberId: true,
        featureCategoryId: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        addedBy: {
          select: {
            member: {
              select:{
                id: true,
                avatar: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    })
    return projectFeature;
  }
  
  async findAllFeaturesByCategory(teamId: number, featureCategoryId: number) {
    const projectFeaturesByCategory = await this.prisma.voyageTeamMember.findMany({

    })
    return projectFeaturesByCategory;
  }

  async findAllFeatures(teamId: number) {
    const allTeamFeatures = await this.prisma.voyageTeamMember.findMany({
      where: { 
        voyageTeamId: teamId 
      },
      select: {
        id: true,
            projectFeatures: {
              select:{
                id: true,
                teamMemberId: true,
                featureCategoryId: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                addedBy: {
                  select: {
                    member: {
                      select:{
                        id: true,
                        avatar: true,
                        firstName: true,
                        lastName: true,
                      }
                    }
                  }
                }
              }
            }
        }
    })
    return allTeamFeatures;
  }

  async updateFeature(featureId: number, updateFeatureDto: UpdateFeatureDto) {
    const { teamMemberId, featureCategoryId, description } = updateFeatureDto;
    const updatedFeature =  await this.prisma.projectFeature.update({
      where: {
        id: featureId,
      },
      data: {
        teamMemberId,
        featureCategoryId,
        description,
      }
    })
    return updatedFeature;
  }

  async deleteFeature(featureId: number) {
    await this.prisma.projectFeature.delete({
      where:{
        id: featureId,
      }
    })
  };
}
