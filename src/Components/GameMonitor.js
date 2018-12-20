import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
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
            selectedGames: [],
            games: [
                {
                    "_id": {
                        "$oid": "5c1b03372e9cba08623706e5"
                    },
                    "gameId": "26c01288-652c-4c06-881c-1e70b7392212",
                    "home": {
                        "name": "New Mexico State Aggies",
                        "id": "5016fe1a-9571-4d10-bf5b-b9c1b496bd57",
                        "score": 0
                    },
                    "away": {
                        "name": "Cal State Northridge Matadors",
                        "id": "cb732075-23a5-4e71-9037-50a7a002bdb2",
                        "score": 0
                    },
                    "scheduled": {
                        "$date": "2018-12-20T08:00:00.000Z"
                    },
                    "predictions": [
                        {
                            "name": "Aaron",
                            "winner": "Home",
                            "points": 120
                        },
                        {
                            "name": "Justin",
                            "winner": "Away",
                            "points": 132
                        },
                        {
                            "name": "Phil",
                            "winner": "Home",
                            "points": 142
                        },
                        {
                            "name": "Jesse",
                            "winner": "Away",
                            "points": 112
                        },
                        {
                            "name": "Danny",
                            "winner": "Home",
                            "points": 101
                        },
                        {
                            "name": "Jimmy",
                            "winner": "Home",
                            "points": 89
                        },
                        {
                            "name": "Thomas",
                            "winner": "Away",
                            "points": 70
                        },
                        {
                            "name": "Jack",
                            "winner": "Home",
                            "points": 70
                        }
                    ]
                }
                // {
                //     "_id": {
                //         "$oid": "5c19bff23d84e7087c0297b5"
                //     },
                //     "gameId": "0ab6ef46-f849-4297-8b53-05459350ac4c",
                //     "home": {
                //         "name": "Duke Blue Devils",
                //         "id": "faeb1160-5d15-4f26-99fc-c441cf21fc7f",
                //         "score": 0
                //     },
                //     "away": {
                //         "name": "Princeton Tigers",
                //         "id": "fe406882-9f22-495e-9df6-ef357a6803c6",
                //         "score": 0
                //     },
                //     "scheduled": {
                //         "$date": "2018-12-19T05:00:00.000Z"
                //     },
                //     "predictions": [
                //         {
                //             "name": "Justin",
                //             "winner": "Home",
                //             "points": 133
                //         },
                //         {
                //             "name": "Aaron",
                //             "winner": "Away",
                //             "points": 145
                //         }
                //     ]
                // },
                // {
                //     "_id": {
                //         "$oid": "5c19c0fbaf579f088df986bf"
                //     },
                //     "gameId": "bf8e70b9-f915-495b-8843-727b41c11cd4",
                //     "home": {
                //         "name": "Oregon Ducks",
                //         "id": "1da70895-f77f-44ef-b216-d63c02e696eb",
                //         "score": 0
                //     },
                //     "away": {
                //         "name": "Florida A",
                //         "id": "cec2527e-5e1e-4817-a628-35666ef13b6e",
                //         "score": 0
                //     },
                //     "scheduled": {
                //         "$date": "2018-12-19T05:00:00.000Z"
                //     },
                //     "predictions": [
                //         {
                //             "name": "Phil",
                //             "winner": "Away",
                //             "points": 134
                //         },
                //         {
                //             "name": "Jesse",
                //             "winner": "Away",
                //             "points": 153
                //         }
                //     ]
                // }
            ],
            nameInput: '',
            winningTeamSelect: '',
            pointInput: '',
            gameData: (simulation) ? simGameData : null,
            message: '',
            gameDataArr: []
        }
    }
    componentDidMount = async () => {
        return this.getGameEntries();
        // return;
        // TODO: Retrieve all games in list
        // if (simulation) return;
        let { id, home, away, scheduled } = this.state.game;
        let url = `/initializeGame?gameId=${id}&homeTeam=${home.name}&homeId=${home.id}&awayTeam=${away.name}&awayId=${away.id}&scheduled=${scheduled}`
        axios.post(url).then(response => {
            this.setState({ gameData: response.data.gameData })
        })
    };
    getGameEntries = async () => {
        return;
        let url = `/getGamesWatchingToday`
        axios.get(url).then(response => {
            this.setState({ games: response.data.games })
        })
    }
    selectGame = event => {
        this.setState({ selectedGames: [...this.state.selectedGames, event.target.value] })
    }
    handleChange = event => {
        let selectedGames = event.target.value;
        this.setState({ selectedGames })
    }
    render() {
        let { game, gameData, message, nameInput, winningTeamSelect, pointInput } = this.state;
        let gamesToRender = this.state.games.filter(game => this.state.selectedGames.indexOf(game.gameId) > -1)
        let selectedValues = this.state.selectedGames.map(game => {
            let gameData = this.state.games.find(g => g.gameId === game)
            return `${gameData.home.name} vs. ${gameData.away.name}`
        })
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Typography variant="h3" style={{ padding: `${20}px` }}>
                        {`${game.home.name} vs. ${game.away.name}`}
                    </Typography>
                    <Typography variant="h6" style={{ color: 'red' }}>
                        {message}
                    </Typography>
                </div> */}
                {/**Render Check List of games to watch */}

                <FormControl style={{ width: '50%' }}>
                    <InputLabel htmlFor="select-multiple-checkbox">Games</InputLabel>
                    <Select
                        multiple
                        value={this.state.selectedGames}
                        onChange={this.handleChange}
                        input={<Input id="select-multiple-checkbox" />}
                        renderValue={selected => /*selected.join(', ')*/selectedValues.join(', ')}
                    >
                        {this.state.games.map(game => (
                            <MenuItem key={game.gameId} value={game.gameId} >
                                <Checkbox checked={this.state.selectedGames.indexOf(game.gameId) > -1} />
                                <ListItemText primary={`${game.home.name} vs. ${game.away.name}`} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {
                    gamesToRender.map(game => <LiveResults key={game.gameId} selectedGame={game} predictions={game.predictions} />)
                }
            </div >

        )
    }
}

export default GameMonitor;
