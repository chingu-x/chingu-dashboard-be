import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
    ParseIntPipe
} from "@nestjs/common";
import { IdeationsService } from "./ideations.service";
import { CreateIdeationDto } from "./dto/create-ideation.dto";
import { UpdateIdeationDto } from "./dto/update-ideation.dto";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { Ideation } from "./entities/ideation.entity";
import { CreateIdeationVoteDto } from "./dto/create-ideation-vote.dto";

@Controller()
@ApiTags("ideations")
export class IdeationsController {
    constructor(private readonly ideationsService: IdeationsService) {}

    //TODO updated userId to grab uuid/JWT once 
    @Post("users/:userId/teams/:teamId/ideations")
    @ApiCreatedResponse({type: Ideation})
    createIdeation(
        @Param("userId") userId: string,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body() createIdeationDto: CreateIdeationDto,
    ) {
        return this.ideationsService.createIdeation(
            teamId, 
            userId, 
            createIdeationDto
        );
    };

    @Get("/teams/:teamId/ideations")
    @ApiCreatedResponse({type: Ideation})
    async getProjectIdeasByVoyageTeam(
        @Param("teamId", ParseIntPipe) teamId: number
    ) {
        const projectIdeas = await this.ideationsService.getIdeationsByVoyageTeam(teamId);
        return projectIdeas.map((projectIdea)=>{
            return {
                ...projectIdea, 
                voteCount: projectIdea.projectIdeaVotes.length
            }
        })
    };

    @Patch("users/:userId/ideations/:ideationId")
    @ApiCreatedResponse({type: Ideation})
    updateIdeation(
        @Param("userId") userId: string,
        @Param("ideationId", ParseIntPipe) ideationId: number,
        @Body() updateIdeationDto: UpdateIdeationDto,
    ) {
        return this.ideationsService.updateIdeation( 
            ideationId, 
            userId, 
            updateIdeationDto
        );
    };

    //TODO update to uuid/JWT once authentication added
    @Delete("users/:userId/ideations/:ideationId")
    @ApiCreatedResponse({type: Ideation})
    deleteIdeation(
        @Param("userId") userId: string, 
        @Param("ideationId", ParseIntPipe) ideationId: number
    ) {
        return this.ideationsService.deleteIdeation(
            userId, 
            ideationId
        );
    };

    @Post("users/:userId/teams/:teamId/ideation-vote")
    @ApiCreatedResponse({type: Ideation})
    createIdeationVote(
        @Param("userId") userId: string,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body() CreateIdeationVoteDto: CreateIdeationVoteDto,
    ) {
        return this.ideationsService.createIdeationVote(
            userId,
            teamId,
            CreateIdeationVoteDto
        );
    };

    @Delete("users/:userId/teams/:teamId/ideations/:ideationId/ideation-vote")
    @ApiCreatedResponse({type: Ideation})
    removeVoteFromIdeation(
        @Param("userId") userId: string,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("ideationId", ParseIntPipe) ideationId: number,
    ){
        return this.ideationsService.deleteIdeationVote(
            userId,
            teamId,
            ideationId
        );
    };
}
