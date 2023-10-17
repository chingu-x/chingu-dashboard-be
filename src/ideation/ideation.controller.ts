import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
} from "@nestjs/common";
import { IdeationService } from "./ideation.service";
import { CreateIdeationDto } from "./dto/create-ideation.dto";
import { UpdateIdeationDto } from "./dto/update-ideation.dto";

@Controller("voyage")
export class IdeationController {
    constructor(private readonly ideationService: IdeationService) {}

    @Post(":id/project/:tId")
    create(
        @Param("id") id: string,
        @Param("tId") tId: string,
        @Body() createIdeationDto: CreateIdeationDto,
    ) {
        return this.ideationService.create(createIdeationDto);
    }

    @Get(":id/project")
    findAll(@Param("id") id: string) {
        return this.ideationService.findAll(+id);
    }
    @Get(":id/projectIdeas")
    getProjectIdeas(@Param("id") id: string) {
        return this.ideationService.getProjectIdeas(+id);
    }

    @Patch(":id/stack/project/:pId")
    update(
        @Param("id") id: string,
        @Param("pId") pId: string,
        @Body() updateIdeationDto: UpdateIdeationDto,
    ) {
        return this.ideationService.update(+id, +pId, updateIdeationDto);
    }

    @Delete(":id/stack/project/:pId")
    remove(@Param("id") id: string, @Param("pId") pId: string) {
        return this.ideationService.remove(+id, +pId);
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
