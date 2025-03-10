const express = require('express');
const Bet = require('../models/bet');
const auth = require('../middleware/auth');  
const axios = require('axios');

const router = new express.Router();

// Place a Bet
router.post('/bets', auth, async (req, res) => {
    try {
        const { gameId, playerId, predictions } = req.body;

        if (!predictions || Object.keys(predictions).length !== 5) {
            return res.status(400).send({ error: "You must provide predictions for all 5 categories." });
        }

        const bet = new Bet({
            userId: req.user._id,
            gameId,
            playerId,
            predictions,
            status: 'pending'
        });

        await bet.save();
        res.status(201).send(bet);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get User's Bets
router.get('/bets', auth, async (req, res) => {
    try {
        const bets = await Bet.find({ userId: req.user._id });
        res.send(bets);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get a Single Bet by ID
router.get('/bets/:id', auth, async (req, res) => {
    try {
        const bet = await Bet.findOne({ _id: req.params.id, userId: req.user._id });

        if (!bet) {
            return res.status(404).send({ error: "Bet not found." });
        }

        res.send(bet);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Update Bet Results After Game
router.patch('/bets/:id', auth, async (req, res) => {
    try {
        const bet = await Bet.findOne({ _id: req.params.id, userId: req.user._id });

        if (!bet) {
            return res.status(404).send({ error: "Bet not found." });
        }

        if (bet.status === "completed") {
            return res.status(400).send({ error: "Bet results already finalized." });
        }

        // Fetch player stats
        const response = await axios.get(`https://api.balldontlie.io/v1/stats?game_ids[]=${bet.gameId}&player_ids[]=${bet.playerId}`, {
            headers: { Authorization: process.env.BALLDONTLIE_API_KEY }
        });
        console.log("API Response:", JSON.stringify(response.data, null, 2));

        if (!response.data.data.length) {
            return res.status(400).send({ error: "Player stats not available yet." });
        }

        const playerStats = response.data.data[0];

        console.log("Extracted Player Stats:", playerStats);

        // Calculate absolute score difference
        const actualStats = {
            points: playerStats.pts || 0,
            assists: playerStats.ast || 0,
            rebounds: playerStats.reb || 0,
            threes: playerStats.fg3m || 0,
            steals: playerStats.stl || 0
        };

        const score = Math.abs(bet.predictions.points - actualStats.points) +
                      Math.abs(bet.predictions.assists - actualStats.assists) +
                      Math.abs(bet.predictions.rebounds - actualStats.rebounds) +
                      Math.abs(bet.predictions.threes - actualStats.threes) +
                      Math.abs(bet.predictions.steals - actualStats.steals);

        // Update bet
        bet.actualStats = actualStats;
        bet.score = score;
        bet.status = 'completed';

        await bet.save();
        res.send(bet);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Delete Bet
router.delete('/bets/:id', auth, async (req, res) => {
    try {
        const bet = await Bet.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!bet) {
            return res.status(404).send({ error: "Bet not found." });
        }

        res.send({ message: "Bet deleted successfully." });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;