import { VoyageTeamMember } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { VoyageTeamEntity } from "./team.entity";
import { VoyageUserEntity } from "../../users/entities/user.entity";
import { VoyageRoleEntity } from "../../global/entities/voyage-role.entity";

export class VoyageTeamMemberEntity implements VoyageTeamMember {
    constructor(partial: Partial<VoyageTeamMemberEntity>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: number;

    userId: string;

    @ApiProperty()
    user: VoyageUserEntity;

    voyageTeamId: number;

    voyageTeam: VoyageTeamEntity;

    voyageRoleId: number;

    @ApiProperty()
    voyageRole: VoyageRoleEntity;

    @ApiProperty()
    statusId: number;

    @ApiProperty()
    hrPerSprint: number;

    createdAt: Date;

    updatedAt: Date;
}

export class VoyageTeamMemberUpdateEntity implements VoyageTeamMember {
    constructor(partial: Partial<VoyageTeamMemberEntity>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: number;

    @ApiProperty()
    userId: string;

    user: VoyageUserEntity;

    @ApiProperty()
    voyageTeamId: number;

    voyageTeam: VoyageTeamEntity;

    @ApiProperty()
    voyageRoleId: number;

    voyageRole: VoyageRoleEntity;

    @ApiProperty()
    statusId: number;

    @ApiProperty()
    hrPerSprint: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
