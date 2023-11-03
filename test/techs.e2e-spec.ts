import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";

describe("TechsController (e2e)", () => {
    let app: INestApplication;
    let prisma: PrismaService;

    const techCategoryShape = expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
    });

    const techItemShape = expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        category: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
    });

    const techStackItemVoteShape = expect.objectContaining({
        id: expect.any(Number),
        teamId: expect.any(Number),

        createdAt: expect.any(String),
        updatedAt: expect.any(String),
    });
});
