import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { PrismaClientExceptionFilter } from "./exception-filters/prisma-client-exception.filter";
import { Logger, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { CASLForbiddenExceptionFilter } from "./exception-filters/casl-forbidden-exception.filter";
import { RequestLogging } from "./middleware/requests-logging";

async function bootstrap() {
    const requestLogger = new Logger("Requests");
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: [
            "http://localhost:3000",
            /^https:\/\/chingu-dashboard-[A-Za-z]+-chingu-dashboard\.vercel\.app$/,
            "https://chingu-dashboard-git-dev-chingu-dashboard.vercel.app",
            "https://chingu-dashboard.vercel.app",
        ],
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true,
    });
    RequestLogging(app, requestLogger);
    app.use(cookieParser());
    app.setGlobalPrefix("api/v1");

    app.useGlobalPipes(new ValidationPipe());

    if (process.env.NODE_ENV !== "production") {
        const config = new DocumentBuilder()
            .setTitle("Chingu Dashboard Project")
            .setDescription(
                "Chingu Dashboard API<br> default access: logged in (user)",
            )
            .setVersion("1.0")
            .addBearerAuth()
            .addOAuth2()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup("docs", app, document, {
            swaggerOptions: {
                tagsSorter: "alpha",
                operationSorter: "alpha",
            },
        });
    }

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    app.useGlobalFilters(new CASLForbiddenExceptionFilter());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    const port = parseInt(process.env.PORT as string);
    await app.listen(port);
}

bootstrap();
