require('./db/mongoose')
const express = require('express')
const cors = require('cors')
const userRouter = require('./routers/user.js')
const betRouter = require('./routers/bet.js')
const playersRouter = require('./routers/players.js') 
const teamsRouter = require('./routers/teams.js')
const gamesRouter = require('./routers/games.js')
 
const app = express()
 
app.use(express.json())
app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(userRouter)
app.use(betRouter)
app.use(playersRouter)
app.use(teamsRouter)
app.use(gamesRouter)
 
const port = process.env.PORT
app.listen(port, () => {
    console.log('Listening on port ' + port)
})
