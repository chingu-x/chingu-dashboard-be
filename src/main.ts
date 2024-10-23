import { Logger, ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { PrismaClientExceptionFilter } from "./exception-filters/prisma-client-exception.filter";
import { CASLForbiddenExceptionFilter } from "./exception-filters/casl-forbidden-exception.filter";
import { RequestLogging } from "./middleware/requests-logging";
import { AppConfigService } from "./config/app/appConfig.service";

async function bootstrap() {
    const requestLogger = new Logger("Requests");
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: [
            /^http:\/\/localhost:\d+$/,
            /^https:\/\/chingu-dashboard-[A-Za-z0-9\-_]+-chingu-dashboard\.vercel\.app$/,
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
    const NODE_ENV = app.get(AppConfigService).nodeEnv;
    if (NODE_ENV !== "production") {
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
    const appConfig = app.get(AppConfigService);

    const port = appConfig.appPort;
    await app.listen(port);
}

bootstrap();
