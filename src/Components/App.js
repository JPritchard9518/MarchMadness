import React from 'react';

import Header from './Header';
import Games from './Games';
import GameMonitor from './GameMonitor';
import PlaceBets from './PlaceBets';
import { simulation } from '../data/projectSettings';

let simGame = {
    "id": "ed97a9ee-1ad3-483a-92fc-d14233b7cd03",
    "status": "scheduled",
    "coverage": "extended_boxscore",
    "scheduled": "2018-12-07T03:00:00+00:00",
    "conference_game": false,
    "venue": {
        "id": "1ed647ac-63f1-4dab-bca8-c192d96b33c6",
        "name": "KeyArena",
        "capacity": 15354,
        "address": "305 Harrison Street",
        "city": "Seattle",
        "state": "WA",
        "zip": "98109",
        "country": "USA"
    },
    "home": {
        "name": "Seattle Redhawks",
        "alias": "SEA",
        "id": "7e100f63-0b32-49f6-a954-f5b7c8cf48ad"
    },
    "away": {
        "name": "Nebraska-Omaha Mavericks",
        "alias": "NEOM",
        "id": "68d2aa5b-714f-4652-96f3-b71e1752413f"
    }
}

class App extends React.Component {
    state = {
        selectedTab: "View Live Scores",
        selectedGame: /*(simulation) ? simGame :*/ null
    }
    renderSelectedTab() {
        switch (this.state.selectedTab) {
            case "Today's Games":
                return <Games selectGame={this.selectGame.bind(this)} />
            case "Place Bets":
                return <PlaceBets selectedGame={this.state.selectedGame} />
            case "View Live Scores":
                return <GameMonitor />
            default:
                return <Games />
        }
    }
    selectGame(game) {
        this.setState({ selectedGame: game })
        this.setSelectedTab("Place Bets")
    }
    setSelectedTab(selectedTab) {
        this.setState({ selectedTab })
    }
    renderMainContent() {
        let { selectedTab } = this.state;
        if (selectedTab === "Games")
            return <Games selectGame={this.selectGame.bind(this)} />
        else
            return <GameMonitor selectedGame={selectedGame} />
    }

    render() {
        return (
            <div className="app" style={{ margin: 0, padding: 0 }}>
                <Header selectedTab={this.state.selectedTab} setSelectedTab={this.setSelectedTab.bind(this)} />
                {this.renderSelectedTab()}
            </div>
        );
    }
};

export default App;