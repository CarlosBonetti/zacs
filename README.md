# :warning: DEPRECATION NOTICE :warning:

This project is deprecated after the launch of the official Zeplin API, on February 2020. 

See the official API docs: https://docs.zeplin.dev/

***

# zacs - Zeplin Automated Crawler Service

A node crawler and API server for retrieving zeplin project information, since zeplin does not provide an official API for integration.

See below the [available server endpoints](#endpoints).

## Configuration

You must provide a `.env` file containing or pass to the environment the following variables:

- `ZEPLIN_USERNAME`: Zeplin username used by the crawler
- `ZEPLIN_PASSWORD`: Zeplin password user by the crawler

## Endpoints

### `GET /api/[PROJECT_ID]`

Returns a JSON object containing all the project data information.

**The credentials specified must provide access to the project.**

### `GET /[PROJECT_ID]/[SCREEN_ID].png`

Returns a `HTTP REDIRECT` to the URL of the official zeplin CDN containing the latest version of the screen.

**The credentials specified must provide access to the project.**

## Running

Run as a standalone node server (`yarn start` / `npm start`) or with docker (see `Dockerfile`/`docker-compose.yml`).

## Caching

The server caches the information retrieved by the crawler to speed up subsequent requests. _The cache is cleared every hour_. So the server API response can have a delay to update with new zeplin data.
