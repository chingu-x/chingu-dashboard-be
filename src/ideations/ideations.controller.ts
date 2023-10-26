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
import { CreateIdeationVoteDto } from "./dto/create-ideation-vote.dto";
import { DeleteIdeationDto } from "./dto/delete-ideation.dto";
import { DeleteIdeationVoteDto } from "./dto/delete-ideation-vote.dto";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { Ideation } from "./entities/ideation.entity";

@Controller()
@ApiTags("ideations")
export class IdeationsController {
    constructor(private readonly ideationsService: IdeationsService) {}

    @Post("/teams/:teamId/ideations")
    @ApiCreatedResponse({type: Ideation})
    createIdeation(
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body() createIdeationDto: CreateIdeationDto,
    ) {
        return this.ideationsService.createIdeation(
            teamId, 
            createIdeationDto
        );
    };

    @Post("/teams/:teamId/ideations/:ideationId/ideation-votes")
    @ApiCreatedResponse({type: Ideation})
    createIdeationVote(
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("ideationId", ParseIntPipe) ideationId: number,
        @Body() createIdeationVoteDto: CreateIdeationVoteDto,
    ) {
        return this.ideationsService.createIdeationVote(
            teamId,
            ideationId,
            createIdeationVoteDto
        );
    };

    @Get("/teams/:teamId/ideations")
    @ApiCreatedResponse({type: Ideation})
    getIdeationsByVoyageTeam(
        @Param("teamId", ParseIntPipe) teamId: number
    ) {
        return this.ideationsService.getIdeationsByVoyageTeam(teamId);
    };

    @Patch("/ideations/:ideationId")
    @ApiCreatedResponse({type: Ideation})
    updateIdeation(
        @Param("ideationId", ParseIntPipe) ideationId: number,
        @Body() updateIdeationDto: UpdateIdeationDto,
    ) {
        return this.ideationsService.updateIdeation( 
            ideationId,  
            updateIdeationDto
        );
    };

    @Delete("/ideations/:ideationId")
    @ApiCreatedResponse({type: Ideation})
    deleteIdeation(
        @Param("ideationId", ParseIntPipe) ideationId: number,
        @Body() deleteIdeationDto: DeleteIdeationDto,
    ) {
        return this.ideationsService.deleteIdeation( 
            ideationId,
            deleteIdeationDto
        );
    };

    // Should probably add ideationVoteId to the path
    @Delete("/teams/:teamId/ideations/:ideationId/ideation-votes")
    @ApiCreatedResponse({type: Ideation})
    deleteIdeationVote(
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("ideationId", ParseIntPipe) ideationId: number,
        @Body() deleteIdeationVoteDto: DeleteIdeationVoteDto,
    ){
        return this.ideationsService.deleteIdeationVote(
            teamId,
            ideationId,
            deleteIdeationVoteDto
        );
    };
}
