const React = require('react');
const {
    Dimensions,
    StyleSheet,
    ScrollView,
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    Linking,
    Switch
} = require('react-native');
const { Component } = React;

const window = Dimensions.get('window');
const uri = 'https://avatars3.githubusercontent.com/u/19319325?v=3&s=460';

const styles = StyleSheet.create({
    menu: {
        flex: 1,
        width: window.width,
        height: window.height,
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    avatarContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        flex: 1,
    },
    name: {
        position: 'absolute',
        left: 70,
        top: 20,
    },
    item: {
        marginRight: 80,
        fontSize: 25,
        fontWeight: '300',
        paddingTop: 5,
    },
    item_text: {
        marginRight: 80,
        fontSize: 15,
        fontWeight: '300',
        paddingTop: 5,
    },
    button: {
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        paddingTop: 5,
        paddingBottom: 5,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 0,
        marginRight: 80,
        backgroundColor: '#6495ed',
    },
    button_text: {
        color: 'white',
        fontSize: 20,
        fontWeight: '300',
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 0,
        marginRight: 80,
        paddingLeft: 10,
        paddingRight: 10
    },
    horizontalView: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10
    },
    switch: {
        flex: 1,
        alignSelf: 'center'
    },
    switch_text: {
        flex: 3,
        alignSelf: 'center',
        fontSize: 20
    }
});

module.exports = class Menu extends Component {
    static propTypes = {
        mapFunc: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            origin: -500,
            destination: -500,
            sidewalksVisibility: true,
            crossingsVisibility: true
        };
    }

    onLinkSelected(instruction) {
        let url = 'https://www.accessmapseattle.com/';
        switch (instruction) {
            case 'About':
                url = 'https://www.accessmapseattle.com/about';
                break;
            case 'Contacts':
                url = 'mailto:developers@accessmapseattle.com';
                break;
            default:
                break;
        }

        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    parseCoordinate(text) {
        let coordinate = text.split(",");
        console.log("Coordinate: " + coordinate[0] + " | " + coordinate[1]);
        return [parseFloat(coordinate[0]), parseFloat(coordinate[1])];
    }

    getRoute(from_coord) {
        if (!from_coord) {
            this.props.mapFunc({
                "func": "getRouteByCoordinate",
                "args": [null, null]
            });
            return;
        }

        if (this.state.origin == -500 || this.state.destination == -500) {
            return;
        }

        let origin = this.parseCoordinate(this.state.origin);
        let destination = this.parseCoordinate(this.state.destination);

        this.props.mapFunc({
            "func": "getRouteByCoordinate",
            "args": [origin, destination]
        });
    }

    toggleMapSwitch(id, value) {
        this.props.mapFunc({
            "func": "setVisibility",
            "args": [id, value]
        });

        switch (id) {
            case "sidewalks":
                this.setState({sidewalksVisibility: value});
                break;
            case "crossings":
                this.setState({crossingsVisibility: value});
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <ScrollView scrollsToTop={false} style={styles.menu}>
                <View style={styles.avatarContainer}>
                    <Image
                        style={styles.avatar}
                        source={{ uri, }}/>
                    <Text style={styles.name}>Login to AccessMap</Text>
                </View>

                <View style={styles.horizontalView}>
                    <Switch
                        onValueChange={(value) => this.toggleMapSwitch("sidewalks", value)}
                        style={styles.switch}
                        value={this.state.sidewalksVisibility} />
                    <Text style={styles.switch_text}>
                        Sidewalk Lines
                    </Text>
                </View>

                <View style={styles.horizontalView}>
                    <Switch
                        onValueChange={(value) => this.toggleMapSwitch("crossings", value)}
                        style={styles.switch}
                        value={this.state.crossingsVisibility} />
                    <Text style={styles.switch_text}>
                        Crossing Lines
                    </Text>
                </View>

                <TextInput
                    style={styles.textInput}
                    placeholder="Origin Coordinate..."
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    onChangeText={(text) => this.state.origin = text}
                />

                <TextInput
                    style={styles.textInput}
                    placeholder="Destination Coordinate..."
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    onChangeText={(text) => this.state.destination = text}
                />

                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.button}
                    onPress={() => this.getRoute()} >
                    <View>
                        <Text style={styles.button_text}>Get Route</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.button}
                    onPress={() => this.props.mapFunc({
                        "func": "removeRoute"
                    })} >
                    <View>
                        <Text style={styles.button_text}>Remove Route</Text>
                    </View>
                </TouchableOpacity>

                <Text style={styles.item_text}>
                    By pressing get route without specifying the origin and destination coordinate, the app will
                    find a route from current position to current center of the map
                </Text>

                <Text
                    onPress={() => this.onLinkSelected('About')}
                    style={styles.item}>
                    About
                </Text>

                <Text
                    onPress={() => this.onLinkSelected('Contacts')}
                    style={styles.item}>
                    Contacts
                </Text>
            </ScrollView>
        );
    }
};
