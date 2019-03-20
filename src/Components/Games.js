import React from 'react';
import '../styles/games.scss';

import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { games } from '../data/games';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { simulation } from '../data/projectSettings';

let API_KEYS_MASTER = ["yss8gr8c6txmhgqa7djftarr", "n2bx7ge233k8x8utgsvtwy9w", "62jzddc8qy2y6k6pqz6ce8qp"];

let API_KEYS = [...API_KEYS_MASTER];

let API_KEY = API_KEYS.pop();
class Games extends React.Component {
    state = {
        loaded: (simulation) ? true : false,
        games: (simulation) ? games : null,
        selectedGame: null,
    }
    componentDidMount = () => {
        this.getGames()
    };
    async getGames() {
        // if (!simulation) {
        let now = moment();
        let year = now.year();
        let month = now.month() + 1;
        let day = now.date();
        let dateStr = now.format('YYYY/MM/DD');
        let url = `/checkCache?date=${dateStr}`;
        let cacheResult = await axios.get(url);
        if (cacheResult.data.updateCache) {
            setTimeout(async () => {
                const proxyurl = "https://cors-anywhere.herokuapp.com/";
                const url = `http://api.sportradar.us/ncaamb/trial/v4/en/games/${year}/${month}/${day}/schedule.json?api_key=${API_KEY}`;
                const config = {
                    headers: { 'Access-Control-Allow-Origin': '*' }
                };
                let result;
                try {
                    result = await axios.get(proxyurl + url, config)
                } catch (err) {
                    console.log(err)
                    if (API_KEYS.length === 0)
                        API_KEYS = [...API_KEYS_MASTER]
                    API_KEY = API_KEYS.pop()
                    return this.getGames()
                }

                let { games } = result.data;
                let today = moment().startOf('day');
                let tomorrow = moment().add(1, 'day').startOf('day')
                games = games.filter(game => moment(game.schedule).isBetween(today, tomorrow))
                await axios.post('/saveGames', { games, date: dateStr })
                return this.setState({ games, loaded: true })
            }, 2000);
        } else {
            return this.setState({ games: cacheResult.data.gameObj.games, loaded: true })
        }
        // }
    }
    gameClick(game) {
        this.props.selectGame(game)
    }
    renderGame(game) {
        return (
            <Grid key={game.id} item xs={6}>
                <Card onClick={() => this.gameClick(game)} className={"gamePaper"}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            {moment(game.scheduled).format('LLLL')}
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {`Home: ${game.home.name}`}
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {`Away: ${game.away.name}`}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        )
    }
    render() {
        if (this.state.loaded)
            return (
                <Grid container>
                    <Grid item xs={12}>
                        <Grid
                            container
                            spacing={40}
                            style={{ padding: 50 + 'px' }}
                            alignItems={"center"}
                            direction={"row"}
                            justify={"center"}
                        >
                            {this.state.games.map(game => (
                                this.renderGame(game)
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            );
        else
            return (
                <div style={{ marginTop: '100px' }}>
                    <LinearProgress />
                    <br />
                    <LinearProgress color="secondary" />
                </div>
            )
    }
};

export default Games;