const express = require('express');
const Bet = require('../models/bet');
const auth = require('../middleware/auth');  
const axios = require('axios');
const API_URL = 'https://api.balldontlie.io/v1';
const API_KEY = process.env.BALLDONTLIE_API_KEY;

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

        req.user.betIds.push(bet._id);
        await req.user.save();
        
        res.status(201).send(bet);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get User's Bets (Update Completed Bets)
router.get('/bets', auth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = parseInt(req.query.offset, 10) || 0;

        const bets = await Bet.find({ userId: req.user._id })
        .limit(limit)
        .skip(offset);

        if (!bets.length) {
            return res.send([]);
        }

        const updatedBets = await Promise.all(
            bets.map(async (bet) => {
                try {
                    const gameResponse = await axios.get(`${API_URL}/games/${bet.gameId}`, {
                        headers: { Authorization: API_KEY }
                    });

                    const gameData = gameResponse.data.data;
                    
                    if (!gameData || !gameData.status || gameData.status === "Scheduled") {
                        return bet;
                    }

                    const statsResponse = await axios.get(`${API_URL}/stats?game_ids[]=${bet.gameId}&player_ids[]=${bet.playerId}`, {
                        headers: { Authorization: API_KEY }
                    });

                    if (!statsResponse.data.data.length) {
                        return bet;
                    }

                    const playerStats = statsResponse.data.data[0];

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

                    bet.actualStats = actualStats;
                    bet.score = score;
                    bet.status = 'completed';

                    await bet.save();
                    return bet;
                } catch (error) {
                    console.error(`Error updating bet ${bet._id}: ${error.message}`);
                    return bet;
                }
            })
        );

        res.send(updatedBets);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;