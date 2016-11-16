import React, {Component} from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native'
// var mapView = require('./src/common/components/map');
// var Application = require('./src/common/containers/main');
import Application from './src/common/containers/main'

AppRegistry.registerComponent('AccessMap', () => Application);