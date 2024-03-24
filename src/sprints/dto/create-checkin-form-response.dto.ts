import { FormResponseDto } from "../../global/dtos/FormResponse.dto";

export class CreateCheckinFormResponseDto {
    sprintId: number;
    responses: FormResponseDto[];
}
