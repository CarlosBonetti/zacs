# zacs

Zeplin Automated Crawler Service

## Configuration

You must provide a `.env` file containing or pass to the environment the following variables:

- `ZEPLIN_USERNAME`: Zeplin username used by the crawler
- `ZEPLIN_PASSWORD`: Zeplin password user by the crawler

## Endpoints

### `GET /[PROJECT_ID]/[SCREEN_ID].png`

Returns a `HTTP REDIRECT` to the URL of the official zeplin CDN containing the latest version of the screen.

**The credentials specified must provide access to the project.**

### `GET /api/[PROJECT_ID]`

Returns a JSON object containing all the project data information.

**The credentials specified must provide access to the project.**
