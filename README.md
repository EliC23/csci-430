# API Protocol for NBA Stats Web App

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Users](#users)
4. [Teams](#teams)
5. [Games](#games)
6. [Players](#players)
7. [Bets](#bets)
8. [Favorites](#favorites) *(WIP)*

## Overview
This document specifies the API endpoints required for user interactions within the Clutch Stats web app. Each endpoint includes details such as the HTTP method, path, authentication requirements, query parameters, request body properties, and expected responses.

## Authentication
All endpoints marked with **Bearer Token Required** must include an `Authorization` header with a valid token:
```
Authorization: Bearer <token>
```

## Users

| **Feature** | **Method** | **Path** | **Auth Required** | **String Params** | **Body Properties** | **Response Codes** |
|------------|--------|------------------|---------------|--------------|----------------|----------------|
| **Register User** | `POST` | `/user` | No | None | `username`, `email`, `password` | `201 Created`: User registered, `400 Bad Request`: Invalid input |
| **Login User** | `POST` | `/user/login` | No | None | `email`, `password` | `200 OK`: Token returned, `400 Bad Request`: Invalid credentials |
| **Logout User** | `POST` | `/user/logout` | Yes | None | None | `200 OK`: Logged out successfully, `500 Internal Server Error` |
| **Get Profile** | `GET` | `/user/me` | Yes | None | None | `200 OK`: User profile, `401 Unauthorized` |
| **Update Profile** | `PATCH` | `/user/me` | Yes | None | `username`, `email`, `password`, `favoriteTeams`, `favoritePlayers` | `200 OK`: Profile updated, `400 Bad Request`: Invalid input |
| **Delete Account** | `DELETE` | `/user/me` | Yes | None | None | `200 OK`: Account deleted, `500 Internal Server Error` |

## Teams

| **Feature** | **Method** | **Path** | **Auth Required** | **String Params** | **Body Properties** | **Response Codes** |
|------------|--------|------------------|---------------|--------------|----------------|----------------|
| **Get List of Teams** | `GET` | `/teams` | No | `Name-Search` (optional, string), `conference` (optional, string) | None | `200 OK`: List of teams |
| **Get Team Details** | `GET` | `/teams/:team_id` | No | None | None | `200 OK`: Team details, `404 Not Found`: Team not found |

## Games

| **Feature** | **Method** | **Path** | **Auth Required** | **String Params** | **Body Properties** | **Response Codes** |
|------------|--------|------------------|---------------|--------------|----------------|----------------|
| **Get Games by Date** | `GET` | `/games` | No | `date` (optional, string, format: YYYY-MM-DD), `start_date` (optional, string, format: YYYY-MM-DD), `end_date` (optional, string, format: YYYY-MM-DD), `team_ids` (optional, string) | None | `200 OK`: List of games, `400 Bad Request`: Missing date |
| **Get Game Details** | `GET` | `/games/:game_id` | No | None | None | `200 OK`: Game details and player stats (if available), `404 Not Found`: Game not found |
| **Get Games by Player and Date** | `GET` | `/games/:player_id/:start_date/:end_date` | No | `count`, `skip` (optional, int) | None | `200 OK`: Games for the player in the date range, `404 Not Found`: Player or games not found |

## Players

| **Feature** | **Method** | **Path** | **Auth Required** | **String Params** | **Body Properties** | **Response Codes** |
|------------|--------|------------------|---------------|--------------|----------------|----------------|
| **Get List of Players** | `GET` | `/players` | No | `Name-Search` (optional, string), `count`, `skip` (optional, int) | None | `200 OK`: List of players |
| **Get Player Details & Stats** | `GET` | `/players/:player_id` | No | `season` (optional, string, default: 2024) | None | `200 OK`: Player details and season stats, `404 Not Found`: Player not found |

## Bets

**Bets** allow users to predict the performance of an individual player in a specific game. Users must select a player from a future game and make predictions on their points, assists, rebounds, three-pointers made, and steals. The goal is to minimize the difference between predicted and actual stats. 

| **Feature** | **Method** | **Path** | **Auth Required** | **String Params** | **Body Properties** | **Response Codes** |
|------------|--------|------------------|---------------|--------------|----------------|----------------|
| **Place Bet** | `POST` | `/bets` | Yes | None | `gameId`, `playerId`, `predictions` (object with `points`, `assists`, `rebounds`, `threes`, `steals`) | `201 Created`: Bet placed successfully, `400 Bad Request`: Invalid input |
| **Get User Bets** | `GET` | `/bets` | Yes | `count`, `skip` (optional, int) | None | `200 OK`: List of user bets, `401 Unauthorized` |
| **Get Bet by ID** | `GET` | `/bets/:id` | Yes | None | None | `200 OK`: Bet details, `404 Not Found`: Bet not found |

## Favorites *(WIP)*

| **Feature** | **Method** | **Path** | **Auth Required** | **String Params** | **Body Properties** | **Response Codes** |
|------------|--------|------------------|---------------|--------------|----------------|----------------|
| **Favorite Player** | `POST` | `/favorite-players` | Yes | None | `player_id` (required, string) | `201 Created`: Player added to favorites, `400 Bad Request`: Invalid input |
| **Get Favorite Players** | `GET` | `/favorite-players` | Yes | None | None | `200 OK`: List of favorite players, `401 Unauthorized` |
| **Update Favorite Player** | `PATCH` | `/favorite-players/:id` | Yes | None | `player_id` (required, string) | `200 OK`: Favorite updated, `400 Bad Request`: Invalid input |
| **Remove Favorite Player** | `DELETE` | `/favorite-players/:id` | Yes | None | None | `200 OK`: Favorite removed, `404 Not Found`: Favorite not found |
| **Favorite Team** | `POST` | `/favorite-teams` | Yes | None | `team_id` (required, string) | `201 Created`: Team added to favorites, `400 Bad Request`: Invalid input |
| **Get Favorite Teams** | `GET` | `/favorite-teams` | Yes | None | None | `200 OK`: List of favorite teams, `401 Unauthorized` |
| **Update Favorite Team** | `PATCH` | `/favorite-teams/:id` | Yes | None | `team_id` (required, string) | `200 OK`: Favorite updated, `400 Bad Request`: Invalid input |
| **Remove Favorite Team** | `DELETE` | `/favorite-teams/:id` | Yes | None | None | `200 OK`: Favorite removed, `404 Not Found`: Favorite not found |

