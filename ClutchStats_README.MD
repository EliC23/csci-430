# API Protocol for NBA Stats Web App

## Overview
This document specifies the API endpoints required for user interactions within the Clutch Stats web app. Each endpoint includes details such as the HTTP method, path, authentication requirements, query parameters, request body properties, and expected responses.

Models: https://docs.google.com/document/d/1dUYiQQQ7SnPoofjc9ARDeyouiO4h2bF8T9ExlDJNoSo/edit?usp=sharing

Figma Wireframe: https://www.figma.com/design/TFyJNM4tbIhBjUC3DHU0uX/Clutch-Stats?node-id=0-1&t=dzePVD5XJrvcTH5i-1

## Authentication
All endpoints marked with **Bearer Token Required** must include an `Authorization` header with a valid token:
```
Authorization: Bearer <token>
```

## Endpoints

| Endpoint | Method | Path | Auth Required | Query Params | Body Properties | Response Codes |
|----------|--------|------|---------------|--------------|----------------|----------------|
| **Login** | POST | `/auth/login` | No | None | `email` (required, string), `password` (required, string) | `200 OK`: Token returned, `401 Unauthorized`: Invalid credentials |
| **Register** | POST | `/auth/register` | No | None | `username` (required, string), `email` (required, string), `password` (required, string) | `201 Created`: Account created, `400 Bad Request`: Invalid input |
| **Get Profile** | GET | `/user/profile` | Yes | None | None | `200 OK`: User profile data, `401 Unauthorized`: Invalid token |
| **Edit Profile** | PUT | `/user/profile` | Yes | None | `username` (optional, string, max length: 50), `email` (optional, string, must be valid email) | `200 OK`: Profile updated, `400 Bad Request`: Invalid input |
| **Get List of Teams** | GET | `/teams` | No | `conference` (optional, string: "East"/"West") | None | `200 OK`: List of teams |
| **Get Team Details** | GET | `/teams/{team_id}` | No | None | None | `200 OK`: Team details, `404 Not Found`: Team not found |
| **Get List of Players** | GET | `/players` | No | `team_id` (optional, string), `position` (optional, string) | None | `200 OK`: List of players |
| **Get Player Details** | GET | `/players/{player_id}` | No | None | None | `200 OK`: Player details, `404 Not Found`: Player not found |
| **Get Games** | GET | `/games` | No | `date` (optional, string, format: YYYY-MM-DD), `team_id` (optional, string) | None | `200 OK`: Game schedule and results |
| **Get Game Details** | GET | `/games/{game_id}` | No | None | None | `200 OK`: Game details, `404 Not Found`: Game not found |
| **Get Player Game Stats** | GET | `/games/{game_id}/players/{player_id}/boxscore` | No | None | None | `200 OK`: Player game stats, `404 Not Found`: Stats not found |
| **Get User Favorites** | GET | `/user/favorites` | Yes | None | None | `200 OK`: List of favorites, `401 Unauthorized`: Invalid token |
| **Add to Favorites** | POST | `/user/favorites` | Yes | None | `type` (required, string: "team"/"player"/"game"), `id` (required, string) | `201 Created`: Added to favorites, `400 Bad Request`: Invalid input |
| **Remove from Favorites** | DELETE | `/user/favorites/{favorite_id}` | Yes | None | None | `200 OK`: Removed from favorites, `404 Not Found`: Favorite not found |

---
