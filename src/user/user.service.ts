import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

const USER_ID = "bf24212d-403f-4459-aa76-d9abc701a3bf";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUser() {
        const users = await this.prisma.user.findUnique({
            where: {
                id: USER_ID,
            },
            include: {
                voyageTeamMembers: true,
            },
        });

        return users;
    }
}
