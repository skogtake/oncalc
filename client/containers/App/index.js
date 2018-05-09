import React, { Component } from 'react';
import CSSModules from 'react-css-modules';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { red100, red500, red600, cyan500 } from 'material-ui/styles/colors';


import Calculate from '../../components/Calculate';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import styles from './styles.css';

const theme = getMuiTheme({
    palette: {
        textColor: cyan500,
        primary1Color: red600,
        primary2Color: red500,
        primary3Color: red100,
    },
});

class App extends Component {
    constructor(props) {
        super(props);
        this.page = React.createRef();
    }

    state = {
        key: '',
    };

    componentDidMount() {
        setTimeout(() => this.page.focus(), 0);
    }

    keyHandler = event => {
        event.preventDefault();
        this.setState({ key: event.key });
    };

    render() {
        return (
            <MuiThemeProvider muiTheme={ theme }>
                <div
                    styleName="app"
                    ref={ this.page }
                    tabIndex="0"
                    onKeyDown={ this.keyHandler }
                >
                    <Header />
                    <Calculate keyPressed={ this.state.key } />
                    <Footer />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default CSSModules(App, styles, { allowMultiple: true });

