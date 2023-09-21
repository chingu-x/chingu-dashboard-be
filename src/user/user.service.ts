import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUser() {
        console.log(process.env.NODE_ENV);
        const users = await this.prisma.user.findMany();
        return users;
    }
}
