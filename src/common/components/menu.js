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
        fontSize: 25,
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

                <Switch
                    onValueChange={(value) => this.toggleMapSwitch("sidewalks", value)}
                    style={{marginBottom: 10}}
                    value={this.state.sidewalksVisibility} />

                <Switch
                    onValueChange={(value) => this.toggleMapSwitch("crossings", value)}
                    style={{marginBottom: 10}}
                    value={this.state.crossingsVisibility} />

                <TextInput
                    style={styles.textInput}
                    placeholder="Origin..."
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    onChangeText={(text) => this.state.origin = text}
                />

                <TextInput
                    style={styles.textInput}
                    placeholder="Destination..."
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    onChangeText={(text) => this.state.destination = text}
                />

                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.button}
                    onPress={() => this.getRoute()} >
                    <View>
                        <Text style={styles.button_text}>Draw Route</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.button}
                    onPress={() => this.getRoute(false)} >
                    <View>
                        <Text style={styles.button_text}>Fast Draw</Text>
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
