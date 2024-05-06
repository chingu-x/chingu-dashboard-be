import { Module } from "@nestjs/common";
import { VoyagesService } from "./voyages.service";
import { VoyagesController } from "./voyages.controller";
import { AbilityModule } from "../ability/ability.module";

@Module({
    imports: [AbilityModule],
    controllers: [VoyagesController],
    providers: [VoyagesService],
})
export class VoyagesModule {}
