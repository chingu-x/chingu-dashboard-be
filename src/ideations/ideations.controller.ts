import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
    ParseIntPipe,
    Request,
    UseGuards,
} from "@nestjs/common";
import { IdeationsService } from "./ideations.service";
import { CreateIdeationDto } from "./dto/create-ideation.dto";
import { UpdateIdeationDto } from "./dto/update-ideation.dto";
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import { Ideation } from "./entities/ideation.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller()
@ApiTags("Voyage - Ideations")
export class IdeationsController {
    constructor(private readonly ideationsService: IdeationsService) {}

    @ApiOperation({
        summary:
            "Adds a new ideation to the team, add the creator as first voter.",
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiCreatedResponse({ type: Ideation })
    createIdeation(
        @Request() req,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body() createIdeationDto: CreateIdeationDto,
    ) {
        return this.ideationsService.createIdeation(
            req,
            teamId,
            createIdeationDto,
        );
    }

    @ApiOperation({
        summary:
            "Adds an ideation vote given a ideationId (int) and teamId (int).",
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("/:ideationId/ideation-votes")
    @ApiCreatedResponse({ type: Ideation })
    createIdeationVote(
        @Request() req,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("ideationId", ParseIntPipe) ideationId: number,
    ) {
        return this.ideationsService.createIdeationVote(
            req,
            teamId,
            ideationId,
        );
    }

    @ApiOperation({
        summary: "Gets all ideations for a team given a teamId (int).",
    })
    @Get()
    @ApiCreatedResponse({ type: Ideation })
    getIdeationsByVoyageTeam(@Param("teamId", ParseIntPipe) teamId: number) {
        return this.ideationsService.getIdeationsByVoyageTeam(teamId);
    }

    @ApiOperation({
        summary:
            "Updates an ideation given a ideationId (int) and the that user that created it is logged in.",
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch("/:ideationId")
    @ApiCreatedResponse({ type: Ideation })
    updateIdeation(
        @Request() req,
        @Param("ideationId", ParseIntPipe) ideationId: number,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Body() updateIdeationDto: UpdateIdeationDto,
    ) {
        return this.ideationsService.updateIdeation(
            req,
            ideationId,
            teamId,
            updateIdeationDto,
        );
    }

    @ApiOperation({
        summary:
            "Deletes an ideation given a ideationId (int) and that the user that created it is logged in.",
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete("/:ideationId")
    @ApiCreatedResponse({ type: Ideation })
    deleteIdeation(
        @Request() req,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("ideationId", ParseIntPipe) ideationId: number,
    ) {
        return this.ideationsService.deleteIdeation(req, teamId, ideationId);
    }

    @ApiOperation({
        summary:
            "Deletes an ideation vote given a ideationId (int) and teamId (int).",
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete("/:ideationId/ideation-votes")
    @ApiCreatedResponse({ type: Ideation })
    deleteIdeationVote(
        @Request() req,
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("ideationId", ParseIntPipe) ideationId: number,
    ) {
        return this.ideationsService.deleteIdeationVote(
            req,
            teamId,
            ideationId,
        );
    }
}
