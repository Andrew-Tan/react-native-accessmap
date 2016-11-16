const SideMenu = require('react-native-side-menu');
import React, {Component} from 'react';
const Menu = require('./menu');
const {
    View,
    Text,
    StyleSheet
} = require('react-native');
var mapView = require('../components/map');

class ContentView extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                <Text style={styles.instructions}>
                    To get started, edit index.ios.js
                </Text>
                <Text style={styles.instructions}>
                    Press Cmd+R to reload,{'\n'}
                    Cmd+Control+Z for dev menu
                </Text>
            </View>
        );
    }
}

export default class Application extends Component {
    render() {
        const menu = <Menu navigator={navigator}/>;

        return (
            <SideMenu menu={menu}>
                <mapView/>
            </SideMenu>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 20,
        padding: 10,
    },
    caption: {
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});