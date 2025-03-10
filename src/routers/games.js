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
        const gameResponse = await axios.get(`${API_URL}/games/${req.params.id}`, {
            headers: { Authorization: API_KEY }
        });
        
        let statsResponse = { data: [] };
        if (gameResponse.data.data.status === "Final") {
            statsResponse = await axios.get(`${API_URL}/stats?game_ids[]=${req.params.id}`, {
                headers: { Authorization: API_KEY }
            });
        }
        
        res.send({ game: gameResponse.data, playerStats: statsResponse.data });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;