# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Another example [here](https://co-pilot.dev/changelog)

## [Unreleased]

### Added

- Add @ApiResponse tags to resources ([#76](https://github.com/chingu-x/chingu-dashboard-be/pull/76))
- Add @ApiResponse tags to ideations and features ([#65](https://github.com/chingu-x/chingu-dashboard-be/pull/77))
- Add refresh token functionality and global guard to protect all routes ([#78](https://github.com/chingu-x/chingu-dashboard-be/pull/78))
- Add status to voyage table and return in /me endpoint ([#79](https://github.com/chingu-x/chingu-dashboard-be/pull/79))
- Add github action for STG ([#81](https://github.com/chingu-x/chingu-dashboard-be/pull/81))
- Add CHANGELOG.md ([#84](https://github.com/chingu-x/chingu-dashboard-be/pull/84))
- Add Role/Permission guard ([#97](https://github.com/chingu-x/chingu-dashboard-be/pull/97))
- Add e2e tests for auth controller ([#102](https://github.com/chingu-x/chingu-dashboard-be/pull/102))
- Add e2e tests for techs controller ([#103](https://github.com/chingu-x/chingu-dashboard-be/pull/103))
- Add check-in form database implementation and seed data ([#105](https://github.com/chingu-x/chingu-dashboard-be/pull/105))
- Add e2e tests for forms controller ([#107](https://github.com/chingu-x/chingu-dashboard-be/pull/107))
- Add e2e tests for resources controller ([#109](https://github.com/chingu-x/chingu-dashboard-be/pull/109))
- Add e2e tests for sprint controller ([#113](https://github.com/chingu-x/chingu-dashboard-be/pull/113))
- Add new endpoint to revoke refresh token ([#116](https://github.com/chingu-x/chingu-dashboard-be/pull/116))
- Add meetingId to sprints/teams endpoint (([#119](https://github.com/chingu-x/chingu-dashboard-be/pull/119)))
- Add new endpoint to select tech stack items ([#125](https://github.com/chingu-x/chingu-dashboard-be/pull/125))
- Add check in form response table, seed data, POST endpoint for submitting check in form ([#126](https://github.com/chingu-x/chingu-dashboard-be/pull/126))
- Add multiple device support ([#128](https://github.com/chingu-x/chingu-dashboard-be/pull/128))
- Add voyage project submission form seed ([#131](https://github.com/chingu-x/chingu-dashboard-be/pull/131))
- Add voyage project submission controller, service, e2e tests, responses seed ([#133](https://github.com/chingu-x/chingu-dashboard-be/pull/133))
- Add new endpoints to select/reset team project ideation ([#136](https://github.com/chingu-x/chingu-dashboard-be/pull/136))
- Add CASL ability for Access control ([#141](https://github.com/chingu-x/chingu-dashboard-be/pull/141))
- Add sprint checkin form submission status for a user ([#149](https://github.com/chingu-x/chingu-dashboard-be/pull/149))
- new command to run both e2e and unit test ([#148](https://github.com/chingu-x/chingu-dashboard-be/pull/148))
- allow edit and delete for tech stack item([#152](https://github.com/chingu-x/chingu-dashboard-be/pull/152))
- Add voyage project submission status to `/me` endpoint ([#158](https://github.com/chingu-x/chingu-dashboard-be/pull/158))
- Add e2e tests for teams controller ([#162](https://github.com/chingu-x/chingu-dashboard-be/pull/162))
- Add swagger access info, add forms authorization and e2e tests ([#160](https://github.com/chingu-x/chingu-dashboard-be/pull/160))
- Add voyages unit test, also had to update all files (seed, tests, services) to meet strict null rule due to prismaMock requirements ([#163](https://github.com/chingu-x/chingu-dashboard-be/pull/163))
- Add e2e tests for users controller ([#165](https://github.com/chingu-x/chingu-dashboard-be/pull/165))
- Add GET endpoint for check-in form responses ([#166](https://github.com/chingu-x/chingu-dashboard-be/pull/166))
- Add weekly sprint checkin forms for product owner and scrum master ([#167](https://github.com/chingu-x/chingu-dashboard-be/pull/167))
- Add e2e test for features controller ([#168](https://github.com/chingu-x/chingu-dashboard-be/pull/168))
- Add endpoint to reseed the database ([#170](https://github.com/chingu-x/chingu-dashboard-be/pull/170))
- Add new @unverified decorator to 4 routes, updated permission guard ([#171](https://github.com/chingu-x/chingu-dashboard-be/pull/171))
- Add CASL permissions for Tech endpoint ([#174](https://github.com/chingu-x/chingu-dashboard-be/pull/174))
- Add CASL permissions for Team Resource endpoint ([#177](https://github.com/chingu-x/chingu-dashboard-be/pull/177))
- Add units tests for the users controller & services([#179](https://github.com/chingu-x/chingu-dashboard-be/pull/178))

### Changed

- Update docker compose and scripts in package.json to include a test database container and remove usage of .env.dev to avoid confusion ([#100](https://github.com/chingu-x/chingu-dashboard-be/pull/100))
- Restructure seed/index.ts to work with e2e tests, and add --runInBand to e2e scripts[#101](https://github.com/chingu-x/chingu-dashboard-be/pull/101)
- Update changelog ([#104](https://github.com/chingu-x/chingu-dashboard-be/pull/104))
- Update test.yml to run e2e tests on pull requests to the main branch [#105](https://github.com/chingu-x/chingu-dashboard-be/pull/105)
- Update email templates to use domain in environment variables [#110](https://github.com/chingu-x/chingu-dashboard-be/pull/110)
- Update /forms /forms/id response to include subQuestions [#115](https://github.com/chingu-x/chingu-dashboard-be/pull/115)
- Add role and permission guard to some existing routes (features, forms, ideations, teams) [#112](https://github.com/chingu-x/chingu-dashboard-be/pull/112)
- Refactor voyages endpoint paths to follow API naming conversion [#123](https://github.com/chingu-x/chingu-dashboard-be/pull/123)
- Refactor resources PATCH and DELETE URI [#127](https://github.com/chingu-x/chingu-dashboard-be/pull/127)
- Modified response for GET voyages/teams/{teamId}/resources, adding user id value [#129](https://github.com/chingu-x/chingu-dashboard-be/pull/129)
- Modified response for POST /api/v1/voyages/teams/{teamId}/techs/{teamTechId} & DELETE /api/v1/voyages/teams/{teamId}/techs/{teamTechId}, refactor id as teamTechStackItemVoteId value [#138](https://github.com/chingu-x/chingu-dashboard-be/pull/138)
- updated meeting model schema to include optional description field [#135](https://github.com/chingu-x/chingu-dashboard-be/pull/135)
- Remove teamMeetings from response for getSprintDatesByTeamId [#139](https://github.com/chingu-x/chingu-dashboard-be/pull/139)
- Updated response for route GET sprints/meetings/{meetingId} to include updatedAt for agendas [#140](https://github.com/chingu-x/chingu-dashboard-be/pull/140)
- Updated response for route GET /sprints/teams/{teamId}  to include voyage start and end dates [#147](https://github.com/chingu-x/chingu-dashboard-be/pull/147)
- Update test github actions workflow with timeout [#143](https://github.com/chingu-x/chingu-dashboard-be/pull/143)
- Refractor of all form title reference to use values from formTitle.ts [#145](https://github.com/chingu-x/chingu-dashboard-be/pull/145)
- Update/Add more form input types [#146](https://github.com/chingu-x/chingu-dashboard-be/pull/146)
- Update seed files (include a time for sprint end dates, add url input type) [#151](https://github.com/chingu-x/chingu-dashboard-be/pull/151)
- Update the deleteFeature method to use a DeleteFeatureResponse and return an object with a successful status and a message [#150](https://github.com/chingu-x/chingu-dashboard-be/pull/150)
- Update seed data to include voyage 49-51 [#152](https://github.com/chingu-x/chingu-dashboard-be/pull/152)
- Updated Sprints routes with 401 response when not logged in [#157](https://github.com/chingu-x/chingu-dashboard-be/pull/157)
- Updated DELETE ideation-vote service to also delete ideation when no votes remain [#161](https://github.com/chingu-x/chingu-dashboard-be/pull/161)
- Refactored the prisma models to be grouped by domain type [#172](https://github.com/chingu-x/chingu-dashboard-be/pull/172)
- Updated response for GET teams/:teamId/techs to include isSelected value for techs [#173](https://github.com/chingu-x/chingu-dashboard-be/pull/173)
- Refactor ideation endpoints to remove redundant teamId params  [#175](https://github.com/chingu-x/chingu-dashboard-be/pull/175)
- Squashed migration files into one [#176](https://github.com/chingu-x/chingu-dashboard-be/pull/176)
- Update prisma schema to include oauth [#181](https://github.com/chingu-x/chingu-dashboard-be/pull/181)


### Fixed

- Fix failed tests in app and ideation due to the change from jwt token response to http cookies ([#98](https://github.com/chingu-x/chingu-dashboard-be/pull/98))
- Fix a bug in PATCH /meetings/{meetingId}/forms/{formId} where it's not accepting an array of responese (updated validation pipe, service, and tests) ([#121](https://github.com/chingu-x/chingu-dashboard-be/pull/121))
- Fix unit tests where mocked req doesn't match new CustomRequest type ([#122](https://github.com/chingu-x/chingu-dashboard-be/pull/122))
- Fix bug with reading roles after reseeding causes the db to not recognize the tokens stored by the user's browser ([#134](https://github.com/chingu-x/chingu-dashboard-be/pull/134))
- Fix form responses giving error and not inserting values when the boolean value is false ([#156](https://github.com/chingu-x/chingu-dashboard-be/pull/156))
- Fix a bug for check on voyageTeamMemberId ([#159](https://github.com/chingu-x/chingu-dashboard-be/pull/159))

### Removed

- Removed email from reset-password request body ([#118](https://github.com/chingu-x/chingu-dashboard-be/pull/118))
- Removed Roles and Permission guards and decorators([#141](https://github.com/chingu-x/chingu-dashboard-be/pull/141))
