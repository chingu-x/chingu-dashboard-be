import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CustomRequest } from "./types/CustomRequest";
import { FormResponseDto } from "./dtos/FormResponse.dto";

@Injectable()
export class GlobalService {
    constructor(private prisma: PrismaService) {}

    //verifies user is logged in by using uuid from cookie and teamId to pull a teamMember.
    // TODO: remove as it's replaced by permission guard
    public async validateLoggedInAndTeamMember(teamId: number, uuid: any) {
        const teamMember = await this.prisma.voyageTeamMember.findFirst({
            where: {
                voyageTeamId: teamId,
                userId: uuid,
            },
            select: {
                id: true,
                userId: true,
                voyageTeamId: true,
            },
        });

        if (!teamMember) {
            throw new UnauthorizedException(
                `TeamId (id: ${teamId}) and/or loggedIn userId (id: ${uuid}) is invalid.`,
            );
        }
        return teamMember;
    }

    public getVoyageTeamMemberId(req: CustomRequest, teamId: number) {
        const teamMemberId = req.user.voyageTeams.find(
            (t) => t.teamId == teamId,
        )?.memberId;
        if (!teamMemberId) {
            throw new BadRequestException(`Invalid Team Id (id: ${teamId}).`);
        }
        return teamMemberId;
    }

    // ======= FORM responses helper functions =====

    // pass in any form response DTO, this will extract responses from the DTO,
    // and parse it into and array for prisma bulk insert/update
    public responseDtoToArray = (responses: any) => {
        const responsesArray: any = [];
        const responseIndex = ["response", "responses"];
        for (const index in responses) {
            if (responseIndex.includes(index)) {
                responses[index].forEach((v: FormResponseDto) => {
                    responsesArray.push({
                        questionId: v.questionId,
                        ...(v.text ? { text: v.text } : { text: null }),
                        ...(v.numeric
                            ? { numeric: v.numeric }
                            : { numeric: null }),
                        ...(v.boolean !== undefined
                            ? { boolean: v.boolean }
                            : { boolean: null }),
                        ...(v.optionChoiceId
                            ? { optionChoiceId: v.optionChoiceId }
                            : { optionChoiceId: null }),
                    });
                });
            }
        }
        return responsesArray;
    };

    // Checks that questions submitted for update match the form questions
    // using the formId
    public checkQuestionsInFormById = async (
        formId: number,
        responsesArray: FormResponseDto[],
    ) => {
        const form = await this.prisma.form.findUnique({
            where: { id: formId },
            select: {
                title: true,
                questions: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!form)
            throw new BadRequestException(`No form with form id= ${formId}`);

        const questionIds = form.questions.flatMap((question) => question.id);

        responsesArray.forEach((response) => {
            if (questionIds.indexOf(response.questionId) === -1)
                throw new BadRequestException(
                    `Question Id ${response.questionId} is not in form ${form.title} (id: ${formId})`,
                );
        });
    };

    // Checks that questions submitted for update match the form questions
    // using the form title
    public checkQuestionsInFormByTitle = async (
        title: string,
        responsesArray: FormResponseDto[],
    ) => {
        const form = await this.prisma.form.findUnique({
            where: { title },
            select: {
                id: true,
                questions: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!form)
            throw new BadRequestException(`No form with form title = ${title}`);

        const questionIds = form.questions.flatMap((question) => question.id);

        responsesArray.forEach((response) => {
            if (questionIds.indexOf(response.questionId) === -1)
                throw new BadRequestException(
                    `Question Id ${response.questionId} is not in form ${title} (id: ${form.id})`,
                );
        });
    };

    /**
     * Validates the existence of or retrieves a database item. Additional, optional criteria
     * and options are supported for flexibility but the intent is for simple queries.
     *
     * @param dbTableName - The name of the database table to query.
     * @param searchValue - The value to search in the id (default) or other field.
     *
     * @param searchField - (Optional) The field to search by (defaults to "id").
     * @param findOptions - (Optional) Prisma query method (defaults to "findUnique").
     * @param whereOptions - (Optional) Additional query criteria.
     * @param queryOptions - (Optional) Prisma query options (e.g., `include` or `select`).
     * @param customErrorMessage - (Optional) Custom error message instead of default 404.
     *
     * @returns The database item or throws an error if not found.
     */
    public validateOrGetDbItem = async <T>(
        dbTableName: string,
        searchValue:
            | string
            | number
            | [number, string]
            | null
            | [string, string],
        searchField: string = "id",
        findOptions: string = "findUnique",
        whereOptions?: Record<string, any>,
        queryOptions?,
        customErrorMessage?,
    ): Promise<T | null> => {
        const prismaQuery = this.prisma[dbTableName][findOptions]({
            where: {
                [searchField]: searchValue,
                ...whereOptions,
            },
            ...queryOptions,
        });

        let dbItem = await prismaQuery;

        if (!dbItem) {
            // for if special cases need different error messages
            if (customErrorMessage) {
                customErrorMessage;
            } else {
                // else match most common formatting of existing 404 messages
                throw new NotFoundException(
                    `${dbTableName.toUpperCase()} (${searchField}: ${searchValue}) does not exist.`,
                );
            }
        }

        return dbItem;
    };
}
