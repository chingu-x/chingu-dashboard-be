import { Module } from "@nestjs/common";
import { VoyagesService } from "./voyages.service";
import { VoyagesController } from "./voyages.controller";

@Module({
    controllers: [VoyagesController],
    providers: [VoyagesService],
})
export class VoyagesModule {}
