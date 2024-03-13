import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "src/prisma/prisma.service";
import { seed } from "../prisma/seed/seed";
import { extractResCookieValueByKey } from "./utils";

describe("Users Controller (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let userAccessToken: string;

    async function loginUser() {
        await request(app.getHttpServer())
            .post("/auth/login")
            .send({
                email: "jessica.williamson@gmail.com",
                password: "password",
            })
            .expect(200)
            .then((res) => {
                userAccessToken = extractResCookieValueByKey(
                    res.headers["set-cookie"],
                    "access_token",
                );
            });
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        await seed();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    beforeEach(async () => {
        await loginUser();
    });

    describe("/users", () => {
        it("GET - 200 returns all users", async () => {
            return await request(app.getHttpServer())
                .get("/users")
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                    res.body.forEach((user) => {
                        expect(user).toEqual(
                            expect.objectContaining({
                                id: expect.any(String),
                                firstName: expect.any(String),
                                lastName: expect.any(String),
                                roles: expect.arrayContaining([
                                    expect.stringMatching(/admin|voyager/),
                                ]),
                                avatar: expect.any(String),
                                githubId: expect.any(String),
                                discordId: expect.any(String),
                                twitterId: expect.any(String),
                                linkedinId: expect.any(String || null),
                                email: expect.any(String),
                                countryCode: expect.any(String),
                                timezone: expect.any(String),
                                comment: expect.any(String),
                                gender: expect.objectContaining({
                                    abbreviation: expect.any(String),
                                    description: expect.any(String),
                                    id: expect.any(Number),
                                }),
                                emailVerified: expect.any(Boolean),
                                voyageTeamMembers: expect.arrayContaining([
                                    expect.objectContaining({
                                        hrPerSprint: expect.any(Number),
                                        id: expect.any(Number),
                                        status: expect.objectContaining({
                                            name: expect.any(String),
                                        }),
                                        voyageRole: expect.objectContaining({
                                            name: expect.any(String),
                                        }),
                                        voyageTeam: expect.objectContaining({
                                            id: expect.any(Number),
                                            name: expect.any(String),
                                            tier: expect.objectContaining({
                                                name: expect.any(String),
                                            }),
                                        }),
                                    }),
                                ]),
                            }),
                        );
                    });
                });
        });

        it("should return 401 if authorized token isn't present", async () => {
            return request(app.getHttpServer())
                .get("/users")
                .set("Authorization", `Bearer ${undefined}`)
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });

    describe("/users/me", () => {
        it("GET - 200 Gets a logged in users detail via userId:uuid in jwt token", async () => {
            return await request(app.getHttpServer())
                .get("/users/me")
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: expect.any(String),
                            firstName: expect.any(String),
                            lastName: expect.any(String),
                            roles: expect.arrayContaining(["admin"]),
                            avatar: expect.any(String),
                            githubId: expect.any(String),
                            discordId: expect.any(String),
                            twitterId: expect.any(String),
                            linkedinId: expect.any(String),
                            email: expect.any(String),
                            countryCode: expect.any(String),
                            timezone: expect.any(String),
                            voyageTeamMembers: expect.arrayContaining([
                                {
                                    id: expect.any(Number),
                                    voyageTeamId: expect.any(Number),
                                    voyageTeam: {
                                        name: expect.any(String),
                                        voyage: {
                                            number: expect.any(Number),
                                            status: {
                                                name: expect.any(String),
                                            },
                                        },
                                    },
                                    voyageRole: {
                                        name: expect.any(String),
                                    },
                                },
                            ]),
                        }),
                    );
                });
        });

        it("should return 401 if authorized token isn't present", async () => {
            return request(app.getHttpServer())
                .get("/users/me")
                .set("Authorization", `Bearer ${undefined}`)
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });

    const getUserID = async () => {
        const user = await prisma.user.findUnique({
            where: {
                email: "jessica.williamson@gmail.com",
            },
        });
        return user.id;
    };

    describe("/users/id/:userId", () => {
        it("GET - 200 returns a user with full details given a userId (uuid)", async () => {
            return await request(app.getHttpServer())
                .get(`/users/id/${getUserID()}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: getUserID(),
                            email: "jessica.williamson@gmail.com",
                            emailVerified: true,
                            firstName: "Jessica",
                            lastName: "Williamson",
                            roles: expect.arrayContaining(["voyager", "admin"]),
                            avatar: "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=robohash&r=x",
                            githubId: "jess-github",
                            discordId: "jess-discord",
                            twitterId: "jess-twitter",
                            linkedinId: "jess-linkedin",
                            gender: {
                                id: 1,
                                abbreviation: "F",
                                description: "female",
                            },
                            countryCode: "AU",
                            timezone: "Australia/Melbourne",
                            comment: null,
                            voyageTeamMembers: expect.arrayContaining([
                                {
                                    id: expect.any(Number),
                                    voyageTeam: {
                                        id: expect.any(Number),
                                        name: expect.any(String),
                                        tier: {
                                            name: expect.any(String),
                                        },
                                    },
                                    voyageRole: {
                                        name: expect.any(String),
                                    },
                                    status: {
                                        name: "Active",
                                    },
                                    hrPerSprint: 10,
                                },
                            ]),
                        }),
                    );
                });
        });

        it("should return 404 if the user is not found", async () => {
            await request(app.getHttpServer())
                .get("/users/id/6bd33861-04c0-4270-8e96-62d4fb587527") // Replace with a non-existent UUID
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(HttpStatus.NOT_FOUND);
        });

        it("should return 401 if authorized token isn't present", async () => {
            return request(app.getHttpServer())
                .get(`/users/id/${getUserID()}`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });

    describe("/users/email/:email", () => {
        it("Gets a user with full details given an email", async () => {
            const email: string = "jessica.williamson@gmail.com";
            return await request(app.getHttpServer())
                .get(`/users/email/${email}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual(fullUserDetailSelect);
                });
        });

        it("should return 404 if the user is not found", async () => {
            const email: string = "userdefault@gmail.com";
            await request(app.getHttpServer())
                .get(`/users/email/${email}`)
                .set("Authorization", `Bearer ${userAccessToken}`)
                .expect(HttpStatus.NOT_FOUND);
        });

        it("should return 401 if authorized token isn't present", async () => {
            const email: string = "jessica.williamson@gmail.com";
            return request(app.getHttpServer())
                .get(`/users/email/${email}`)
                .set("Authorization", `Bearer ${undefined}`)
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });
});

const fullUserDetailSelect = {
    id: expect.any(String),
    email: "jessica.williamson@gmail.com",
    emailVerified: true,
    firstName: "Jessica",
    lastName: "Williamson",
    roles: expect.arrayContaining(["voyager", "admin"]),
    avatar: "https://gravatar.com/avatar/3bfaef00e02a22f99e17c66e7a9fdd31?s=400&d=robohash&r=x",
    githubId: "jess-github",
    discordId: "jess-discord",
    twitterId: "jess-twitter",
    linkedinId: "jess-linkedin",
    gender: {
        id: 1,
        abbreviation: "F",
        description: "female",
    },
    countryCode: "AU",
    timezone: "Australia/Melbourne",
    comment: null,
    voyageTeamMembers: expect.arrayContaining([
        {
            id: expect.any(Number),
            voyageTeam: {
                id: expect.any(Number),
                name: expect.any(String),
                tier: {
                    name: expect.any(String),
                },
            },
            voyageRole: {
                name: expect.any(String),
            },
            status: {
                name: "Active",
            },
            hrPerSprint: 10,
        },
    ]),
};
