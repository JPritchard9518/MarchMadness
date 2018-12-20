import React from 'react';
import Typography from '@material-ui/core/Typography';
import '../styles/header.scss';

class Header extends React.Component {
    state = {
        selected: this.props.selectedTab || 'Games'
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedTab !== this.state.selected) {
            this.setState({ selected: nextProps.selectedTab })
        }
    }
    onClick = (item) => {
        this.setState({ selected: item })
        this.props.setSelectedTab(item)
    }
    renderNavItem(item) {
        let selected = (item === this.state.selected) ? true : false;

        return (
            <div key={item} className={`navItem${(selected) ? ' selected' : ''}`} onClick={() => this.onClick(item)}>
                {item}
            </div>
        )
    }
    render() {
        return (
            <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                {/* <Typography variant="h6" style={{ color: '#FFF' }}>March Madness</Typography> */}
                {["Today's Games"/*, "Place Bets"*/, "View Live Scores"].map(item => this.renderNavItem(item))}
            </div>
        );
    }
};

export default Header;