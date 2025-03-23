# API Protocol for NBA Stats Web App

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Notes](#notes)
4. [Users](#users)
5. [Teams](#teams)
6. [Games](#games)
7. [Players](#players)
8. [Bets](Not Available)
9. [Favorites](Not Available)

## Overview

This document specifies the API endpoints required for user interactions within the Clutch Stats web app. Each endpoint includes details such as the HTTP method, path, authentication requirements, string parameters, request body properties, and expected responses.

## Authentication

All endpoints marked with **Bearer Token Required** must include an `Authorization` header with a valid token:

```
Authorization: Bearer <token>
```

## Notes

- **String Params** are always optional unless otherwise specified.
- **Cursor Pagination**: Some endpoints support cursor-based pagination. Use `cursor` as a query param to fetch the next set of results. The server is stateless, so clients are responsible for storing and reusing the cursor.
- **per\_page** defaults to 25. You can override it with `?per_page=50` or any other valid value, max value is 100.
- **Name-Search** and **Team-Search** work as partial text matches against the player or team names.

## Users

| **Feature**        | **Method** | **Path**       | **Auth Required** | **String Params** | **Body Properties**                                                                                                        | **Response Codes**                    |
| ------------------ | ---------- | -------------- | ----------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| **Register User**  | `POST`     | `/user`        | No                | None              | `username` (required), `email` (required), `password` (required)                                                           | `201 Created`, `400 Bad Request`      |
| **Login User**     | `POST`     | `/user/login`  | No                | None              | `email` (required), `password` (required)                                                                                  | `200 OK`, `400 Bad Request`           |
| **Logout User**    | `POST`     | `/user/logout` | Yes               | None              | None                                                                                                                       | `200 OK`, `500 Internal Server Error` |
| **Get Profile**    | `GET`      | `/user/me`     | Yes               | None              | None                                                                                                                       | `200 OK`, `401 Unauthorized`          |
| **Update Profile** | `PATCH`    | `/user/me`     | Yes               | None              | `username` (optional), `email` (optional), `password` (optional), `favoriteTeams` (optional), `favoritePlayers` (optional) | `200 OK`, `400 Bad Request`           |
| **Delete Account** | `DELETE`   | `/user/me`     | Yes               | None              | None                                                                                                                       | `200 OK`, `500 Internal Server Error` |

## Teams

| **Feature**           | **Method** | **Path**          | **Auth Required** | **String Params**           | **Body Properties** | **Response Codes**        |
| --------------------- | ---------- | ----------------- | ----------------- | --------------------------- | ------------------- | ------------------------- |
| **Get List of Teams** | `GET`      | `/teams`          | No                | `team-search`, `conference` | None                | `200 OK`                  |
| **Get Team Details**  | `GET`      | `/teams/:team_id` | No                | `season`                    | None                | `200 OK`, `404 Not Found` |

## Games

| **Feature**                      | **Method** | **Path**                                  | **Auth Required** | **String Params**                                                         | **Body Properties** | **Response Codes**                    |
| -------------------------------- | ---------- | ----------------------------------------- | ----------------- | ------------------------------------------------------------------------- | ------------------- | ------------------------------------- |
| **Get Games**                    | `GET`      | `/games`                                  | No                | `start_date`, `end_date`, `seasons[]`, `team_ids[]`, `cursor`, `per_page` | None                | `200 OK`, `500 Internal Server Error` |
| **Get Game by ID**               | `GET`      | `/games/:id`                              | No                | None                                                                      | None                | `200 OK`, `404 Not Found`             |
| **Get Games by Player and Date** | `GET`      | `/games/:player_id/:start_date/:end_date` | No                | `cursor`, `per_page`                                                      | None                | `200 OK`, `404 Not Found`             |

## Players

| **Feature**                    | **Method** | **Path**       | **Auth Required** | **String Params**                   | **Body Properties** | **Response Codes**        |
| ------------------------------ | ---------- | -------------- | ----------------- | ----------------------------------- | ------------------- | ------------------------- |
| **Get List of Players**        | `GET`      | `/players`     | No                | `name-search`, `cursor`, `per_page` | None                | `200 OK`                  |
| **Get Player Details & Stats** | `GET`      | `/players/:id` | No                | `season`                            | None                | `200 OK`, `404 Not Found` |

## Bets (Not Available)

**Bets** allow users to predict the performance of a specific player in a specific game across 5 statistical categories. Once the game is completed, the actual stats are fetched and scored.

| **Feature**       | **Method** | **Path** | **Auth Required** | **String Params** | **Body Properties**                                                                                                              | **Response Codes**               |
| ----------------- | ---------- | -------- | ----------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **Place Bet**     | `POST`     | `/bets`  | Yes               | None              | `gameId` (required), `playerId` (required), `predictions` (required object: `points`, `assists`, `rebounds`, `threes`, `steals`) | `201 Created`, `400 Bad Request` |
| **Get User Bets** | `GET`      | `/bets`  | Yes               | `limit`, `offset` | None                                                                                                                             | `200 OK`, `401 Unauthorized`     |

## Favorites (Not Available)

| **Feature**                | **Method** | **Path**                | **Auth Required** | **String Params** | **Body Properties**    | **Response Codes**               |
| -------------------------- | ---------- | ----------------------- | ----------------- | ----------------- | ---------------------- | -------------------------------- |
| **Favorite Player**        | `POST`     | `/favorite-players`     | Yes               | None              | `player_id` (required) | `201 Created`, `400 Bad Request` |
| **Get Favorite Players**   | `GET`      | `/favorite-players`     | Yes               | None              | None                   | `200 OK`, `401 Unauthorized`     |
| **Update Favorite Player** | `PATCH`    | `/favorite-players/:id` | Yes               | None              | `player_id` (required) | `200 OK`, `400 Bad Request`      |
| **Remove Favorite Player** | `DELETE`   | `/favorite-players/:id` | Yes               | None              | None                   | `200 OK`, `404 Not Found`        |
| **Favorite Team**          | `POST`     | `/favorite-teams`       | Yes               | None              | `team_id` (required)   | `201 Created`, `400 Bad Request` |
| **Get Favorite Teams**     | `GET`      | `/favorite-teams`       | Yes               | None              | None                   | `200 OK`, `401 Unauthorized`     |
| **Update Favorite Team**   | `PATCH`    | `/favorite-teams/:id`   | Yes               | None              | `team_id` (required)   | `200 OK`, `400 Bad Request`      |
| **Remove Favorite Team**   | `DELETE`   | `/favorite-teams/:id`   | Yes               | None              | None                   | `200 OK`, `404 Not Found`        |

