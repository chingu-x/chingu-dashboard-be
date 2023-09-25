import { Injectable } from '@nestjs/common';
import { UpdateTechDto } from './dto/update-tech.dto';
import {PrismaService} from "../prisma/prisma.service";
import {CreateTechVoteDto} from "./dto/create-tech-vote.dto";

@Injectable()
export class TechsService {
  constructor(private prisma: PrismaService) {
  }

  findAllByTeamId(id:number) {
    return this.prisma.teamTechStackItem.findMany({
      where: {
        voyageTeamId: id
      },
      select:{
        id: true,
        tech: {
          select:{
            id: true,
            category: {
              select: {
                name: true
              }
            },
            name: true
          }
        },
        teamTechStackItemVotes: {
          select: {
            votedBy: {
              select: {
                member: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatar: true
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  async addNewTechVote(teamId, techId, createTechVoteDto: CreateTechVoteDto) {
    const newTeamTechItem = await this.prisma.teamTechStackItem.create({
      data: {
        voyageTeamId: teamId,
        techId: techId,
      }
    });
    const voyageMember = await this.prisma.voyageTeamMember.findUnique({
      where:{
        userVoyageId: {
          userId: createTechVoteDto.votedBy,
          voyageTeamId: teamId,
        }
      }
    })
    return this.prisma.teamTechStackItemVote.create({
      data:{
        teamTechId: newTeamTechItem.id,
        teamMemberId: voyageMember.id
      }
    })
  }

  async addExistingTechVote(teamId, teamTechId, createTechVoteDto: CreateTechVoteDto) {
    const voyageMember = await this.prisma.voyageTeamMember.findUnique({
      where:{
        userVoyageId: {
          userId: createTechVoteDto.votedBy,
          voyageTeamId: teamId,
        }
      }
    })

    return this.prisma.teamTechStackItemVote.create({
      data:{
        teamTechId,
        teamMemberId: voyageMember.id
      }
    })
  }

  async removeVote(teamId, teamTechId, createTechVoteDto: CreateTechVoteDto) {
    const voyageMember = await this.prisma.voyageTeamMember.findUnique({
      where:{
        userVoyageId: {
          userId: createTechVoteDto.votedBy,
          voyageTeamId: teamId,
        }
      }
    })
    return this.prisma.teamTechStackItemVote.delete({
      where: {
        userTeamStackVote:{
          teamTechId,
          teamMemberId: voyageMember.id
        }
      },
    });
  }
}
