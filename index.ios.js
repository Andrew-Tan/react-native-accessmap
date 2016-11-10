import React, {Component} from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native'
var mapView = require('./src/common/components/map');

AppRegistry.registerComponent('AccessMap', () => mapView);