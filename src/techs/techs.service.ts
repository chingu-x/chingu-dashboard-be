import { Injectable } from '@nestjs/common';
import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';
import {PrismaService} from "../prisma/prisma.service";
import {CreateTechVoteDto} from "./dto/create-tech-vote.dto";

@Injectable()
export class TechsService {
  constructor(private prisma: PrismaService) {
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



  findAllByTeamId(id:number) {
    return this.prisma.teamTechStackItem.findMany({
      where: {
        voyageTeamId: id
      },
      select:{
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

  findOne(id: number) {
    return `This action returns a #${id} tech`;
  }

  update(id: number, updateTechDto: UpdateTechDto) {
    return `This action updates a #${id} tech`;
  }

  remove(id: number) {
    return `This action removes a #${id} tech`;
  }
}
