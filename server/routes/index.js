const path = require('path');
const router = require('express').Router();
const moment = require('moment');

router.get('/checkCache', async (req, res) => {
    let { date } = req.query;
    let gamesByDate = await dbClient.db().collection('games').find({ date }).toArray()
    let updateCache = gamesByDate.length === 0;
    res.json({ updateCache, gameObj: gamesByDate[0] })
})
router.post('/saveGames', async (req, res) => {
    let { date, games } = req.body;
    let obj = {
        date,
        games
    }
    await dbClient.db().collection('games').insertOne(obj);
    return res.json({ success: true })
})
router.post('/initializeGame', async (req, res) => {
    let { gameId, homeTeam, homeId, awayTeam, awayId, scheduled } = req.query;
    let gameWatching = await dbClient.db().collection('watching').find({ gameId }).toArray();
    if (gameWatching.length === 0) {
        let initialObj = {
            gameId,
            home: {
                name: homeTeam,
                id: homeId,
                score: 0
            },
            away: {
                name: awayTeam,
                id: awayId,
                score: 0
            },
            scheduled: moment(scheduled.split(" ")[0]).toDate(),
            predictions: [],
        }
        await dbClient.db().collection('watching').insertOne(initialObj)
        gameWatching = initialObj;
    } else {
        gameWatching = gameWatching[0]
    }
    res.json({ gameData: gameWatching })
})
router.post('/insertPrediction', async (req, res) => {
    let { gameId, name, winner, points } = req.body;
    let newPrediction = { name, winner, points: Number(points) }
    let result = await dbClient.db().collection('watching').findOneAndUpdate(
        { gameId },
        { $push: { predictions: newPrediction } },
        { returnOriginal: false }
    )
    res.json({ gameData: result.value })
})

router.get('/games', (req, res) => {
    dbClient.collection('games')
    res.send('Games')
})

router.get('/getGamesWatchingToday', async (req, res) => {
    let start = moment()/*.subtract(1, 'days')*/.startOf('day').toDate();
    let end = moment().add(2, 'days').startOf('day').toDate();
    let games = await dbClient.db().collection('watching').find({ scheduled: { $gte: start, $lt: end } }).toArray();
    res.json({ games })
})
router.get('*', (req, res) => {
    const route = path.join(__dirname, '..', '..', 'dist', 'index.html');
    res.sendFile(route);
});

module.exports = router;