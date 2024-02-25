jest.setTimeout(70000)

import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { seed } from "../prisma/seed/seed";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { CreateResourceDto } from "src/resources/dto/create-resource.dto";
import { UpdateResourceDto } from "src/resources/dto/update-resource.dto";
import { extractResCookieValueByKey } from "./utils";

const loginUser = async (
    email: string,
    password: string,
    app: INestApplication
) => {
    const res = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
            email,
            password,
        })
        .expect(200)

        return extractResCookieValueByKey(
            res.headers["set-cookie"],
            "access_token",
        );
}

const findVoyageTeamMemberByEmail = async (
    email: string,
    prisma: PrismaService
) => {
    return await prisma.voyageTeamMember.findFirst({
        where: {
            member: {
                email:
                    email
            },
        },
        select: {
            userId: true,
            voyageTeamId: true
        }
    })
}

const findUserOnOtherTeam = async (
    voyageTeamId: number,
    prisma: PrismaService
) => {
    return await prisma.user.findFirst({
        where: {
            AND: [
                {
                    NOT: {
                        voyageTeamMembers: {
                            every: {
                                voyageTeamId: {
                                    equals: voyageTeamId
                                }
                            }
                        }
                    }
                },
                {
                    NOT: {
                        roles: {
                            some: {
                                role: {
                                    name: 'admin'
                                }
                            }
                        }
                    }
                }
            ]
        }
    });
};

