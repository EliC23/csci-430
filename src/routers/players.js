const express = require('express');
const axios = require('axios');
const router = express.Router();
const API_URL = 'https://api.balldontlie.io/v1';
const API_KEY = process.env.BALLDONTLIE_API_KEY;

// Get all players (with optional search query by Name)
router.get('/players', async (req, res) => {
    try {
        const { search } = req.query;
        let url = `${API_URL}/players`;
        if (search) {
            url += `?search=${search}`;
        }

        const response = await axios.get(url, {
            headers: { Authorization: API_KEY }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/players/:id', async (req, res) => {
    try {
        const { season } = req.query;
        const selectedSeason = season || 2024;

        const playerResponse = await axios.get(`${API_URL}/players/${req.params.id}`, {
            headers: { Authorization: API_KEY }
        });

        const statsResponse = await axios.get(`${API_URL}/season_averages?player_id=${req.params.id}&season=${selectedSeason}`, {
            headers: { Authorization: API_KEY }
        });

        res.send({
            player: playerResponse.data,
            stats: statsResponse.data
        });
    } catch (error) {
        res.status(error.response?.status || 500).send({ error: error.response?.data || "Internal Server Error" });
    }
});

module.exports = router;