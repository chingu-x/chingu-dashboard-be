import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { PrismaClientExceptionFilter } from "./prisma-client-exception/prisma-client-exception.filter";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("api/v1");

    const config = new DocumentBuilder()
        .setTitle("Chingu Dashboard Project")
        .setDescription("The api for chingu dashboard")
        .setVersion("1.0")
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    app.useGlobalPipes(new ValidationPipe())

    const port = parseInt(process.env.PORT);
    await app.listen(port);
}

bootstrap();
