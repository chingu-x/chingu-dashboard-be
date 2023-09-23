import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {
  }

  findAll() {
    return this.prisma.voyageTeam.findMany({})
  }

  findAllByVoyageId(id: number){
    return this.prisma.voyageTeam.findMany({
      where: {
        voyageId: id
      }
    })
  }

  findOne(id: number) {
    return this.prisma.voyageTeam.findUnique({
      where: {id}
    })
  }

  findTeamMembersByTeamId(id:number) {
    return this.prisma.voyageTeamMember.findMany({
      where:{
        voyageTeamId:id
      },
      select:{
        member: {
          select: {
            firstName: true,
            lastName: true,
            discordId: true,
            countryCode: true,
            timezone: true,
            email: true,
          }
        },
        hrPerSprint:true,
        voyageRole: {
          select: {
            name: true
          }
        },
      }
    })
  }

  // Update voyage team member by id
  // when auth is ready, we will need to make sure the token id matches with the userid
  updateTeamMemberById(teamId, userId, updateTeamMemberDto:UpdateTeamMemberDto){
    return this.prisma.voyageTeamMember.update({
      where:{
        userVoyageId: {
          userId: userId,
          voyageTeamId: teamId,
        },
      },
      data: updateTeamMemberDto,
    })
  }
}
