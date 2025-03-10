# API Protocol for NBA Stats Web App

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Users](#users)
4. [Teams](#teams)
5. [Games](#games)
6. [Players](#players)
7. [Bets](#bets)

## Overview

This document specifies the API endpoints required for user interactions within the Clutch Stats web app. Each endpoint includes details such as the HTTP method, path, authentication requirements, query parameters, request body properties, and expected responses.

## Authentication

All endpoints marked with **Bearer Token Required** must include an `Authorization` header with a valid token:

```
Authorization: Bearer <token>
```

## Users

| **Feature**        | **Method** | **Path**       | **Auth Required** | **Query Params** | **Body Properties**                                                 | **Response Codes**                                               |
| ------------------ | ---------- | -------------- | ----------------- | ---------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Register User**  | `POST`     | `/user`        | No                | None             | `username`, `email`, `password`                                     | `201 Created`: User registered, `400 Bad Request`: Invalid input |
| **Login User**     | `POST`     | `/user/login`  | No                | None             | `email`, `password`                                                 | `200 OK`: Token returned, `400 Bad Request`: Invalid credentials |
| **Logout User**    | `POST`     | `/user/logout` | Yes               | None             | None                                                                | `200 OK`: Logged out successfully, `500 Internal Server Error`   |
| **Get Profile**    | `GET`      | `/user/me`     | Yes               | None             | None                                                                | `200 OK`: User profile, `401 Unauthorized`                       |
| **Update Profile** | `PATCH`    | `/user/me`     | Yes               | None             | `username`, `email`, `password`, `favoriteTeams`, `favoritePlayers` | `200 OK`: Profile updated, `400 Bad Request`: Invalid input      |
| **Delete Account** | `DELETE`   | `/user/me`     | Yes               | None             | None                                                                | `200 OK`: Account deleted, `500 Internal Server Error`           |

## Teams

| **Feature**           | **Method** | **Path**           | **Auth Required** | **Query Params**                               | **Body Properties** | **Response Codes**                                      |
| --------------------- | ---------- | ------------------ | ----------------- | ---------------------------------------------- | ------------------- | ------------------------------------------------------- |
| **Get List of Teams** | `GET`      | `/teams`           | No                | `conference` (optional, string: "East"/"West") | None                | `200 OK`: List of teams                                 |
| **Get Team Details**  | `GET`      | `/teams/{team_id}` | No                | None                                           | None                | `200 OK`: Team details, `404 Not Found`: Team not found |

## Games

| **Feature**               | **Method** | **Path**                                        | **Auth Required** | **Query Params**                                                            | **Body Properties** | **Response Codes**                                            |
| ------------------------- | ---------- | ----------------------------------------------- | ----------------- | --------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------- |
| **Get Games**             | `GET`      | `/games`                                        | No                | `date` (optional, string, format: YYYY-MM-DD), `team_id` (optional, string) | None                | `200 OK`: Game schedule and results                           |
| **Get Game Details**      | `GET`      | `/games/{game_id}`                              | No                | None                                                                        | None                | `200 OK`: Game details, `404 Not Found`: Game not found       |
| **Get Player Game Stats** | `GET`      | `/games/{game_id}/players/{player_id}/boxscore` | No                | None                                                                        | None                | `200 OK`: Player game stats, `404 Not Found`: Stats not found |

## Players

| **Feature**             | **Method** | **Path**               | **Auth Required** | **Query Params**                                            | **Body Properties** | **Response Codes**                                          |
| ----------------------- | ---------- | ---------------------- | ----------------- | ----------------------------------------------------------- | ------------------- | ----------------------------------------------------------- |
| **Get List of Players** | `GET`      | `/players`             | No                | `team_id` (optional, string), `position` (optional, string) | None                | `200 OK`: List of players                                   |
| **Get Player Details**  | `GET`      | `/players/{player_id}` | No                | None                                                        | None                | `200 OK`: Player details, `404 Not Found`: Player not found |

## Bets

| **Feature**            | **Method** | **Path**     | **Auth Required** | **Query Params**                                   | **Body Properties**                                                                                   | **Response Codes**                                                                              |
| ---------------------- | ---------- | ------------ | ----------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Place Bet**          | `POST`     | `/bets`      | Yes               | None                                               | `gameId`, `playerId`, `predictions` (object with `points`, `assists`, `rebounds`, `threes`, `steals`) | `201 Created`: Bet placed successfully, `400 Bad Request`: Invalid input                        |
| **Get User Bets**      | `GET`      | `/bets`      | Yes               | `status` (optional, string: "pending"/"completed") | None                                                                                                  | `200 OK`: List of user bets, `401 Unauthorized`                                                 |
| **Get Bet by ID**      | `GET`      | `/bets/{id}` | Yes               | None                                               | None                                                                                                  | `200 OK`: Bet details, `404 Not Found`: Bet not found                                           |
| **Update Bet Results** | `PATCH`    | `/bets/{id}` | Yes               | None                                               | None                                                                                                  | `200 OK`: Bet updated, `400 Bad Request`: Bet already finalized, `404 Not Found`: Bet not found |
| **Delete Bet**         | `DELETE`   | `/bets/{id}` | Yes               | None                                               | None                                                                                                  | `200 OK`: Bet deleted, `404 Not Found`: Bet not found                                           |

---