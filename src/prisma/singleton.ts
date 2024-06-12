import { mockDeep, DeepMockProxy, mockReset } from "jest-mock-extended";
import prisma from "./client";
import { PrismaClient } from "@prisma/client";

jest.mock("./client", () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
    mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
