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
    StatusBar
} from 'react-native'
import { mainScript } from '../actions/mapScript'
import { get_route } from '../actions/route'
var WebViewBridge = require('react-native-webview-bridge');

var mapView = React.createClass({
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

    testSend: function () {
        var json = {
            "func": "flyTo",
            "args": [
                -122.3125913,
                47.6636329
            ]
        };
        
        this.refs.webviewbridge.sendToBridge(JSON.stringify(json));
    },

    drawRoute: function (geojson) {
        var json_add = {
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
    },

    removeRoute: function () {
        var json = {
            "func": "removeGeoJSON",
            "args": [
                // annotation id
                "route"
            ]
        };

        this.refs.webviewbridge.sendToBridge(JSON.stringify(json));
    },

    render: function () {
        StatusBar.setHidden(true);
        console.log("(" + mainScript.toString() + "())");
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <TouchableHighlight
                        activeOpacity={50}
                        underlayColor={'#00008b'}
                        style={styles.button}
                        onPress={() => get_route([47.663593, -122.313823], [47.662437,-122.316162], this.drawRoute)}>
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
