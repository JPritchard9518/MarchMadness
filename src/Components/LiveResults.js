import React from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Play from '@material-ui/icons/PlayArrow';
import Forward from '@material-ui/icons/FastForward'
import Pause from '@material-ui/icons/Pause';
import axios from 'axios';
import moment from 'moment';
// import { simulation } from '../data/projectSettings';
const simulation = true;

class LiveResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game: props.selectedGame,
            predictions: props.predictions || [],
            homeScore: (simulation) ? 30 : 0,
            awayScore: (simulation) ? 39 : 0,
            gameFinished: false
        }
    }
    componentWillMount() {
        if (!simulation) {
            this.retrieveScore()
            let fourMin = 1000 * 60 * 5;
            this.scoreRetrievalInterval = setInterval(this.retrieveScore.bind(this), fourMin);
        }
    }
    componentWillUnmount() {
        clearInterval(this.scoreRetrievalInterval)
    }
    async retrieveScore() {
        let { gameId } = this.state.game;
        console.log(`retrieving score:  ${moment().toDate()} - ${gameId}`)
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = `http://api.sportradar.us/ncaamb/trial/v4/en/games/${gameId}/boxscore.json?api_key=yss8gr8c6txmhgqa7djftarr`;
        const config = {
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
        let { data } = await axios.get(proxyurl + url, config)
        let homeScore = data.home.points;
        let awayScore = data.away.points;
        if (data.status === "closed") {
            console.log("Game Has Finished")
            this.setState({ gameFinished: true, homeScore, awayScore })
            return clearInterval(this.scoreRetrievalInterval);
        }

        return this.setState({ homeScore, awayScore })
    }
    scoreSimulator() {
        let { homeScore, awayScore } = this.state;
        if (homeScore + awayScore >= 160) {
            this.setState({ gameFinished: true })
            return clearInterval(this.scoreGenerator)
        }
        let pointsScored = (Math.floor(Math.random() * 3) + 1) * 1;
        let randOneTwo = Math.floor(Math.random() * 2) + 1
        if (randOneTwo === 1)
            return this.setState({ homeScore: homeScore + pointsScored })
        else
            return this.setState({ awayScore: awayScore + pointsScored })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ predictions: nextProps.predictions })
    }
    generateLeftRow({ name, points, winner }, index, stillIn) {
        let winningTeam = (this.state.homeScore > this.state.awayScore) ? "Home" : "Away";
        let color = (stillIn && winner === winningTeam && index === 0) ? 'RGBA(40, 247, 45, .1)' : 'RGBA(252, 42, 28, .1)';
        if (name === '-') color = '#FFF'
        return (
            <div key={`${name}-${points}-${index}`} style={{ backgroundColor: color }}>
                <ListItem button>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="h6">{name}</Typography>
                        <Typography variant="h6">{points}</Typography>
                    </div>
                </ListItem>
                <Divider />
            </div >
        )
    }
    generateRightRow({ name, points, winner }, index, stillIn) {
        let winningTeam = (this.state.homeScore > this.state.awayScore) ? "Home" : "Away";
        let color = (stillIn && winner === winningTeam && index === 0) ? 'RGBA(40, 247, 45, .1)' : 'RGBA(252, 42, 28, .1)';
        if (name === '-') color = '#FFF'
        return (
            <div key={`${name}-${points}-${index}`} style={{ backgroundColor: color }}>
                <ListItem button>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="h6">{points}</Typography>
                        <Typography variant="h6">{name}</Typography>
                    </div>
                </ListItem>
                <Divider />
            </div >
        )
    }
    generateFinalResults({ awayIn, homeIn, awayOut, homeOut }) {
        let { homeScore, awayScore } = this.state;
        let winningTeam = (homeScore > awayScore) ? 'Home' : 'Away';
        let finalResults = [];
        if (winningTeam === 'Home') {
            finalResults = [...homeIn, ...homeOut, ...awayIn, ...awayOut]
        } else {
            finalResults = [...awayIn, ...awayOut, ...homeIn, ...homeOut]
        }
        return finalResults.filter(res => res.name !== '-')
    }
    generateFinalRow({ name, points, winner }, index) {
        let { homeScore, awayScore } = this.state;
        let winningTeam = (homeScore > awayScore) ? 'Home' : 'Away';
        let color = (index === 0 && winner === winningTeam) ? 'RGBA(40, 247, 45, .1)' : 'RGBA(252, 42, 28, .1)';
        return (
            <div key={`${name}-${points}-${index}`} style={{ backgroundColor: color }}>
                <ListItem button>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="h6">{points}</Typography>
                        <Typography variant="h6">{name}</Typography>
                    </div>
                </ListItem>
                <Divider />
            </div >
        )
    }
    renderFinalResults({ awayIn, homeIn, awayOut, homeOut, gameFinished }) {
        if (!gameFinished) return null;

        let resultsArr = this.generateFinalResults({ awayIn, homeIn, awayOut, homeOut })
        return (
            <div>
                <Typography variant="h3">Final Standings</Typography>
                <List style={{ width: '100%', borderRight: '.5px solid', borderRightColor: 'rgba(0,0,0,0.12)' }}>
                    {resultsArr.map((pred, index) => this.generateFinalRow(pred, index))}
                </List>
            </div>

        )
    }
    getScoreColor(defendant, oppononent) {
        return defendant >= oppononent ? 'green' : 'red'
    }
    sortListAscending(a, b) {
        if (a.points > b.points)
            return 1;
        if (a.points < b.points)
            return -1;
        return 0;
    }
    sortListDescending(a, b) {
        if (a.points < b.points)
            return 1;
        if (a.points > b.points)
            return -1;
        return 0;
    }
    filterPredictions() {
        let { predictions, homeScore, awayScore } = this.state;
        let combinedScore = homeScore + awayScore
        let away = predictions.filter(pred => pred.winner === "Away").sort(this.sortListAscending);
        let home = predictions.filter(pred => pred.winner === "Home").sort(this.sortListAscending);

        let awayIn = [];
        let awayOut = [];

        let awayClosestScore = 0;
        away.forEach(pred => {
            let { points } = pred;
            if (Math.abs(points - combinedScore) < Math.abs(awayClosestScore - combinedScore))
                awayClosestScore = points
        })
        away.forEach(pred => {
            let { points } = pred;
            if (points >= combinedScore || points === awayClosestScore)
                awayIn.push(pred)
            else
                awayOut.push(pred)
        })

        let homeIn = [];
        let homeOut = [];

        let homeClosestScore = 0;
        home.forEach(pred => {
            let { points } = pred;
            if (Math.abs(points - combinedScore) < Math.abs(homeClosestScore - combinedScore))
                homeClosestScore = points
        })
        home.forEach(pred => {
            let { points } = pred;
            if (points >= combinedScore || points === homeClosestScore)
                homeIn.push(pred)
            else
                homeOut.push(pred)
        })


        let emptyPred = { name: '-', points: '-' }
        if (awayIn.length !== homeIn.length) {
            if (awayIn.length < homeIn.length) {
                let numToPush = homeIn.length - awayIn.length;
                for (let i = 0; i < numToPush; i++)
                    awayIn.push({ ...emptyPred })
            } else {
                let numToPush = awayIn.length - homeIn.length;
                for (let i = 0; i < numToPush; i++)
                    homeIn.push({ ...emptyPred })
            }
        }

        if (awayOut.length !== homeOut.length) {
            if (awayOut.length < homeOut.length) {
                let numToPush = homeOut.length - awayOut.length;
                for (let i = 0; i < numToPush; i++)
                    awayOut.push({ ...emptyPred })
            } else {
                let numToPush = awayOut.length - homeOut.length;
                for (let i = 0; i < numToPush; i++)
                    homeOut.push({ ...emptyPred })
            }
        }

        awayOut.sort(this.sortListDescending)
        homeOut.sort(this.sortListDescending)

        return { awayIn, homeIn, awayOut, homeOut }

    }
    render() {
        let { game, homeScore, awayScore, gameFinished } = this.state;
        let { awayIn, homeIn, awayOut, homeOut } = this.filterPredictions()

        return (
            <div style={{ width: `${75}%`, paddingBottom: '30px', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: `${25}px` }}>
                    <Typography variant="h4" id="modal-title">
                        Live Results
                    </Typography>
                </div>
                {simulation && !gameFinished &&
                    <div style={{ display: 'flex', width: '300px', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column' }}>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Fab color="primary" aria-label="Add" onClick={() => this.scoreGenerator = setInterval(() => this.scoreSimulator(), 1000)}>
                                <Play />
                            </Fab>
                            <Fab color="primary" aria-label="Add" onClick={() => this.scoreSimulator()}>
                                <Forward />
                            </Fab>

                            <Fab color="secondary" aria-label="Edit" onClick={() => clearInterval(this.scoreGenerator)}>
                                <Pause />
                            </Fab>
                        </div>
                        <div style={{ padding: '15px' }}>
                            <Typography variant="h6" id="modal-title" style={{ padding: '0 10px 0 10px' }}>
                                Simulation Controls
                            </Typography>
                        </div>
                    </div>
                }
                {this.renderFinalResults({ awayIn, homeIn, awayOut, homeOut, gameFinished })}
                <div style={{ borderBottom: '.5px solid', borderBottomColor: 'rgba(0,0,0,0.12)', marginBottom: '15px', width: '100%', alignItems: 'center', justifyContent: 'space-around', display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '33%' }}>
                        <Typography variant="h2" id="modal-title" style={{ color: this.getScoreColor(homeScore, awayScore) }}>
                            {homeScore}
                        </Typography>
                        <Typography variant="h6">
                            {`Home: ${game.home.name}`}
                        </Typography>
                    </div>
                    <div style={{ width: '33%', display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="h1" id="modal-title">
                            {homeScore + awayScore}
                        </Typography>
                    </div>

                    <div style={{ width: '33%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography variant="h2" id="modal-title" style={{ color: this.getScoreColor(awayScore, homeScore) }}>
                            {awayScore}
                        </Typography>
                        <Typography variant="h6">
                            {`Away: ${game.away.name}`}
                        </Typography>
                    </div>
                </div>
                <div style={{ width: '100%', alignItems: 'center', justifyContent: 'space-around', display: 'flex', flexDirection: 'row' }}>
                    <List style={{ width: '100%', borderRight: '.5px solid', borderRightColor: 'rgba(0,0,0,0.12)' }}>
                        {homeIn.map((pred, index) => this.generateLeftRow(pred, index, true))}
                    </List>
                    <List style={{ width: '100%', borderLeft: '.5px solid', borderLeftColor: 'rgba(0,0,0,0.12)' }}>
                        {awayIn.map((pred, index) => this.generateRightRow(pred, index, true))}
                    </List>
                </div>
                {(homeOut.length > 0 || awayOut.length > 0) &&
                    <div style={{ padding: '30px 0 20px 0' }}>
                        <Typography variant="h4">
                            Out
                    </Typography>
                    </div>
                }

                <div style={{ width: '100%', alignItems: 'center', justifyContent: 'space-around', display: 'flex', flexDirection: 'row' }}>
                    <List style={{ width: '100%', borderRight: '.5px solid', borderRightColor: 'rgba(0,0,0,0.12)' }}>
                        {homeOut.map((pred, index) => this.generateLeftRow(pred, index, false))}
                    </List>
                    <List style={{ width: '100%', borderLeft: '.5px solid', borderLeftColor: 'rgba(0,0,0,0.12)' }}>
                        {awayOut.map((pred, index) => this.generateRightRow(pred, index, false))}
                    </List>
                </div>

            </div >

        )
    }
}

export default LiveResults;