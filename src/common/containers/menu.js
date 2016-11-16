const React = require('react');
const {
    Dimensions,
    StyleSheet,
    ScrollView,
    View,
    Image,
    Text,
    TextInput,
    TouchableHighlight
} = require('react-native');
const { Component } = React;

const window = Dimensions.get('window');
// const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';
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
        fontSize: 14,
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
        onItemSelected: React.PropTypes.func.isRequired,
    };

    render() {
        return (
            <ScrollView scrollsToTop={false} style={styles.menu}>
                <View style={styles.avatarContainer}>
                    <Image
                        style={styles.avatar}
                        source={{ uri, }}/>
                    <Text style={styles.name}>Login to AccessMap</Text>
                </View>

                <TextInput
                    style={styles.textInput}
                    placeholder="Origin..."
                    autoCorrect={false}
                    autoCapitalize={'none'}/>

                <TextInput
                    style={styles.textInput}
                    placeholder="Destination..."
                    autoCorrect={false}
                    autoCapitalize={'none'}/>

                <TouchableHighlight
                    activeOpacity={50}
                    underlayColor={'#00008b'}
                    style={styles.button}
                    // onPress={() => this.removeRoute()}
                    >
                    <View>
                        <Text style={styles.button_text}>Draw Route</Text>
                    </View>
                </TouchableHighlight>

                <Text
                    onPress={() => this.props.onItemSelected('About')}
                    style={styles.item}>
                    About
                </Text>

                <Text
                    onPress={() => this.props.onItemSelected('Contacts')}
                    style={styles.item}>
                    Contacts
                </Text>
            </ScrollView>
        );
    }
};
