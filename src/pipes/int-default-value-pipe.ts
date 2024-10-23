// This pipe is used to set a default value for a parameter in a route handler.
// Without the pipe, controller returns NaN for optional query, results in default value (in service files) not being applied

import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class IntDefaultValuePipe implements PipeTransform {
    constructor(private readonly defaultValue: number) {}

    transform(value: string, _metadata: ArgumentMetadata): any {
        const val = parseInt(value, 10);
        return isNaN(val) ? this.defaultValue : val;
    }
}
