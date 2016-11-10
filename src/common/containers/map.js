import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class MyWeb extends Component {
    render() {
        return (
            <WebView
                source={{uri: 'https://www.accessmapseattle.com/'}}
                style={{marginTop: 20}}
            />
        );
    }
}
