import {
    ConflictException,
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GlobalService } from "../global/global.service";
import { CreateVoyageProjectSubmissionDto } from "./dto/create-voyage-project-submission.dto";
import { CustomRequest } from "../global/types/CustomRequest";

// import { FormTitles } from "../global/constants/formTitles";

@Injectable()
export class VoyagesService {
    constructor(
        private prisma: PrismaService,
        private globalServices: GlobalService,
    ) {}

    async submitVoyageProject(
        req: CustomRequest,
        createVoyageProjectSubmission: CreateVoyageProjectSubmissionDto,
    ) {
        const responseArray = this.globalServices.responseDtoToArray(
            createVoyageProjectSubmission,
        );

        // TODO: This won't work till form is populated, commenting out till the form population PR is merged
        /*
        await this.globalServices.checkQuestionsInFormByTitle(
            FormTitles.voyageSubmission,
            responseArray
        )
         */

        // check if user is in the voyage team
        if (
            !req.user.voyageTeams
                .map((team) => team.teamId)
                .includes(createVoyageProjectSubmission.voyageTeamId)
        ) {
            throw new ForbiddenException(
                `User is not in team id ${createVoyageProjectSubmission.voyageTeamId}`,
            );
        }
        try {
            const voyageProjectSubmission = await this.prisma.$transaction(
                async (tx) => {
                    const responseGroup = await tx.responseGroup.create({
                        data: {
                            responses: {
                                createMany: {
                                    data: responseArray,
                                },
                            },
                        },
                    });
                    return tx.formResponseVoyageProject.create({
                        data: {
                            voyageTeamId:
                                createVoyageProjectSubmission.voyageTeamId,
                            responseGroupId: responseGroup.id,
                        },
                    });
                },
            );
            return {
                id: voyageProjectSubmission.id,
                voyageTeamId: voyageProjectSubmission.voyageTeamId,
                responseGroupId: voyageProjectSubmission.responseGroupId,
                createdAt: voyageProjectSubmission.createdAt,
            };
        } catch (e) {
            if (e.code === "P2002") {
                throw new ConflictException(
                    `Team ${createVoyageProjectSubmission.voyageTeamId} has already submitted a voyage project.`,
                );
            } else {
                console.log(e);
                throw e;
            }
        }
    }
}
