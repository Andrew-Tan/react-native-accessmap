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
    StatusBar,
    TextInput
} from 'react-native'
import { mainScript } from '../actions/mapScript'
import { get_route } from '../actions/route'
var WebViewBridge = require('react-native-webview-bridge');

var mapView = React.createClass({
    state: {

    },

    onBridgeMessage: function (message) {
        const {webviewbridge} = this.refs;

        switch (message) {
            case "hello from webview":
                webviewbridge.sendToBridge("hello from react-native");
                break;
            case "got the message inside webview":
                console.log("we have got a message from webview! yeah!!");
                break;
        }
    },

    drawRoute: function (geometry) {
        let geojson = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {},
                "geometry": geometry
            }]
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
            if (point[1] < min_latitude) {
                min_latitude = point[1];
            }

            if (point[1] > max_latitude) {
                max_latitude = point[1];
            }

            if (point[0] < min_longitude) {
                min_longitude = point[0];
            }

            if (point[0] > max_longitude) {
                max_longitude = point[0];
            }
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
                // annotation id
                "route"
            ]
        };

        this.refs.webviewbridge.sendToBridge(JSON.stringify(json));
    },

    render: function () {
        // StatusBar.setHidden(true);
        console.log("(" + mainScript.toString() + "())");
        return (
            <View style={styles.container}>
                <StatusBar
                    hidden={false}
                    backgroundColor="blue"
                    barStyle="light-content"
                />
                <TextInput
                    style={{height: 40}}
                    placeholder="Type here to translate!"
                />
                <ScrollView style={styles.scrollView}>
                    <TouchableHighlight
                        activeOpacity={50}
                        underlayColor={'#00008b'}
                        style={styles.button}
                        onPress={() => get_route([47.665490, -122.314471], [47.666902, -122.307375], this.drawRoute)}>
                        <View>
                            <Text style={styles.button_text}>Draw Route</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={50}
                        underlayColor={'#00008b'}
                        style={styles.button}
                        onPress={() => this.removeRoute()}>
                        <View>
                            <Text style={styles.button_text}>Remove Route</Text>
                        </View>
                    </TouchableHighlight>
                </ScrollView>
                <View style={styles.map}>
                    <WebViewBridge
                        ref="webviewbridge"
                        onBridgeMessage={this.onBridgeMessage}
                        javaScriptEnabled={true}
                        injectedJavaScript={"(" + mainScript.toString() + "())"}
                        source={require('./MapboxGL.html')}/>
                </View>
            </View>
        );
    }
});

module.exports = mapView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#f0f8ff'
    },
    map: {
        flex: 2
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
        flex: 1
    }
});
