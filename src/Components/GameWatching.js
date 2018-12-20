import React from 'react';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

import { simulation } from '../data/projectSettings';

import LiveResults from './LiveResults';

const simGameData = {
    "_id": "5c0c2c4a363a9a30ad201cef",
    "gameId": "ed97a9ee-1ad3-483a-92fc-d14233b7cd03",
    "home": {
        "name": "Seattle Redhawks",
        "id": "7e100f63-0b32-49f6-a954-f5b7c8cf48ad",
        "score": 0
    },
    "away": {
        "name": "Nebraska-Omaha Mavericks",
        "id": "68d2aa5b-714f-4652-96f3-b71e1752413f",
        "score": 0
    },
    "scheduled": "2018-12-07T03:00:00 00:00",
    "predictions": [{
        "name": "Justin Pritchard",
        "winner": "Away",
        "points": 163
    },
    {
        "name": "Aaron Hodges",
        "winner": "Home",
        "points": 143
    },
    {
        "name": "Phil Brown",
        "winner": "Away",
        "points": 185
    },
    {
        "name": "Jon Schneck",
        "winner": "Home",
        "points": 153
    }]
}

class GameMonitor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game: props.selectedGame,
            nameInput: '',
            winningTeamSelect: '',
            pointInput: '',
            gameData: (simulation) ? simGameData : null,
            message: ''
        }
    }
    componentDidMount = async () => {
        // if (simulation) return;
        let { id, home, away, scheduled } = this.state.game;
        let url = `/initializeGame?gameId=${id}&homeTeam=${home.name}&homeId=${home.id}&awayTeam=${away.name}&awayId=${away.id}&scheduled=${scheduled}`
        axios.post(url).then(response => {
            this.setState({ gameData: response.data.gameData })
        })
    };
    submitEntry() {
        // if (simulation) return;

        let { nameInput: name, pointInput: points, winningTeamSelect: winner, game } = this.state;
        if (name === '' || points === '' || winner === '') {
            let message = '';
            if (name === '') message += 'Name Cannot Be Empty';
            else if (winner === '') message += 'Must Select A Winning Team';
            else if (points === '') message += 'Must Provide Points';
            this.setState({ message })
        } else {
            axios.post('/insertPrediction', { gameId: game.id, name, winner, points }).then(response => {
                let { gameData } = response.data;
                this.setState({ gameData, nameInput: '', pointInput: '', winningTeamSelect: '', message: '' })
            })
        }
    }
    render() {
        let { game, gameData, message, nameInput, winningTeamSelect, pointInput } = this.state;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Typography variant="h3" style={{ padding: `${20}px` }}>
                        {`${game.home.name} vs. ${game.away.name}`}
                    </Typography>
                    <Typography variant="h6" style={{ color: 'red' }}>
                        {message}
                    </Typography>
                </div>

                {gameData !== null &&
                    <LiveResults selectedGame={game} predictions={gameData.predictions} />
                }
            </div >

        )
    }
}

export default GameMonitor;
