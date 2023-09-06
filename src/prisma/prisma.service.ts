import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: "postgresql://andresc:a1s2d3fr@localhost:5432/chingu?schema=public"
                },
            }
        })
    }
}
