import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { FormResponseDto } from "../global/dtos/FormResponse.dto";

const responseIndex = ["response", "responses"];

@Injectable()
export class FormInputValidationPipe implements PipeTransform {
    transform(value: any): any {
        for (const index in value) {
            if (responseIndex.includes(index)) {
                if (!Array.isArray(value[index]))
                    throw new BadRequestException(
                        `'responses' is not an array`,
                    );
                value[index].forEach((v: FormResponseDto) => {
                    if (!v.questionId) {
                        throw new BadRequestException(
                            `Question id is missing for one of the responses.`,
                        );
                    }
                    if (
                        !v.text &&
                        !v.numeric &&
                        !v.boolean &&
                        !v.optionChoiceId
                    )
                        throw new BadRequestException(
                            `All response fields are empty for question ID ${v.questionId}`,
                        );
                });
            }
        }
        return value;
    }
}
