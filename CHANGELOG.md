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
- Add e2e tests for sprint controller ([#113](https://github.com/chingu-x/chingu-dashboard-be/pull/113))
- Add new endpoint to revoke refresh token ([#116](https://github.com/chingu-x/chingu-dashboard-be/pull/116))
- Add meetingId to sprints/teams endpoint (([#119](https://github.com/chingu-x/chingu-dashboard-be/pull/119)))
- Add check in form response table, seed data, POST endpoint for submitting check in form

### Changed

- Update docker compose and scripts in package.json to include a test database container and remove usage of .env.dev to avoid confusion ([#100](https://github.com/chingu-x/chingu-dashboard-be/pull/100))
- Restructure seed/index.ts to work with e2e tests, and add  --runInBand to e2e scripts[#101](https://github.com/chingu-x/chingu-dashboard-be/pull/101)
- Update changelog (([#104](https://github.com/chingu-x/chingu-dashboard-be/pull/104))
- Update test.yml to run e2e tests on pull requests to the main branch [#105](https://github.com/chingu-x/chingu-dashboard-be/pull/105)
- Update email templates to use domain in environment variables [#110](https://github.com/chingu-x/chingu-dashboard-be/pull/110)
- Add role and permission guard to some existing routes (features, forms, ideations, teams) [#112](https://github.com/chingu-x/chingu-dashboard-be/pull/112)

### Fixed

- Fix failed tests in app and ideation due to the change from jwt token response to http cookies ([#98](https://github.com/chingu-x/chingu-dashboard-be/pull/98))
- Fix a bug in PATCH /meetings/{meetingId}/forms/{formId} where it's not accepting an array of responese (updated validation pipe, service, and tests) ([#121](https://github.com/chingu-x/chingu-dashboard-be/pull/121))

### Removed

- Removed email from reset-password request body ([#118](https://github.com/chingu-x/chingu-dashboard-be/pull/118))
