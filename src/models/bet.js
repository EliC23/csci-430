const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gameId: {
        type: Number,
        required: true
    },
    playerId: {
        type: Number,
        required: true
    },
    predictions: {
        points: { type: Number, required: true },
        assists: { type: Number, required: true },
        rebounds: { type: Number, required: true },
        threes: { type: Number, required: true },
        steals: { type: Number, required: true }
    },
    actualStats: {
        points: { type: Number, default: null },
        assists: { type: Number, default: null },
        rebounds: { type: Number, default: null },
        threes: { type: Number, default: null },
        steals: { type: Number, default: null }
    },
    score: {
        type: Number,
        default: null  // The total difference (lower is better)
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    }
}, { timestamps: true });

const Bet = mongoose.model('Bet', betSchema);
module.exports = Bet;