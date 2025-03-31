import { UserLookupByEmailDto } from "./dto/lookup-user-by-email.dto";
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import {
    fullUserDetailSelect,
    privateUserDetailSelect,
} from "@/global/selects/users.select";
import { CustomRequest } from "@/global/types/CustomRequest";
import { questionIds } from "@/global/constants/questionIds";
import { SubmitUserApplicationDto } from "@/users/dto/submit-user-application.dto";
import { FormResponseDto } from "@/global/dtos/FormResponse.dto";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    private formatUser = (user) => {
        return {
            ...user,
            roles: user?.roles.flatMap((r) => r.role.name),
        };
    };

    findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    findUserById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    // TODO: potentially extract this to the shared module, if any other modules need a similar function
    extractTextResponseByQuestionId(
        responses: FormResponseDto[],
        questionId: number,
        key: string = "",
    ) {
        const filteredResponses = responses.find(
            (response) => response.questionId === questionId,
        );
        if (!filteredResponses)
            throw new BadRequestException(
                `${key} (questionId: ${questionId}) is not provided`,
            );

        return filteredResponses.text;
    }

    async getUserRolesById(userId: string) {
        //Return user roles only when userDd actually exists
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                roles: {
                    select: {
                        role: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                voyageTeamMembers: {
                    select: {
                        id: true,
                        voyageTeamId: true,
                    },
                },
                emailVerified: true,
            },
        });
        if (user) {
            return this.formatUser(user);
        }
    }

    async findAll() {
        const users = await this.prisma.user.findMany({
            select: fullUserDetailSelect,
        });
        return users.map((user) => this.formatUser(user));
    }

    // /me endpoint, user's own profile/data
    // TODO: add error handling for invalid id (invalid uuid)
    async getPrivateUserProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: privateUserDetailSelect,
        });

        if (!user) throw new NotFoundException("User not found");

        const teamMemberId: number[] = user.voyageTeamMembers.map(
            (teamMemberId) => teamMemberId.id,
        );

        // get sprint checkin  Ids
        const sprintCheckInIds = (
            await this.prisma.formResponseCheckin.findMany({
                where: {
                    voyageTeamMemberId: {
                        in: teamMemberId,
                    },
                },
                select: {
                    sprintId: true,
                },
            })
        ).map((sprintCheckInId) => sprintCheckInId.sprintId);

        // update user object with sprintCheckInIds
        const updatedUser = {
            ...user,
            sprintCheckIn: sprintCheckInIds,
            voyageTeamMembers: user.voyageTeamMembers.map((teamMember) => {
                if (teamMember.voyageTeam.FormResponseVoyageProject) {
                    return {
                        ...teamMember,
                        voyageTeam: {
                            ...teamMember.voyageTeam,
                            projectSubmitted: true,
                        },
                    };
                } else {
                    return {
                        ...teamMember,
                        voyageTeam: {
                            ...teamMember.voyageTeam,
                            projectSubmitted: false,
                        },
                    };
                }
            }),
            soloProjects: user.soloProjects.map((soloProject) => ({
                id: soloProject.id,
                status: soloProject.status?.status,
            })),
        };

        return this.formatUser(updatedUser);
    }

    // full user detail, for dev purpose
    async getUserDetailsById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: fullUserDetailSelect,
        });

        if (!user) {
            throw new NotFoundException(`User (userid: ${userId}) not found`);
        }

        return this.formatUser(user);
    }

    async getUserDetailsByEmail(userLookupByEmailDto: UserLookupByEmailDto) {
        const { email } = userLookupByEmailDto;
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
            select: fullUserDetailSelect,
        });

        if (!user) {
            throw new NotFoundException(`User with ${email} not found`);
        }

        return this.formatUser(user);
    }

    async submitUserApplication(
        req: CustomRequest,
        submitUserApplication: SubmitUserApplicationDto,
    ) {
        // In the admin dashboard, we would be able to set/link question id
        // For now, we will hardcode it

        const firstname = this.extractTextResponseByQuestionId(
            submitUserApplication.responses,
            questionIds.userApplication.firstname,
            "Firstname",
        );

        const lastname = this.extractTextResponseByQuestionId(
            submitUserApplication.responses,
            questionIds.userApplication.lastname,
            "Lastname",
        );

        const countryCode = this.extractTextResponseByQuestionId(
            submitUserApplication.responses,
            questionIds.userApplication.countryCode,
            "CountryCode",
        );

        // gender is optional
        const genderChoiceId = submitUserApplication.responses.find(
            (response) => response.questionId === 51,
        )?.optionChoiceId;
        let genderAbbreviation: string | null = null;

        if (genderChoiceId) {
            const genderChoice = await this.prisma.optionChoice.findUnique({
                where: {
                    id: genderChoiceId,
                },
            });

            if (!genderChoice) {
                throw new BadRequestException(
                    `Gender choice id is invalid (${genderChoiceId}`,
                );
            }

            genderAbbreviation = genderChoice.text.split(" - ")[0];
        }

        return this.prisma.user.update({
            where: {
                id: req.user.userId,
            },
            data: {
                firstName: firstname,
                lastName: lastname,
                countryCode,
                gender: genderAbbreviation
                    ? {
                          connect: {
                              abbreviation: genderAbbreviation,
                          },
                      }
                    : {
                          disconnect: true,
                      },
            },
        });

        // return `User application submitted, ${req.user.userId}, firstname=${firstname}, lastname=${lastname}, countryCode=${countryCode}`;
    }
}
