import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
    ParseIntPipe,
} from "@nestjs/common";
import { IdeationsService } from "./ideations.service";
import { CreateIdeationDto } from "./dto/create-ideation.dto";
import { UpdateIdeationDto } from "./dto/update-ideation.dto";
import { ApiTags } from "@nestjs/swagger";

// @Controller("ideations")
@ApiTags("ideations")
export class IdeationsController {
    constructor(private readonly ideationsService: IdeationsService) {}

    @Post(":userId/project/:tId")
    create(
        @Param("userId") userId: string,
        @Param("tId") tId: string,
        @Body() createIdeationDto: CreateIdeationDto,
    ) {
        return this.ideationsService.create(createIdeationDto);
    }

    //currently thinking we do not need
    // @Get(":id/project")
    // findAll(@Param("id", ParseIntPipe) id: number) {
    //     return this.ideationsService.findAll(id);
    // }

    @Get(":id/projectIdeas")
    getProjectIdeas(@Param("id", ParseIntPipe) id: number) {
        return this.ideationsService.getProjectIdeas(id);
    }

    @Patch(":id/stack/project/:pId")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Param("pId", ParseIntPipe) pId: number,
        @Body() updateIdeationDto: UpdateIdeationDto,
    ) {
        return this.ideationsService.update(id, pId, updateIdeationDto);
    }

    @Delete(":id/stack/project/:pId")
    remove(@Param("id", ParseIntPipe) id: number, @Param("pId", ParseIntPipe) pId: number) {
        return this.ideationsService.remove(id, pId);
    }

    /*@Post("/team/:teamId/ideation/:Id/new")
    addNewTechVote(
        @Param("teamId", ParseIntPipe) teamId: number,
        @Param("techId", ParseIntPipe) techId: number,
        @Body() createTechVoteDto: CreateTechVoteDto,
    ) {
        return this.techsService.addNewTechVote(
            teamId,
            techId,
            createTechVoteDto,
        );
    }*/
}
