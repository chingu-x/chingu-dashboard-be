import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from "@nestjs/common";
import { ForbiddenError } from "@casl/ability";
import { Response } from "express";

@Catch(ForbiddenError)
export class CASLForbiddenExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof ForbiddenError) {
            const status = HttpStatus.FORBIDDEN;
            response.status(status).json({
                statusCode: 403,
                message:
                    "Forbidden: You do not have the required permission to perform this action - CASL exception filter",
            });
        }
    }
}
