import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { seed } from "../prisma/seed/seed";
import * as request from "supertest";
import * as cookieParser from "cookie-parser";
import { extractCookieByKey, extractResCookieValueByKey } from "./utils";
import { PrismaService } from "../src/prisma/prisma.service";
import { comparePassword } from "../src/utils/auth";

const signupUrl = "/auth/signup";
const loginUrl = "/auth/login";
const logoutUrl = "/auth/logout";
const resendUrl = "/auth/resend-email";
const verifyUrl = "/auth/verify-email";
const resetRequestUrl = "/auth/reset-password/request";
const resetPWUrl = "/auth/reset-password";
const revokeRTUrl = "/auth/refresh/userId";
const loginAndGetTokens = async (
    email: string,
    password: string,
    app: INestApplication,
) => {
    const r = await request(app.getHttpServer()).post(loginUrl).send({
        email,
        password,
    });

    const access_token = extractCookieByKey(
        r.headers["set-cookie"],
        "access_token",
    );
    const refresh_token = extractCookieByKey(
        r.headers["set-cookie"],
        "refresh_token",
    );

    return { access_token, refresh_token };
};

const getUserIdByEmail = async (email: string, prisma: PrismaService) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });

    return user.id;
};

const requestAndGetResetToken = async (
    email: string,
    app: INestApplication,
    prisma: PrismaService,
) => {
    await request(app.getHttpServer()).post(resetRequestUrl).send({
        email,
    });
    const userInDb = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            resetToken: true,
        },
    });
    return userInDb.resetToken.token;
};

