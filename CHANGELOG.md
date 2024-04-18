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

### Changed

- Update docker compose and scripts in package.json to include a test database container and remove usage of .env.dev to avoid confusion ([#100](https://github.com/chingu-x/chingu-dashboard-be/pull/100))
- Restructure seed/index.ts to work with e2e tests, and add --runInBand to e2e scripts[#101](https://github.com/chingu-x/chingu-dashboard-be/pull/101)
- Update changelog ([#104](https://github.com/chingu-x/chingu-dashboard-be/pull/104))
- Update test.yml to run e2e tests on pull requests to the main branch [#105](https://github.com/chingu-x/chingu-dashboard-be/pull/105)
- Update email templates to use domain in environment variables [#110](https://github.com/chingu-x/chingu-dashboard-be/pull/110)
-Update /forms /forms/id response to include subQuestions [#115](https://github.com/chingu-x/chingu-dashboard-be/pull/115)
- Add role and permission guard to some existing routes (features, forms, ideations, teams) [#112](https://github.com/chingu-x/chingu-dashboard-be/pull/112)
- Refactor voyages endpoint paths to follow API naming conversion [#123](https://github.com/chingu-x/chingu-dashboard-be/pull/123)
- Refactor resources PATCH and DELETE URI [#127](https://github.com/chingu-x/chingu-dashboard-be/pull/127)
- Modified response for GET voyages/teams/{teamId}/resources, adding user id value [#129](https://github.com/chingu-x/chingu-dashboard-be/pull/129)

### Fixed

- Fix failed tests in app and ideation due to the change from jwt token response to http cookies ([#98](https://github.com/chingu-x/chingu-dashboard-be/pull/98))
- Fix a bug in PATCH /meetings/{meetingId}/forms/{formId} where it's not accepting an array of responese (updated validation pipe, service, and tests) ([#121](https://github.com/chingu-x/chingu-dashboard-be/pull/121))
- Fix unit tests where mocked req doesn't match new CustomRequest type ([#122](https://github.com/chingu-x/chingu-dashboard-be/pull/122))
- Fix bug with reading roles after reseeding causes the db to not recognize the tokens stored by the user's browser ([#134](https://github.com/chingu-x/chingu-dashboard-be/pull/134))

### Removed

- Removed email from reset-password request body ([#118](https://github.com/chingu-x/chingu-dashboard-be/pull/118))
