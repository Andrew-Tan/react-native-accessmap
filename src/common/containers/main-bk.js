const SideMenu = require('react-native-side-menu');
import React, {Component} from 'react';
const Menu = require('./menu');
const {
    StyleSheet,
    StatusBar
} = require('react-native');
// import MapView from '../components/map'
import MapView from '../components/map'

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

export default class Application extends Component {
    state = {

    };

    onItemSelected(itemName) {
        console.log("Selected: " + itemName);
        this.state.mapView.exampleRoute();
    }

    render() {
        const menu = <Menu
            onItemSelected={this.onItemSelected}
            navigator={navigator}/>;

        return (
            <SideMenu
                menu={menu}
                openMenuOffset={300}>
                <StatusBar
                    hidden={false}
                    backgroundColor="blue"
                    barStyle="dark-content"
                />
                <MapView/>
            </SideMenu>
        );
    }
}