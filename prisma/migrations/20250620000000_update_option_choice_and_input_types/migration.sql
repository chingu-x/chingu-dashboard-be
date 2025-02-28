

-- Add new input types
INSERT INTO "InputType" ("name", "createdAt", "updatedAt")
VALUES ('no-input-image', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('no-input-text', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Create a temporary table to store radioIcon questions
CREATE TEMPORARY TABLE temp_radio_icon_questions AS
SELECT q.id
FROM "Question" q
JOIN "InputType" it ON q."inputTypeId" = it.id
WHERE it.name = 'radioIcon';

-- Update radioIcon questions to use radio input type
UPDATE "Question" q
SET "inputTypeId" = (SELECT id FROM "InputType" WHERE name = 'radio')
FROM temp_radio_icon_questions t
WHERE q.id = t.id;

-- Delete the radioIcon input type
DELETE FROM "InputType" WHERE name = 'radioIcon';

-- Drop the temporary table
DROP TABLE temp_radio_icon_questions;