// routes/games.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const API_URL = 'https://api.balldontlie.io/v1';
const API_KEY = process.env.BALLDONTLIE_API_KEY;

router.get('/games/:player_id/:start_date/:end_date', async (req, res) => {
  try {
    const { player_id, start_date, end_date } = req.params;
    const per_page = req.query.per_page || 25;
    const cursor = req.query.cursor;

    const playerResponse = await axios.get(`${API_URL}/players/${player_id}`, {
      headers: { Authorization: API_KEY }
    });
    
    let player;
    if (playerResponse.data.player && playerResponse.data.player.data) {
      player = playerResponse.data.player.data;
    } else if (playerResponse.data.data) {
      player = playerResponse.data.data;
    } else {
      return res.status(404).send({ error: "Player not found." });
    }

    const teamId = player.team && player.team.id;
    if (!teamId) {
      return res.status(404).send({ error: "Team not found for the given player." });
    }

    let gamesUrl = `${API_URL}/games?team_ids[]=${teamId}&start_date=${start_date}&end_date=${end_date}&per_page=${per_page}`;
    if (cursor) {
      gamesUrl += `&cursor=${cursor}`;
    }

    const gamesResponse = await axios.get(gamesUrl, {
      headers: { Authorization: API_KEY }
    });

    res.send(gamesResponse.data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/games', async (req, res) => {
  try {
    const { start_date, end_date, seasons, team_ids, cursor, per_page } = req.query;
    const perPage = per_page || 25;

    let url = `${API_URL}/games?`;

    if (start_date) url += `start_date=${start_date}&`;
    if (end_date) url += `end_date=${end_date}&`;

    if (seasons) {
      if (Array.isArray(seasons)) {
        seasons.forEach(season => url += `seasons[]=${season}&`);
      } else {
        url += `seasons[]=${seasons}&`;
      }
    }

    if (team_ids) {
      if (Array.isArray(team_ids)) {
        team_ids.forEach(id => url += `team_ids[]=${id}&`);
      } else {
        url += `team_ids[]=${team_ids}&`;
      }
    }

    if (cursor) {
      url += `cursor=${cursor}&`;
    }
    
    url += `per_page=${perPage}`;

    const response = await axios.get(url, {
      headers: { Authorization: API_KEY }
    });

    res.send(response.data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get game by ID and return player stats if completed
router.get('/games/:id', async (req, res) => {
  try {
    const gameId = req.params.id;

    // Fetch game details
    const gameResponse = await axios.get(`${API_URL}/games/${gameId}`, {
      headers: { Authorization: API_KEY }
    });

    // Fetch player stats for the game
    const statsResponse = await axios.get(`${API_URL}/stats?game_ids[]=${gameId}`, {
      headers: { Authorization: API_KEY }
    });

    const game = gameResponse.data.data;
    const playerStats = statsResponse.data.data.map(stat => ({
      player_id: stat.id,
      player_name: `${stat.player.first_name} ${stat.player.last_name}`,
      team: stat.team.full_name,
      minutes: stat.min || 0,
      points: stat.pts || 0,
      rebounds: stat.reb || 0,
      assists: stat.ast || 0,
      steals: stat.stl || 0,
      blocks: stat.blk || 0,
      field_goals_made: stat.fgm || 0,
      field_goals_attempt: stat.fga || 0,
      field_goal_percentage: stat.fg_pct || 0,
      field_goals3_made: stat.fg3m || 0,
      field_goals3_attempt: stat.fg3a || 0,
      field_goal3_percentage: stat.fg3_pct || 0,
      freethrows_made: stat.ftm || 0,
      freethrows_attempt: stat.fta || 0,
      freethrow_percentage: stat.ft_pct || 0
    }));

    res.json({
      game: {
        id: game.id,
        date: game.date,
        status: game.status,
        home_team: game.home_team.full_name,
        visitor_team: game.visitor_team.full_name,
        home_team_score: game.home_team_score,
        visitor_team_score: game.visitor_team_score
      },
      playerStats
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;