import { Prisma } from "@prisma/client";
import { userSelectBasicWithSocial } from "@/global/selects/users.select";

export type SoloProjectWithPayload = Prisma.SoloProjectGetPayload<{
    include: {
        user: {
            include: typeof userSelectBasicWithSocial;
        };
        evaluator: {
            include: typeof userSelectBasicWithSocial;
        };
        status: true;
        comments: true;
        responseGroup: {
            select: {
                responses: {
                    include: {
                        question: true;
                    };
                };
            };
        };
    };
}>;
