const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();

// Add favorite player
router.post('/favorite-players', auth, async (req, res) => {
    const { player_id } = req.body;
    if (!player_id) return res.status(400).send({ error: "player_id is required" });

    try {
        if (!req.user.favoritePlayers.includes(player_id)) {
            req.user.favoritePlayers.push(player_id);
            await req.user.save();
        }
        res.status(201).send({ message: 'Player added to favorites' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get favorite players
router.get('/favorite-players', auth, async (req, res) => {
    res.status(200).send({ favoritePlayers: req.user.favoritePlayers });
});

// Delete favorite player
router.delete('/favorite-players/:id', auth, async (req, res) => {
    try {
        req.user.favoritePlayers = req.user.favoritePlayers.filter(
            id => id.toString() !== req.params.id
        );
        await req.user.save();
        res.send({ message: 'Player removed from favorites' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Add favorite team
router.post('/favorite-teams', auth, async (req, res) => {
    const { team_id } = req.body;
    if (!team_id) return res.status(400).send({ error: "team_id is required" });

    try {
        if (!req.user.favoriteTeams.includes(team_id)) {
            req.user.favoriteTeams.push(team_id);
            await req.user.save();
        }
        res.status(201).send({ message: 'Team added to favorites' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get favorite teams
router.get('/favorite-teams', auth, async (req, res) => {
    res.status(200).send({ favoriteTeams: req.user.favoriteTeams });
});

// Delete favorite team
router.delete('/favorite-teams/:id', auth, async (req, res) => {
    try {
        req.user.favoriteTeams = req.user.favoriteTeams.filter(
            id => id.toString() !== req.params.id
        );
        await req.user.save();
        res.send({ message: 'Team removed from favorites' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
