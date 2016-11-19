import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import DrawerScene from './sideMenu';
import MapView from '../components/map'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapFunc: null
        }
    }

    getMapFunc(instruction) {
        return this.state.mapFunc(instruction);
    }

    setMapFunc(obj) {
        this.state.mapFunc = obj;
    }

    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene key="drawer" component={DrawerScene} open={false} mapFunc={this.getMapFunc.bind(this)} >
                        <Scene key="main" component={MapView} initial={true} mapFunc={this.setMapFunc.bind(this)} >
                        </Scene>
                    </Scene>
                </Scene>
            </Router>
        )
    }
}