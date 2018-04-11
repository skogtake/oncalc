import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import AppBar from 'material-ui/AppBar';

import styles from './styles.css';

class Header extends Component {
    render() {
        return (
            <header>
                <AppBar
                    styleName="app-bar"
                    title={
                        <span>
                            <span styleName="title">ONCALC -</span>
                            <span styleName="description"> online calculator</span>
                        </span>
                    }
                    iconElementLeft={ <div /> }
                />
            </header>
        );
    }
}

export default CSSModules(Header, styles, { allowMultiple: true });
