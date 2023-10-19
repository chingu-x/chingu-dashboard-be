import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
} from "@nestjs/common";
import { IdeationsService } from "./ideations.service";
import { CreateIdeationDto } from "./dto/create-ideation.dto";
import { UpdateIdeationDto } from "./dto/update-ideation.dto";

@Controller("voyage")
export class IdeationsController {
    constructor(private readonly ideationsService: IdeationsService) {}

    @Post(":id/project/:tId")
    create(
        @Param("id") id: string,
        @Param("tId") tId: string,
        @Body() createIdeationDto: CreateIdeationDto,
    ) {
        return this.ideationsService.create(createIdeationDto);
    }

    @Get(":id/project")
    findAll(@Param("id") id: string) {
        return this.ideationsService.findAll(+id);
    }
    @Get(":id/projectIdeas")
    getProjectIdeas(@Param("id") id: string) {
        return this.ideationsService.getProjectIdeas(+id);
    }

    @Patch(":id/stack/project/:pId")
    update(
        @Param("id") id: string,
        @Param("pId") pId: string,
        @Body() updateIdeationDto: UpdateIdeationDto,
    ) {
        return this.ideationsService.update(+id, +pId, updateIdeationDto);
    }

    @Delete(":id/stack/project/:pId")
    remove(@Param("id") id: string, @Param("pId") pId: string) {
        return this.ideationsService.remove(+id, +pId);
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
