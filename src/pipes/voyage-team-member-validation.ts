import {
    BadRequestException,
    Injectable,
    PipeTransform,
    Scope,
    Inject,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { CustomRequest } from "@/global/types/CustomRequest";

@Injectable({ scope: Scope.REQUEST })
export class VoyageTeamMemberValidationPipe implements PipeTransform {
    constructor(@Inject(REQUEST) private request: CustomRequest) {}
    transform(value: any): any {
        const voyageTeamMemberId: number = value.voyageTeamMemberId;

        const voyageTeams = this.request.user.voyageTeams;

        const isTeamMember = voyageTeams.some(
            (teams) => teams.memberId === voyageTeamMemberId,
        );

        if (!isTeamMember) {
            throw new BadRequestException(
                "User is not in the specified team, check voyageTeamId or voyageTeamMemberId is correct.",
            );
        }

        return value;
    }
}
