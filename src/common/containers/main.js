import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import DrawerScene from './Drawer';
import MapView from '../components/map'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getRoute: []
        }
    }

    getRoute(orig, dest) {
        this.state.getRoute(orig, dest);
    }

    setGEtRouteFunc(func) {
        this.state.getRoute = func
    }

    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene key="drawer" component={DrawerScene} open={false} getRoute={this.getRoute.bind(this)} >
                        <Scene key="main" component={MapView} initial={true} routeFunc={this.setGEtRouteFunc.bind(this)} >
                        </Scene>
                    </Scene>
                </Scene>
            </Router>
        )
    }
}