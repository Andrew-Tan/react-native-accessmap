import React, { Component } from 'react';
import Drawer from 'react-native-drawer';
const Menu = require('../components/menu');
import {Actions, DefaultRenderer} from 'react-native-router-flux';

export default class DrawerScene extends Component {
    render(){
        const state = this.props.navigationState;
        const children = state.children;
        const menu = <Menu
            drawRoute={this.props.getRoute}
            navigator={navigator}/>;
        return (
            <Drawer
                ref="navigation"
                open={state.open}
                onOpen={()=>Actions.refresh({key:state.key, open: true})}
                onClose={()=>Actions.refresh({key:state.key, open: false})}
                type="displace"
                content={menu}
                tapToClose={true}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                negotiatePan={true}
                tweenHandler={(ratio) => ({
                    main: { opacity:Math.max(0.54,1-ratio) }
                })}>
                <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
            </Drawer>
        );
    }
}