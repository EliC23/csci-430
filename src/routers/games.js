// routes/games.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const API_URL = 'https://api.balldontlie.io/v1';
const API_KEY = process.env.BALLDONTLIE_API_KEY;

// Get games by date
router.get('/games', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).send({ error: 'Date query parameter is required (YYYY-MM-DD).' });
        }
        
        const response = await axios.get(`${API_URL}/games?dates[]=${date}`, {
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

        // Fetch Game Details
        const gameResponse = await axios.get(`${API_URL}/games/${gameId}`, {
            headers: { Authorization: API_KEY }
        });

        // Fetch Player Stats for the Game
        const statsResponse = await axios.get(`${API_URL}/stats?game_ids[]=${gameId}`, {
            headers: { Authorization: API_KEY }
        });

        const game = gameResponse.data.data;
        const playerStats = statsResponse.data.data.map(stat => ({
            player_id: stat.id,
            player_name: `${stat.player.first_name} ${stat.player.last_name}`,
            team: stat.team.full_name,
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