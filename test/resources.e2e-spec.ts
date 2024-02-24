jest.setTimeout(70000)

import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { seed } from "../prisma/seed/seed";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import {
    TeamResource,
    User,
    Voyage,
    VoyageTeam,
    VoyageTeamMember,
} from "@prisma/client";
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

    // beforeEach(async () => {
    //     await seed();
    // });

    it("/POST voyages/:teamId/resources", async () => {
        const userAccessToken = await loginUser(
            "jessica.williamson@gmail.com", 
            "password", 
            app
        )

        const { voyageTeamId } = await prisma.voyageTeamMember.findFirst({
            where: {
                member: {
                    email:
                        "jessica.williamson@gmail.com"
                },
            },
            select: {
                voyageTeamId: true
            }
        })
        

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


    it("/GET voyages/:teamId/resources", async () => {
        const userAccessToken = await loginUser(
            "jessica.williamson@gmail.com", 
            "password", 
            app
        )

        const { voyageTeamId } = await prisma.voyageTeamMember.findFirst({
            where: {
                member: {
                    email:
                        "jessica.williamson@gmail.com"
                },
            },
            select: {
                voyageTeamId: true
            }
        })

        const resourceCount: number = await prisma.teamResource.count({
            where: {
                addedBy: {
                    voyageTeamId: voyageTeamId,
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

    it("/PATCH :teamId/resources/:resourceId", async () => {
        const userAccessToken = await loginUser(
            "jessica.williamson@gmail.com", 
            "password", 
            app
        )

        const voyageTeamMember = await prisma.voyageTeamMember.findFirst({
            where: {
                member: {
                    email:
                        "jessica.williamson@gmail.com"
                },
            },
            select: {
                id: true,
                voyageTeamId: true
            }
        })

        const resourceToPatch = await prisma.teamResource.findFirst({
            where: {
                addedBy: {
                    id: voyageTeamMember.id
                }
            }
        })

        const teamId = voyageTeamMember.voyageTeamId
        const resourceId: number = resourceToPatch.id;
        const patchedResource: UpdateResourceDto = {
            url: "http://www.github.com/chingu-x/chingu-dashboard-be",
            title: "Chingu Github BE repo"
        };

        return request(app.getHttpServer())
            .patch(`/voyages/${teamId}/resources/${resourceId}`)
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
        const { voyageTeamId } = await prisma.voyageTeamMember.findFirst({
            where: {
                member: {
                    email:
                        "jessica.williamson@gmail.com"
                },
            },
            select: {
                voyageTeamId: true
            }
        })

        const otherUser = await prisma.user.findFirst({
            where: {
                voyageTeamMembers: {
                    some: {
                        voyageTeamId: {
                            not: voyageTeamId
                        },
                    }
                }
            }
        })

        const otherUserAccessToken = await loginUser(
            otherUser.email, 
            "password", 
            app
        )        

        const resourceToPatch = await prisma.teamResource.findFirst({
            where: {
                addedBy: {
                    voyageTeamId: voyageTeamId
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
        const userAccessToken = await loginUser(
            "jessica.williamson@gmail.com", 
            "password", 
            app
        )

        const voyageTeamMember = await prisma.voyageTeamMember.findFirst({
            where: {
                member: {
                    email:
                        "jessica.williamson@gmail.com"
                },
            },
            select: {
                userId: true,
                voyageTeamId: true
            }
        })

        const resourceToDelete = await prisma.teamResource.findFirst({
            where: {
                addedBy: {
                    userId: voyageTeamMember.userId
                }
            }
        })

        const teamId = voyageTeamMember.voyageTeamId
        const resourceId: number = resourceToDelete.id;

        return request(app.getHttpServer())
            .delete(`/voyages/${teamId}/resources/${resourceId}`)
            .set("Authorization", `Bearer ${userAccessToken}`)
            .expect((res) => {
                expect(res.body).toEqual({
                    ...resourceShape,
                });
            });
    });

    it("should only allow resource creator to delete", async () => {
        // const test = await prisma.teamResource.create({})
        const { voyageTeamId } = await prisma.voyageTeamMember.findFirst({
            where: {
                member: {
                    email:
                        "jessica.williamson@gmail.com"
                },
            },
            select: {
                voyageTeamId: true
            }
        })

        const otherUser = await prisma.user.findFirst({
            where: {
                voyageTeamMembers: {
                    some: {
                        voyageTeamId: {
                            not: voyageTeamId
                        },
                    }
                }
            }
        })

        const otherUserAccessToken = await loginUser(
            otherUser.email, 
            "password", 
            app
        )        

        const resourceToDelete = await prisma.teamResource.findFirst({
            where: {
                addedBy: {
                    voyageTeamId: voyageTeamId
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
