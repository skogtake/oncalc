import React, { Component } from 'react';
import CSSModules from 'react-css-modules';

import styles from './styles.css';

class Footer extends Component {
    render() {
        return (
            <footer>
                <div styleName="social">
                    <div>
                        <span>Tell about </span>

                        <span styleName="title">oncalc</span>
                    </div>

                    { /* <a styleName="fa-stack fa-lg">
                        <i styleName="fa fa-circle fa-stack-2x" />
                        <i styleName="fa fa-facebook fa-stack-1x inverse" />
                    </a>

                    <a styleName="fa-stack fa-lg">
                        <i styleName="fa fa-circle fa-stack-2x" />
                        <i styleName="fa fa-twitter fa-stack-1x inverse" />
                    </a>

                    <a styleName="fa-stack fa-lg">
                        <i styleName="fa fa-circle fa-stack-2x" />
                        <i styleName="fa fa-vk fa-stack-1x inverse" />
                    </a> */ }
                </div>

                <div styleName="mark">
                    <span>{ new Date().getFullYear() } made by</span>
                    <span styleName="author">ashtrie</span>
                </div>
            </footer>
        );
    }
}


export default CSSModules(Footer, styles, { allowMultiple: true });
