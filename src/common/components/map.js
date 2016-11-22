/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react'
import {
    WebView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Touchable,
    TouchableHighlight,
    TextInput,
    Image,
    TouchableOpacity,
    Switch,
    Alert
} from 'react-native'
import {mainScript} from '../actions/mapScript'
import {get_route} from '../actions/route'
let WebViewBridge = require('react-native-webview-bridge');

import {Actions} from 'react-native-router-flux';

let MapView = React.createClass({
    getInitialState: function() {
        return {
            mapCenter: {lat: 47.6553351,lng: -122.3057086},
            lastPosition: null,
            watchID: null,
        };
    },

    mapFunctions: function (instruction) {
        switch (instruction.func) {
            case "getRouteByCoordinate":
                Actions.refresh({key: 'drawer', open: value => false});
                this.getRouteByCoordinate(instruction.args[0], instruction.args[1]);
                break;
            case "setVisibility":
                this.setVisibility(instruction.args[0], instruction.args[1]);
                break;
            case "removeRoute":
                Actions.refresh({key: 'drawer', open: value => false});
                this.removeRoute();
                break;
            default:
                console.error("Unrecognized Command!");
                break;
        }
    },

    componentDidMount: function () {
        this.state.watchID = navigator.geolocation.watchPosition((position) => {
            this.setState({lastPosition: position});
            this.refs.webviewbridge.sendToBridge(
                JSON.stringify({
                "func": "updateCurrentPosition",
                "args": [
                    position.coords.longitude,
                    position.coords.latitude
                ]}),
                (error) => alert(JSON.stringify(error)),
                {enableHighAccuracy: true, timeout: 2000, maximumAge: 1000}
            );
        });
    },

    componentWillUnmount: function () {
        navigator.geolocation.clearWatch(this.state.watchID);
    },

    onBridgeMessage: function (message) {
        const {webviewbridge} = this.refs;

        let jsonData = JSON.parse(message);
        switch (jsonData.func) {
            case "mapCenter":
                let center = jsonData.args[0];
                this.setState({mapCenter: center});
                break;
            default:
                console.error("Unrecognized Command!");
                break;
        }
    },

    drawRoute: function (geometry) {
        let geojson = {
            "type": "Feature",
            "properties": {},
            "geometry": geometry
        };

        let json_add = {
            "func": "addGeoJSON",
            "args": [
                // annotation id
                "route",
                // annotation type
                "line",
                // annotation
                geojson
            ]
        };

        this.refs.webviewbridge.sendToBridge(JSON.stringify(json_add));

        let min_longitude = 500;
        let min_latitude = 500;
        let max_longitude = -500;
        let max_latitude = -500;
        geometry.coordinates.forEach(function (point) {
            if (point[1] < min_latitude) { min_latitude = point[1];}

            if (point[1] > max_latitude) { max_latitude = point[1]; }

            if (point[0] < min_longitude) { min_longitude = point[0]; }

            if (point[0] > max_longitude) { max_longitude = point[0]; }
        });
        let LngLatBound = [
            [
                min_longitude,
                min_latitude
            ],
            [
                max_longitude,
                max_latitude
            ]
        ];

        let json_display = {
            "func": "fitBounds",
            "args": [
                LngLatBound
            ]
        };

        this.refs.webviewbridge.sendToBridge(JSON.stringify(json_display));
    },

    removeRoute: function () {
        let json = {
            "func": "removeGeoJSON",
            "args": [
                "route"
            ]
        };

        this.refs.webviewbridge.sendToBridge(JSON.stringify(json));
    },

    getRouteByCoordinate: function (origin, destination) {
        if (origin == null || destination == null) {
            console.log("\n\n\nFrom current pos and map center!\n\n\n")
            let currentPos = this.state.lastPosition.coords;
            get_route(
                [currentPos.latitude, currentPos.longitude],
                [this.state.mapCenter.lat, this.state.mapCenter.lng],
                this.drawRoute
            );
        } else {
            get_route(origin, destination, this.drawRoute);
        }
    },

    setVisibility: function (layerID, visibility) {
        let visible = visibility ? 'visible' : 'none';
        switch (layerID) {
            case "sidewalks":
                this.setState({sidewalksVisibility: visibility});
                let sidewalkJson = {
                    "func": "setVisibility",
                    "args": [
                        "sidewalks-outline",
                        visible
                    ]
                };
                this.refs.webviewbridge.sendToBridge(JSON.stringify(sidewalkJson));
                sidewalkJson.args[0] = "sidewalks";
                this.refs.webviewbridge.sendToBridge(JSON.stringify(sidewalkJson));
                break;
            case "crossings":
                this.setState({crossingsVisibility: visibility});
                let crossingJson = {
                    "func": "setVisibility",
                    "args": [
                        "crossings-outline",
                        visible
                    ]
                };
                this.refs.webviewbridge.sendToBridge(JSON.stringify(crossingJson));
                crossingJson.args[0] = "crossings";
                this.refs.webviewbridge.sendToBridge(JSON.stringify(crossingJson));
                break;
            default:
                break;
        }
    },

    render: function () {
        // StatusBar.setHidden(true);
        this.props.mapFunc(this.mapFunctions);
        return (
            <View style={styles.container}>
                <View style={styles.top_padding} />
                <View style={styles.map}>
                    <WebViewBridge
                        ref="webviewbridge"
                        onBridgeMessage={this.onBridgeMessage}
                        javaScriptEnabled={true}
                        injectedJavaScript={"(" + mainScript.toString() + "())"}
                        source={require('./WebViews/MapboxGL.html')}/>
                </View>
                <TouchableOpacity
                    activeOpacity={0.2}
                    style={styles.overlay_button}
                    onPress={() => Actions.refresh({key: 'drawer', open: value => !value})}>
                    <View>
                        <Image
                            style={{width: 50, height: 50}}
                            source={require('../../../assets/round-border-menu-bar-512.png')}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
});

module.exports = MapView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#f0f8ff'
    },
    map: {
        flex: 1
    },
    button: {
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: '#6495ed',
    },
    scrollView: {
        flex: 1,
        padding: 20
    },
    overlay_button: {
        position: 'absolute',
        top: 20,
        bottom: 0,
        left: 10,
        right: 0,
        width: 50,
        height: 50,
        alignItems: 'center',
        // borderWidth: 1,
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        // backgroundColor: '#6495ed',
    },
    top_padding: {
        paddingTop: 20,
        backgroundColor: 'white'
    }
});
