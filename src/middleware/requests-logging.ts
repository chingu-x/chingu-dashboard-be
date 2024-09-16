import { Logger } from "@nestjs/common";
import * as morgan from "morgan";

export function RequestLogging(app, logger: Logger) {
    app.use(
        morgan("tiny", {
            stream: {
                write: (message) => {
                    logger.debug(message.replace("\n", ""));
                },
            },
        }),
    );
}