describe("ResourcesController (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;

    const memberShape = {
        avatar: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
    };

    const resourceShape = {
        id: expect.any(Number),
        teamMemberId: expect.any(Number),
        url: expect.any(String),
        title: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        await seed();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    it("/POST voyages/:teamId/resources", async () => {
        const userEmail: string = "jessica.williamson@gmail.com" 
        const { voyageTeamId } = await findVoyageTeamMemberByEmail(
            userEmail,
            prisma
        )

        const userAccessToken = await loginUser(
            userEmail, 
            "password", 
            app
        )

        const newResource: CreateResourceDto = {
            url: "http://www.github.com/chingux",
            title: "Chingu Github repo"
        };

        return request(app.getHttpServer())
            .post(`/voyages/${voyageTeamId}/resources`)
            .set("Authorization", `Bearer ${userAccessToken}`)
            .send(newResource)
            .expect(201)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual({
                    ...resourceShape,
                });
            });
    });

    it("should not allow members of other teams to POST", async () => {
        const userEmail: string = "dan@random.com" 
        const { voyageTeamId } = await findVoyageTeamMemberByEmail(
            userEmail,
            prisma
        )

        const otherUser = await findUserOnOtherTeam(
            voyageTeamId, 
            prisma
        )

        const otherUserAccessToken = await loginUser(
            otherUser.email, 
            "password", 
            app
        )     

        const newResource: CreateResourceDto = {
            url: "http://www.github.com/chingux",
            title: "Chingu Github repo"
        };

        return request(app.getHttpServer())
            .post(`/voyages/${voyageTeamId}/resources`)
            .set("Authorization", `Bearer ${otherUserAccessToken}`)
            .send(newResource)
            .expect(401)
    });

    it("/GET voyages/:teamId/resources", async () => {
        const userEmail: string = "jessica.williamson@gmail.com" 
        const { voyageTeamId } = await findVoyageTeamMemberByEmail(
            userEmail,
            prisma
        )

        const userAccessToken = await loginUser(
            userEmail, 
            "password", 
            app
        )

        const resourceCount: number = await prisma.teamResource.count({
            where: {
                addedBy: {
                    voyageTeamId,
                },
            },
        });

        return request(app.getHttpServer())
            .get(`/voyages/${voyageTeamId}/resources`)
            .set("Authorization", `Bearer ${userAccessToken}`)
            .expect(200)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual(
                    expect.arrayContaining([
                        {
                            ...resourceShape,
                            addedBy: expect.objectContaining({
                                member: memberShape,
                            }),
                        },
                    ]),
                );
                expect(res.body).toHaveLength(resourceCount);
            });
    });

    it("should not allow users to GET other teams' resources", async () => {
        const userEmail: string = "dan@random.com" 
        const { voyageTeamId } = await findVoyageTeamMemberByEmail(
            userEmail,
            prisma
        )

        const otherUser = await findUserOnOtherTeam(
            voyageTeamId, 
            prisma
        )

        const otherUserAccessToken = await loginUser(
            otherUser.email, 
            "password", 
            app
        )     
        console.log(otherUserAccessToken, otherUser, voyageTeamId)
        return request(app.getHttpServer())
            .get(`/voyages/${voyageTeamId}/resources`)
            .set("Authorization", `Bearer ${otherUserAccessToken}`)
            .expect(401)
    });

    it("/PATCH :teamId/resources/:resourceId", async () => {
        const userEmail: string = "jessica.williamson@gmail.com" 
        const { voyageTeamId } = await findVoyageTeamMemberByEmail(
            userEmail,
            prisma
        )

        const userAccessToken = await loginUser(
            userEmail, 
            "password", 
            app
        )

        const resourceToPatch = await prisma.teamResource.findFirst({
            where: {
                addedBy: {
                    member: {
                        email: userEmail
                    }
                }
            }
        })

        const resourceId: number = resourceToPatch.id;
        const patchedResource: UpdateResourceDto = {
            url: "http://www.github.com/chingu-x/chingu-dashboard-be",
            title: "Chingu Github BE repo"
        };

        return request(app.getHttpServer())
            .patch(`/voyages/${voyageTeamId}/resources/${resourceId}`)
            .set("Authorization", `Bearer ${userAccessToken}`)
            .send(patchedResource)
            .expect(200)
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.body).toEqual({
                    ...resourceShape,
                });
            });
    });

    it("should only allow resource creator to patch", async () => {
        const userEmail: string = "jessica.williamson@gmail.com" 
        const { voyageTeamId } = await findVoyageTeamMemberByEmail(
            userEmail,
            prisma
        )

        const otherUser = await findUserOnOtherTeam(
            voyageTeamId, 
            prisma
        )

        const otherUserAccessToken = await loginUser(
            otherUser.email, 
            "password", 
            app
        )        

        const resourceToPatch = await prisma.teamResource.findFirst({
            where: {
                addedBy: {
                    voyageTeamId
                }
            }
        })

        const resourceId: number = resourceToPatch.id;
        const patchedResource: UpdateResourceDto = {
            url: "http://www.github.com/chingu-x/chingu-dashboard-be",
            title: "Chingu Github BE repo"
        };

        return request(app.getHttpServer())
            .patch(`/voyages/${voyageTeamId}/resources/${resourceId}`)
            .set("Authorization", `Bearer ${otherUserAccessToken}`)
            .send(patchedResource)
            .expect(401);
    });

    it("/DELETE :teamId/resources/:resourceId", async () => {
        const userEmail: string = "jessica.williamson@gmail.com" 
        const { voyageTeamId } = await findVoyageTeamMemberByEmail(
            userEmail,
            prisma
        )

        const userAccessToken = await loginUser(
            userEmail, 
            "password", 
            app
        )

        const resourceToDelete = await prisma.teamResource.findFirst({
            where: {
                addedBy: {
                    member: {
                        email: userEmail
                    }
                }
            }
        })

        const resourceId: number = resourceToDelete.id;

        return request(app.getHttpServer())
            .delete(`/voyages/${voyageTeamId}/resources/${resourceId}`)
            .set("Authorization", `Bearer ${userAccessToken}`)
            .expect((res) => {
                expect(res.body).toEqual({
                    ...resourceShape,
                });
            });
    });

    it("should only allow resource creator to delete", async () => {
        const userEmail: string = "jessica.williamson@gmail.com" 
        const { voyageTeamId } = await findVoyageTeamMemberByEmail(
            userEmail,
            prisma
        )

        const otherUser = await findUserOnOtherTeam(
            voyageTeamId, 
            prisma
        )

        const otherUserAccessToken = await loginUser(
            otherUser.email, 
            "password", 
            app
        )

        const resourceToDelete = await prisma.teamResource.findFirst({
            where: {
                addedBy: {
                    voyageTeamId
                }
            }
        })

        const resourceId: number = resourceToDelete.id;

        return request(app.getHttpServer())
            .delete(`/voyages/${voyageTeamId}/resources/${resourceId}`)
            .set("Authorization", `Bearer ${otherUserAccessToken}`)
            .expect(401);
    });

});
