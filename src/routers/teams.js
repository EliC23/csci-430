// routes/teams.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const API_URL = 'https://api.balldontlie.io/v1';
const API_KEY = process.env.BALLDONTLIE_API_KEY;

// Get all teams (with optional search and conference filter)
router.get('/teams', async (req, res) => {
    try {
        const { "team-search": teamSearch, conference } = req.query;
        let url = `${API_URL}/teams`;

        const response = await axios.get(url, {
            headers: { Authorization: API_KEY }
        });

        let teams = response.data.data; // Extract teams array

        // Apply search filtering
        if (teamSearch) {
            const searchRegex = new RegExp(teamSearch, 'i');
            teams = teams.filter(team => 
                searchRegex.test(team.name) || 
                searchRegex.test(team.full_name) || 
                searchRegex.test(team.city)
            );
        }

        // Filter by conference if provided
        if (conference) {
            teams = teams.filter(team => team.conference.toLowerCase() === conference.toLowerCase());
        }

        res.send({ data: teams });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get team by ID and include standings for a given season
router.get('/teams/:id', async (req, res) => {
    try {
        const { season } = req.query; // Allow optional season parameter
        const selectedSeason = season || 2024; // Default to current season

        const teamResponse = await axios.get(`${API_URL}/teams/${req.params.id}`, {
            headers: { Authorization: API_KEY }
        });

        const standingsResponse = await axios.get(`${API_URL}/standings?season=${selectedSeason}`, {
            headers: { Authorization: API_KEY }
        });

        // Find the specific team's standings
        const teamStandings = standingsResponse.data.data.find(entry => entry.team.id === parseInt(req.params.id));

        res.send({
            team: teamResponse.data.data,
            standings: teamStandings ? {
                conference_record: teamStandings.conference_record,
                conference_rank: teamStandings.conference_rank,
                division_record: teamStandings.division_record,
                division_rank: teamStandings.division_rank,
                wins: teamStandings.wins,
                losses: teamStandings.losses,
                home_record: teamStandings.home_record,
                road_record: teamStandings.road_record,
                season: teamStandings.season
            } : { message: "No standings data available for this team in the selected season." }
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
module.exports = router;