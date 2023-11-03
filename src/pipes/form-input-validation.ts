import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";
import {ResponseDto} from "../sprints/dto/create-meeting-form-response.dto";

@Injectable()
export class FormInputValidationPipe implements PipeTransform {
    transform(value: ResponseDto, metadata: ArgumentMetadata): any {
        for (const index in value) {
            if (index !== "constructor") {
                if (
                    !value[index].text &&
                    !value[index].numeric &&
                    !value[index].boolean &&
                    !value[index].optionChoice
                )
                    throw new BadRequestException(`All response fields are empty for question ID ${value[index].questionId}`)
            }
        }
        return value
    }
}
