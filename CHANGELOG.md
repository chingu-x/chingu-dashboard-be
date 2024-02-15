# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2024-01-24

### Added

- Add Role/Permission guard ([#97](https://github.com/chingu-x/chingu-dashboard-be/pull/97))
- Add CHANGELOG.md ([#84](https://github.com/chingu-x/chingu-dashboard-be/pull/84))
- Add github action for STG ([#81](https://github.com/chingu-x/chingu-dashboard-be/pull/81))
- Add status to voyage table and return in /me endpoint ([#79](https://github.com/chingu-x/chingu-dashboard-be/pull/79))
- Add refresh token functionality and global guard to protect all routes ([#78](https://github.com/chingu-x/chingu-dashboard-be/pull/78))
- Add @ApiResponse tags to ideations and features ([#65](https://github.com/chingu-x/chingu-dashboard-be/pull/77))
- Add @ApiResponse tags to resources ([#76](https://github.com/chingu-x/chingu-dashboard-be/pull/76))

### Changed
- Update docker compose and scripts in package.json to include a test database container and remove usage of .env.dev to avoid confusion ([#100](https://github.com/chingu-x/chingu-dashboard-be/pull/100))
- Restructure seed/index.ts to work with e2e tests, and add  --runInBand to e2e scripts[#101](https://github.com/chingu-x/chingu-dashboard-be/pull/101)

### Fixed
- Fix failed tests in app and ideation due to the change from jwt token response to http cookies

### Removed