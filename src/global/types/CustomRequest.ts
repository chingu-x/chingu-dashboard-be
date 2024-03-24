import { Request } from "express";

type VoyageTeam = {
    teamId: number;
    memberId: number;
};

export interface CustomRequest extends Request {
    user: {
        userId: string;
        email: string;
        roles: string[];
        voyageTeams: VoyageTeam[];
    };
}
