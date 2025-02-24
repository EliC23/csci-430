const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

// Register a new user
router.post('/user', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Login user
router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: 'Invalid email or password' });
    }
});

// Logout user
router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();
        res.send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Get current user profile
router.get('/user/me', auth, async (req, res) => {
    res.send(req.user);
});

// Update user account
router.patch('/user/me', auth, async (req, res) => {
    const allowedUpdates = ['username', 'email', 'password', 'favoriteTeams', 'favoritePlayers'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        const user = req.user;
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Delete user account
router.delete('/user/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne();
        res.send({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

module.exports = router;