describe("AuthController e2e Tests", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let cookie: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        await seed();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        app.useGlobalPipes(new ValidationPipe());
        app.use(cookieParser());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe("Creating new users POST /auth/signup", () => {
        it("should create a new user", async () => {
            return request(app.getHttpServer())
                .post(signupUrl)
                .send({
                    email: "testuser@example.com",
                    password: "password",
                })
                .expect(200);
        });

        it("should return 400 when email is not valid", async () => {
            return request(app.getHttpServer())
                .post(signupUrl)
                .send({})
                .expect(400);
        });

        it("should return 400 when password is not valid", async () => {
            return request(app.getHttpServer())
                .post(signupUrl)
                .send({
                    email: "testuser@example.com",
                    password: "short",
                })
                .expect(400);
        });
    });

    describe("Log in POST auth/login", () => {
        it("should login and return access and refresh token", async () => {
            return request(app.getHttpServer())
                .post(loginUrl)
                .send({
                    email: "jessica.williamson@gmail.com",
                    password: "password",
                })
                .expect(200)
                .then((res) => {
                    // extract cookie for other tests
                    cookie = res.headers["set-cookie"];
                    const joinedCookie = cookie.join("");
                    expect(joinedCookie).toContain("access_token");
                    expect(joinedCookie).toContain("refresh_token");
                });
        });

        it("should return 400 if account does not exist", async () => {
            return request(app.getHttpServer())
                .post(loginUrl)
                .send({
                    email: "notexist@example.com",
                    password: "password",
                })
                .expect(400);
        });

        it("should return 401 if account exists but wrong password", async () => {
            return request(app.getHttpServer())
                .post(loginUrl)
                .send({
                    email: "jessica.williamson@gmail.com",
                    password: "wrongpassword",
                })
                .expect(401);
        });
    });

    describe("Logout POST auth/logout", () => {
        it("should logout", async () => {
            return request(app.getHttpServer())
                .post(logoutUrl)
                .set("Cookie", cookie)
                .expect(200);
        });

        it("should return 401 unauthorized if no access_token in cookie", async () => {
            return request(app.getHttpServer()).post(logoutUrl).expect(401);
        });

        it("should return 400 if no refresh_token in cookie", async () => {
            return request(app.getHttpServer())
                .post(logoutUrl)
                .set("Cookie", extractCookieByKey(cookie, "access_token"))
                .expect(400);
        });
    });

    describe("Send request to resend verification email POST /auth/resend-email", () => {
        it("should return 200 if user exist", async () => {
            return request(app.getHttpServer())
                .post(resendUrl)
                .set("Cookie", cookie)
                .send({
                    email: "jessica.williamson@gmail.com",
                })
                .expect(200);
        });

        it("should return 200 if user does not exist", async () => {
            return request(app.getHttpServer())
                .post(resendUrl)
                .set("Cookie", cookie)
                .send({
                    email: "notexist@example.com",
                })
                .expect(200);
        });

        it("should return 401 if the user is not logged in", async () => {
            return request(app.getHttpServer())
                .post(resendUrl)
                .send({
                    email: "jessica.williamson@gmail.com",
                })
                .expect(401);
        });
    });

    describe("Verify email POST /auth/verify-email", () => {
        it("should return 200 if verification is successful, verified should be true, and token removed from db", async () => {
            const newUserEmail = "verifyTest@example.com";

            // register a new user
            await request(app.getHttpServer()).post(signupUrl).send({
                email: newUserEmail,
                password: "password",
            });

            const userInDb = await prisma.user.findUnique({
                where: {
                    email: newUserEmail,
                },
                select: {
                    emailVerificationToken: true,
                },
            });

            const { access_token } = await loginAndGetTokens(
                newUserEmail,
                "password",
                app,
            );

            await request(app.getHttpServer())
                .post(verifyUrl)
                .set("Cookie", access_token)
                .send({
                    token: userInDb.emailVerificationToken.token,
                })
                .expect(200);

            const userAfterVerify = await prisma.user.findUnique({
                where: {
                    email: newUserEmail,
                },
                select: {
                    emailVerified: true,
                    emailVerificationToken: true,
                },
            });

            expect(userAfterVerify.emailVerified).toBe(true);
            expect(userAfterVerify.emailVerificationToken).toBe(null);
        });

        it("should return 401 if token mismatch, emailVerified = false, token still in database", async () => {
            const newUserEmail = "verifyTest2@example.com";
            // register a new user
            await request(app.getHttpServer()).post(signupUrl).send({
                email: newUserEmail,
                password: "password",
            });

            const { access_token } = await loginAndGetTokens(
                newUserEmail,
                "password",
                app,
            );

            await request(app.getHttpServer())
                .post(verifyUrl)
                .set("Cookie", access_token)
                .send({
                    token: "random token",
                })
                .expect(401);

            const userAfterVerify = await prisma.user.findUnique({
                where: {
                    email: newUserEmail,
                },
                select: {
                    emailVerified: true,
                    emailVerificationToken: true,
                },
            });

            expect(userAfterVerify.emailVerified).toBe(false);
            expect(userAfterVerify.emailVerificationToken).toBeDefined();
        });

        it("should return 401 if the user is not logged in", async () => {
            return request(app.getHttpServer()).post(verifyUrl).expect(401);
        });
    });

    describe("Get Refresh token POST /auth/refresh", () => {
        const refreshUrl = "/auth/refresh";
        describe("should return 200 on successful refresh, and return both new access and new refresh token", () => {
            it("has valid access token and refresh token", async () => {
                const { access_token, refresh_token } = await loginAndGetTokens(
                    "jessica.williamson@gmail.com",
                    "password",
                    app,
                );
                await request(app.getHttpServer())
                    .post(refreshUrl)
                    .set("Cookie", [access_token, refresh_token])
                    .expect(200)
                    .then((res) => {
                        // check new tokens exist and different from old tokens
                        const newAccessToken = extractResCookieValueByKey(
                            res.headers["set-cookie"],
                            "access_token",
                        );
                        const newRefreshToken = extractResCookieValueByKey(
                            res.headers["set-cookie"],
                            "refresh_token",
                        );
                        expect(newAccessToken).not.toEqual(access_token);
                        expect(newRefreshToken).not.toEqual(refresh_token);
                    });
            });
            it("has valid refresh token and no access token", async () => {
                const { access_token, refresh_token } = await loginAndGetTokens(
                    "jessica.williamson@gmail.com",
                    "password",
                    app,
                );
                await request(app.getHttpServer())
                    .post(refreshUrl)
                    .set("Cookie", refresh_token)
                    .expect(200)
                    .then((res) => {
                        // check new tokens exist and different from old tokens
                        const newAccessToken = extractResCookieValueByKey(
                            res.headers["set-cookie"],
                            "access_token",
                        );
                        const newRefreshToken = extractResCookieValueByKey(
                            res.headers["set-cookie"],
                            "refresh_token",
                        );
                        expect(newAccessToken).not.toEqual(access_token);
                        expect(newRefreshToken).not.toEqual(refresh_token);
                    });
            });
        });

        it("should return 401 if no refresh token in cookie", async () => {
            const { access_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .post(refreshUrl)
                .set("Cookie", access_token)
                .expect(401);
        });

        it("should return 401 if no access token is invalid or belong to another person", async () => {
            const { access_token: wrongToken } = await loginAndGetTokens(
                "l.castro@outlook.com",
                "password",
                app,
            );
            await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await request(app.getHttpServer())
                .post(refreshUrl)
                .set("Cookie", wrongToken)
                .expect(401);
        });

        it("should return 401 if refresh token is not valid", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            const temperedRefreshToken =
                refresh_token.substring(0, 20) +
                "6Y4" +
                refresh_token.substring(20 + 3);

            await request(app.getHttpServer())
                .post(refreshUrl)
                .set("Cookie", [access_token, temperedRefreshToken])
                .expect(401);
        });

        it("should return 403 if refresh token is refresh token is revoked", async () => {
            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );
            await prisma.user.update({
                where: {
                    email: "jessica.williamson@gmail.com",
                },
                data: {
                    refreshToken: null,
                },
            });

            await request(app.getHttpServer())
                .post(refreshUrl)
                .set("Cookie", [access_token, refresh_token])
                .expect(403);
        });
    });

    describe("Revoke Refresh Token DELETE /auth/refresh/userId", () => {
        it("should return 200 if refresh token is revoked", async () => {
            await loginAndGetTokens("l.castro@outlook.com", "password", app);

            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );

            await prisma.user.update({
                where: {
                    email: "l.castro@outlook.com",
                },
                data: {
                    refreshToken: null,
                },
            });

            await request(app.getHttpServer())
                .delete(revokeRTUrl)
                .set("Cookie", [access_token, refresh_token])
                .send({ email: "l.castro@outlook.com" })
                .expect(200);
        });

        it("should return 401 if email is invalid", async () => {
            await loginAndGetTokens("l.castro@outlook.com", "password", app);

            const { access_token, refresh_token } = await loginAndGetTokens(
                "jessica.williamson@gmail.com",
                "password",
                app,
            );

            await request(app.getHttpServer())
                .delete(revokeRTUrl)
                .set("Cookie", [access_token, refresh_token])
                .send({})
                .expect(404);
        });

        it("should return 403 if user is not permitted", async () => {
            await loginAndGetTokens("l.castro@outlook.com", "password", app);

            const { access_token, refresh_token } = await loginAndGetTokens(
                "dan@random.com",
                "password",
                app,
            );

            await request(app.getHttpServer())
                .delete(revokeRTUrl)
                .set("Cookie", [access_token, refresh_token])
                .send({
                    email: "l.castro@outlook.com",
                })
                .expect(403);
        });
    });

    describe("Request password reset POST /auth/reset-password/request", () => {
        it("should return 200 if user account exist, resetToken should be in the database", async () => {
            const userEmail = "jessica.williamson@gmail.com";
            await request(app.getHttpServer())
                .post(resetRequestUrl)
                .send({
                    email: userEmail,
                })
                .expect(200);
            // check token is in the database
            const resetToken = await prisma.resetToken.findUnique({
                where: {
                    userId: await getUserIdByEmail(userEmail, prisma),
                },
                select: {
                    token: true,
                },
            });
            expect(resetToken?.token).not.toBeNull();
        });
        it("should return 200 if user account does not exist", async () => {
            const userEmail = "notexist@example.com";
            await request(app.getHttpServer())
                .post(resetRequestUrl)
                .send({
                    email: userEmail,
                })
                .expect(200);
        });
        it("should return 400 if no email is in the request body", async () => {
            await request(app.getHttpServer())
                .post(resetRequestUrl)
                .expect(400);
        });
        it("should return 400 if no email is not a valid email", async () => {
            await request(app.getHttpServer())
                .post(resetRequestUrl)
                .send({
                    email: "notAValidEmail",
                })
                .expect(400);
        });
    });

    describe("Reset password POST /auth/reset-password", () => {
        const email = "jessica.williamson@gmail.com";
        const newPassword = "newPassword";
        it("should return 200 if password is reset successfully, and new password should match req.password", async () => {
            const resetToken = await requestAndGetResetToken(
                email,
                app,
                prisma,
            );
            await request(app.getHttpServer())
                .post(resetPWUrl)
                .send({
                    email,
                    password: newPassword,
                    token: resetToken,
                })
                .expect(200);

            const userInDb = await prisma.user.findUnique({
                where: {
                    email,
                },
                select: {
                    password: true,
                },
            });

            expect(
                await comparePassword(newPassword, userInDb.password),
            ).toBeTruthy();
        });
        it("should return 401 if token is expired", async () => {
            const expiredToken =
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ4UmNjOExOWVNWeGxUalZCbnR1ZTN3YndwVVcycFh2R3RqbVhRVUpHdndzYkVkUUNGcjdrLUVSV0pCeWlFdEZ2VnN6R1IyYVBMTXRIS2N0S2ZDcVNQUSIsInVzZXJJZCI6IjEzY2QzNmU0LWExZmEtNDc5Zi1iYTM5LTk4MGIxYjIxN2IwYyIsImlhdCI6MTcwODA5MjIyNCwiZXhwIjoxNzA4MDk1ODI0fQ.C88C4Cl6vci2YLr3pfxRuMVdzmAd15trXr7e7YQ5leo";

            await request(app.getHttpServer())
                .post(resetPWUrl)
                .send({
                    email,
                    password: newPassword,
                    token: expiredToken,
                })
                .expect(401);
        });
        it("should return 401 if token is malformed", async () => {
            await request(app.getHttpServer())
                .post(resetPWUrl)
                .send({
                    email,
                    password: newPassword,
                    token: "wrongToken",
                })
                .expect(401);
        });
        describe("Should return 400 if request body is not valid", () => {
            it("invalid email", async () => {
                const token = await requestAndGetResetToken(email, app, prisma);
                await request(app.getHttpServer())
                    .post(resetPWUrl)
                    .send({
                        email: "notAnEmail",
                        password: newPassword,
                        token,
                    })
                    .expect(400);
            });
            it("missing email", async () => {
                const token = await requestAndGetResetToken(email, app, prisma);
                await request(app.getHttpServer())
                    .post(resetPWUrl)
                    .send({
                        password: "short",
                        token,
                    })
                    .expect(400);
            });
            it("invalid password", async () => {
                const token = await requestAndGetResetToken(email, app, prisma);
                await request(app.getHttpServer())
                    .post(resetPWUrl)
                    .send({
                        email,
                        password: "short",
                        token,
                    })
                    .expect(400);
            });
            it("missing password", async () => {
                const token = await requestAndGetResetToken(email, app, prisma);
                await request(app.getHttpServer())
                    .post(resetPWUrl)
                    .send({
                        email,
                        token,
                    })
                    .expect(400);
            });
            it("missing token", async () => {
                await request(app.getHttpServer())
                    .post(resetPWUrl)
                    .send({
                        email,
                        password: newPassword,
                    })
                    .expect(400);
            });
        });
    });
});
