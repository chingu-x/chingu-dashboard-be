# Changelog

> [!IMPORTANT]
> All notable changes to this project will be documented in this file.

> [!NOTE]
> The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), <br/>
> and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). <br/>
> Another example [here](https://co-pilot.dev/changelog) <br/>

> [!TIP]
> MAJOR version when you make incompatible API changes <br/>
> MINOR version when you add functionality in a backward compatible manner <br/>
> PATCH version when you make backward compatible bug fixes <br/>

## [1.2.0-alpha](https://github.com/chingu-x/chingu-dashboard-be/compare/1.1.0-alpha...v1.2.0-alpha) (2025-02-13)


### Features

* (solo project) Add solo project status, email and discordId query params to GET endpoint ([06e8d63](https://github.com/chingu-x/chingu-dashboard-be/commit/06e8d63d6128f5224b9f7897918d3fdfbe34b721))
* Stage 1 - add parseConfig field to Question and OptionChoice models ([#238](https://github.com/chingu-x/chingu-dashboard-be/issues/238)) ([5890679](https://github.com/chingu-x/chingu-dashboard-be/commit/58906790430ec9ac61f30e387aab8b6da200b70c))
* **tests:** extend Jest with additional matchers for better testing ([ea49075](https://github.com/chingu-x/chingu-dashboard-be/commit/ea49075481a5f8a48115005908d74407be028ab8))
* Added release please github actions ([#235])(https://github.com/chingu-x/chingu-dashboard-be/pull/235)
* Added version release link to Swagger docs ([#218](https://github.com/chingu-x/chingu-dashboard-be/pull/231))
* Added status, email, discordId query to solo project get endpoint ([#237](https://github.com/chingu-x/chingu-dashboard-be/pull/237))

### Improvements / Refactoring
* Updated readme for installation part ([#225])(https://github.com/chingu-x/chingu-dashboard-be/pull/225)
* Updated nestjs packages to latest version ([#233])(https://github.com/chingu-x/chingu-dashboard-be/pull/233)
* Refactoring of email service + unit tests ([#232](https://github.com/chingu-x/chingu-dashboard-be/pull/232))
* Refactored solo project get endpoint input validation ([#237](https://github.com/chingu-x/chingu-dashboard-be/pull/237))

### Bug Fixes

* **eslint.config.mjs:** correct import and plugin names, adjust tsconfig.json path ([feadabd](https://github.com/chingu-x/chingu-dashboard-be/commit/feadabd38759c3fd09f20ae2732401bdad812f3f))
* **package.json:** downgrade several packages to ensure compatibility ([cf9e090](https://github.com/chingu-x/chingu-dashboard-be/commit/cf9e0900874274aad6a3f7a60e3e1ccef41e81e2))
* **tests:** correct usage of jest-extended matchers in various test files ([2361bb0](https://github.com/chingu-x/chingu-dashboard-be/commit/2361bb07973f0cd6bb4da3ec3e040ef3917560b5))
* **tests:** corrected 'toBeArray' and 'toBeObject' to be called as functions instead as a property access. ([249c8dc](https://github.com/chingu-x/chingu-dashboard-be/commit/249c8dc51ddd9e4aeb51b98178b551fd58e3835a))
* fixed POST voyages/teams/{teamId}/techs bug , verify that categoryId is owned by correct team ([#229](https://github.com/chingu-x/chingu-dashboard-be/pull/229))

## [v1.1.0-alpha]

### Added

- Added same site property to the clear cookies function ([#218](https://github.com/chingu-x/chingu-dashboard-be/pull/218))
- Added routes for teams to create own tech stack categories([#208](https://github.com/chingu-x/chingu-dashboard-be/pull/208))
- Added unit tests for Features controller and services ([#220](https://github.com/chingu-x/chingu-dashboard-be/pull/220))
- Add github oauth and e2e test ([#194](https://github.com/chingu-x/chingu-dashboard-be/pull/222))
- Added GET endpoint for solo project ([#223](https://github.com/chingu-x/chingu-dashboard-be/pull/223))
- Added units test for sprints ([#224](https://github.com/chingu-x/chingu-dashboard-be/pull/224))

### Changed

- Updated cors origin list ([#218](https://github.com/chingu-x/chingu-dashboard-be/pull/218))
- refactored unit tests for the ideations controller and services([#219](https://github.com/chingu-x/chingu-dashboard-be/pull/219))
- revised tech selections route to update only one tech per request([#221](https://github.com/chingu-x/chingu-dashboard-be/pull/221))
- Updated readme for installation part ([#225])(https://github.com/chingu-x/chingu-dashboard-be/pull/225)

### Fixed

### Removed

## [v1.0.2-alpha]

### Added

- Add units tests for the forms controller and services([#204](https://github.com/chingu-x/chingu-dashboard-be/pull/204))
- Add same site property to cookie ([#212](https://github.com/chingu-x/chingu-dashboard-be/pull/212))
- Add same site property to cookie in refresh endpoint ([#214](https://github.com/chingu-x/chingu-dashboard-be/pull/214))
- Add new comment model ([#213](https://github.com/chingu-x/chingu-dashboard-be/pull/213))

### Changed

- Update PostgreSQL image to timescale/timescaledb-ha:pg16 to match railway postgres image ([#210](https://github.com/chingu-x/chingu-dashboard-be/pull/210))
- refactored e2e tests to use absolute import paths ([#207](https://github.com/chingu-x/chingu-dashboard-be/pull/207))
- Updated seed data of user voyage roles and added new users([#206](https://github.com/chingu-x/chingu-dashboard-be/pull/206))
- Refactored e2e tests to use absolute import paths ([#207](https://github.com/chingu-x/chingu-dashboard-be/pull/207))
- Update solo project model ([#213](https://github.com/chingu-x/chingu-dashboard-be/pull/213))
- Update readme to include more instructions for using the test database ([#213](https://github.com/chingu-x/chingu-dashboard-be/pull/213))
- refactored unit tests to use absolute import paths ([#215](https://github.com/chingu-x/chingu-dashboard-be/pull/215))

### Fixed

- Fix cors localhost address ([#205](https://github.com/chingu-x/chingu-dashboard-be/pull/205))
- Fix voyages/sprints/teams/{teamId} returning wrong meetingIds ([#209](https://github.com/chingu-x/chingu-dashboard-be/pull/209))
- Fix one of the regex in cors origin list ([#211](https://github.com/chingu-x/chingu-dashboard-be/pull/211))

### Removed

## [v1.0.1-alpha]

### Added

- Add units tests for the teams controller & services([#189](https://github.com/chingu-x/chingu-dashboard-be/pull/189))
- Add discord oauth and e2e test ([#194](https://github.com/chingu-x/chingu-dashboard-be/pull/194))
- Add morgan middleware for request logging with custom logger ([#200](https://github.com/chingu-x/chingu-dashboard-be/pull/200))
- Add CASL permissions for Team Sprint endpoint ([#193](https://github.com/chingu-x/chingu-dashboard-be/pull/193))
- Add units tests for the teams resource controller & services([#201](https://github.com/chingu-x/chingu-dashboard-be/pull/201))
- Add github workflow for PR reminders ([#202](https://github.com/chingu-x/chingu-dashboard-be/pull/202))

### Changed

- updated changelog ([#195](https://github.com/chingu-x/chingu-dashboard-be/pull/195))
- Update accepted localhost port and docker compose file for a custom network setup ([#199](https://github.com/chingu-x/chingu-dashboard-be/pull/199))

### Fixed

- Fix seed data for alpha test (check in form question changes, gravatar) ([#190](https://github.com/chingu-x/chingu-dashboard-be/pull/190))
- Fix voyageNumber generation from sprintId for check-in submissions ([#186](https://github.com/chingu-x/chingu-dashboard-be/pull/186))
- revised 2 checkin questions for alpha test ([#192](https://github.com/chingu-x/chingu-dashboard-be/pull/192))
- Fix seed checkin form data for PO and SM , and voyage-role for team 6 ([#196](https://github.com/chingu-x/chingu-dashboard-be/pull/196))
- Bug add check for team id in place memberId ([#197](https://github.com/chingu-x/chingu-dashboard-be/pull/197))
- Update check-in form question ids validation (`checkQuestionsInFormById`) to accept an array of form titles ([#198](https://github.com/chingu-x/chingu-dashboard-be/pull/198))

### Removed

## [v1.0.0-alpha]

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
- Add CASL permissions for Team features endpoint ([#184](https://github.com/chingu-x/chingu-dashboard-be/pull/184))
- Add production seed for alpha test ([#185](https://github.com/chingu-x/chingu-dashboard-be/pull/185))
- Add types and validation to env variables ([#187](https://github.com/chingu-x/chingu-dashboard-be/pull/187))

### Changed

- Update docker compose and scripts in package.json to include a test database container and remove usage of .env.dev to avoid confusion ([#100](https://github.com/chingu-x/chingu-dashboard-be/pull/100))
- Restructure seed/-index.ts to work with e2e tests, and add --runInBand to e2e scripts[#101](https://github.com/chingu-x/chingu-dashboard-be/pull/101)
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
- Updated response for route GET /sprints/teams/{teamId} to include voyage start and end dates [#147](https://github.com/chingu-x/chingu-dashboard-be/pull/147)
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
- Refactor ideation endpoints to remove redundant teamId params [#175](https://github.com/chingu-x/chingu-dashboard-be/pull/175)
- Squashed migration files into one [#176](https://github.com/chingu-x/chingu-dashboard-be/pull/176)
- Update prisma schema to include oauth [#181](https://github.com/chingu-x/chingu-dashboard-be/pull/181)

### Fixed

- Fix failed tests in app and ideation due to the change from jwt token response to http cookies ([#98](https://github.com/chingu-x/chingu-dashboard-be/pull/98))
- Fix a bug in PATCH /meetings/{meetingId}/forms/{formId} where it's not accepting an array of responese (updated validation pipe, service, and tests) ([#121](https://github.com/chingu-x/chingu-dashboard-be/pull/121))
- Fix unit tests where mocked req doesn't match new CustomRequest type ([#122](https://github.com/chingu-x/chingu-dashboard-be/pull/122))
- Fix bug with reading roles after reseeding causes the db to not recognize the tokens stored by the user's browser ([#134](https://github.com/chingu-x/chingu-dashboard-be/pull/134))
- Fix form responses giving error and not inserting values when the boolean value is false ([#156](https://github.com/chingu-x/chingu-dashboard-be/pull/156))
- Fix a bug for check on voyageTeamMemberId ([#159](https://github.com/chingu-x/chingu-dashboard-be/pull/159))
- Fix users unit test failing due to a schema change ([#182](https://github.com/chingu-x/chingu-dashboard-be/pull/182))

### Removed

- Removed email from reset-password request body ([#118](https://github.com/chingu-x/chingu-dashboard-be/pull/118))
- Removed Roles and Permission guards and decorators([#141](https://github.com/chingu-x/chingu-dashboard-be/pull/141))
