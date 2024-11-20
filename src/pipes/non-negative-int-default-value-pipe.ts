// This pipe is used to set a default value for a parameter in a route handler.
// Without the pipe, controller returns NaN for optional query, results in default value (in service files) not being applied

import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from "@nestjs/common";

@Injectable()
export class NonNegativeIntDefaultValuePipe implements PipeTransform {
    constructor(private readonly defaultValue: number) {}

    transform(value: string, metadata: ArgumentMetadata): any {
        const val = parseInt(value, 10);
        if (val < 0)
            throw new BadRequestException(
                `Invalid ${metadata.data} value. ${metadata.data} must be non negative.`,
            );
        return isNaN(val) ? this.defaultValue : val;
    }
}
