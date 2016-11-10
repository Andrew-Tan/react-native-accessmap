'use strict';
/* eslint no-console: 0 */

import React, {Component} from 'react';
import Mapbox, {MapView} from 'react-native-mapbox-gl';
import {
    AppRegistry,
    StyleSheet,
    Text,
    StatusBar,
    View,
    ScrollView,
    TouchableHighlight,
    TextInput,
    KeyboardAvoidingView
} from 'react-native';

import {get_route} from '../actions/route';
import {access_token} from '../api'

Mapbox.setAccessToken(access_token);

export default class Map extends Component {
    state = {
        center: {
            latitude: 47.6527025,
            longitude: -122.3075777
        },
        zoom: 11,
        origin: null,
        dest: null,
        userTrackingMode: Mapbox.userTrackingMode.none,
        annotations: []
    };

    onRegionDidChange = (location) => {
        this.setState({currentZoom: location.zoomLevel});
        console.log('onRegionDidChange', location);
    };
    onRegionWillChange = (location) => {
        console.log('onRegionWillChange', location);
    };
    onUpdateUserLocation = (location) => {
        console.log('onUpdateUserLocation', location);
    };
    onOpenAnnotation = (annotation) => {
        console.log('onOpenAnnotation', annotation);
    };
    onRightAnnotationTapped = (e) => {
        console.log('onRightAnnotationTapped', e);
    };
    onLongPress = (location) => {
        console.log('onLongPress', location);
    };
    onTap = (location) => {
        if (this.state.origin == null) {
            this.state.origin = [location.latitude, location.longitude];
            var org = this.getMarker(this.state.origin, 'Orig', 'Origin', 'origin');
            this.insertAnnotation(org);
            return;
        }

        if (this.state.dest == null) {
            this.state.dest = [location.latitude, location.longitude];
            var des = this.getMarker(this.state.dest, 'Dest', 'Destination', 'destination');
            this.insertAnnotation(des);

            get_route(this.state.origin, this.state.dest, this.displayRoute);
            return;
        }

        this.setState({
            annotations: this.state.annotations.filter(a => (a.id !== 'origin' && a.id !== 'destination' && a.id !== 'route'))
        });

        this.state.origin = null;
        this.state.dest = null;
    };
    getMarker = (location,title,subtitle,markerid) => {
        return {
            coordinates: location,
            type: 'point',
            title: title,
            subtitle: subtitle,
            id: markerid
        }
    };
    onChangeUserTrackingMode = (userTrackingMode) => {
        this.setState({userTrackingMode});
        console.log('onChangeUserTrackingMode', userTrackingMode);
    };

    componentWillMount() {
        this._offlineProgressSubscription = Mapbox.addOfflinePackProgressListener(progress => {
            console.log('offline pack progress', progress);
        });
        this._offlineMaxTilesSubscription = Mapbox.addOfflineMaxAllowedTilesListener(tiles => {
            console.log('offline max allowed tiles', tiles);
        });
        this._offlineErrorSubscription = Mapbox.addOfflineErrorListener(error => {
            console.log('offline error', error);
        });
    }

    componentWillUnmount() {
        this._offlineProgressSubscription.remove();
        this._offlineMaxTilesSubscription.remove();
        this._offlineErrorSubscription.remove();
    }

    addNewMarkers = () => {
        // Treat annotations as immutable and create a new one instead of using .push()
        this._map.setCenterCoordinateZoomLevel(47.6527025, -122.3075777, 15);
        this.setState({
            annotations: [...this.state.annotations, {
                coordinates: [47.6527025, -122.3075777],
                type: 'point',
                title: 'This is a new marker located at uw',
                id: 'marker_uw'
            }, {
                'coordinates': [[40.749857912194386, -73.96820068359375], [40.741924698522055, -73.9735221862793], [40.735681504432264, -73.97523880004883], [40.7315190495212, -73.97438049316406], [40.729177554196376, -73.97180557250975], [40.72345355209305, -73.97438049316406], [40.719290332250544, -73.97455215454102], [40.71369559554873, -73.97729873657227], [40.71200407096382, -73.97850036621094], [40.71031250340588, -73.98691177368163], [40.71031250340588, -73.99154663085938]],
                'type': 'polygon',
                'fillAlpha': 1,
                'fillColor': '#000000',
                'strokeAlpha': 1,
                'id': 'new-black-polygon'
            }]
        });
    };

    updateMarker2 = () => {
        // Treat annotations as immutable and use .map() instead of changing the array
        this.setState({
            annotations: this.state.annotations.map(annotation => {
                if (annotation.id !== 'marker2') {
                    return annotation;
                }
                return {
                    coordinates: [40.714541341726175, -74.00579452514648],
                    'type': 'point',
                    title: 'New Title!',
                    subtitle: 'New Subtitle',
                    annotationImage: {
                        source: {uri: 'https://cldup.com/7NLZklp8zS.png'},
                        height: 25,
                        width: 25
                    },
                    id: 'marker2'
                };
            })
        });
    };

    removeMarker2 = () => {
        this.setState({
            annotations: this.state.annotations.filter(a => a.id !== 'marker2')
        });
    };

    insertAnnotation = (annotation) => {
        this.setState({
            annotations: [...this.state.annotations, annotation]
        });
    };

    displayRoute = (annotation) => {
        this.insertAnnotation(annotation);

        var min_longitude = 500;
        var min_latitude = 500;
        var max_longitude = -500;
        var max_latitude = -500;
        annotation.coordinates.forEach(function (point) {
            if (point[0] < min_latitude) {
                min_latitude = point[0];
            }

            if (point[0] > max_latitude) {
                max_latitude = point[0];
            }

            if (point[1] < min_longitude) {
                min_longitude = point[1];
            }

            if (point[1] > max_longitude) {
                max_longitude = point[1];
            }
        });

        this._map.setVisibleCoordinateBounds(min_latitude, min_longitude, max_latitude, max_longitude, 50, 50, 50, 50);
    };

    render() {
        StatusBar.setHidden(true);
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    {this._renderButtons()}
                </ScrollView>
                <MapView
                    ref={map => {
                        this._map = map;
                    }}
                    style={styles.map}
                    initialCenterCoordinate={this.state.center}
                    initialZoomLevel={this.state.zoom}
                    initialDirection={0}
                    rotateEnabled={true}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    showsUserLocation={false}
                    styleURL={Mapbox.mapStyles.dark}
                    userTrackingMode={this.state.userTrackingMode}
                    annotations={this.state.annotations}
                    annotationsAreImmutable={true}
                    onChangeUserTrackingMode={this.onChangeUserTrackingMode}
                    onRegionDidChange={this.onRegionDidChange}
                    onRegionWillChange={this.onRegionWillChange}
                    onOpenAnnotation={this.onOpenAnnotation}
                    onRightAnnotationTapped={this.onRightAnnotationTapped}
                    onUpdateUserLocation={this.onUpdateUserLocation}
                    onLongPress={this.onLongPress}
                    onTap={this.onTap}
                    logoIsHidden={true}
                />
            </View>
        );
    }

    _renderButtons() {
        return (
            <View>
                <Text style={styles.view_text}>User tracking mode is {this.state.userTrackingMode}</Text>
                <Text style={styles.view_text}>Center is [{this.state.center.latitude}, {this.state.center.longitude}]</Text>
                <Text style={styles.view_text}>Zoom level is {this.state.zoom}</Text>
                <TextInput
                    style={styles.text_input}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                />
                <TouchableHighlight
                    activeOpacity={50}
                    underlayColor={'#00008b'}
                    style={styles.button}
                    onPress={() => get_route([47.663593, -122.313823], [47.662437, -122.316162], this.displayRoute)}>
                    <View>
                        <Text style={styles.button_text}>Draw Route</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={50}
                    underlayColor={'#00008b'}
                    style={styles.button}
                    onPress={() => this.setState({userTrackingMode: Mapbox.userTrackingMode.followWithHeading})}>
                    <View>
                        <Text style={styles.button_text}>Set tracking mode to follow with heading</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={50}
                    underlayColor={'#00008b'}
                    style={styles.button}
                    onPress={() => this.setState({userTrackingMode: Mapbox.userTrackingMode.none})}>
                    <View>
                        <Text style={styles.button_text}>Set tracking mode to none</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={50}
                    underlayColor={'#00008b'}
                    style={styles.button}
                    onPress={() => this._map && this._map.setZoomLevel(6)}>
                    <View>
                        <Text style={styles.button_text}>Zoom out to zoom level 6</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={50}
                    underlayColor={'#00008b'}
                    style={styles.button}
                    onPress={() => this._map && this._map.setCenterCoordinate(47.6527025, -122.3075777)}>
                    <View>
                        <Text style={styles.button_text}>
                            Go to UW at current zoom level {parseInt(this.state.currentZoom)}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={50}
                    underlayColor={'#00008b'}
                    style={styles.button}
                    onPress={() => this._map && this._map.setCenterCoordinateZoomLevel(47.6527025, -122.3075777, 14)}>
                    <View>
                        <Text style={styles.button_text}>
                            Go to UW at zoom level 14</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={50}
                    underlayColor={'#00008b'}
                    style={styles.button}
                    onPress={() => this._map && this._map.setCenterCoordinate(48.8589, 2.3447)}>
                    <View>
                        <Text style={styles.button_text}>
                            Go to Paris at current zoom level {parseInt(this.state.currentZoom)}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={50}
                    underlayColor={'#00008b'}
                    style={styles.button}
                    onPress={() => this._map && this._map.easeTo({pitch: 60})}>
                    <View>
                        <Text style={styles.button_text}>Set pitch to 60 degrees</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={50}
                    underlayColor={'#00008b'}
                    style={styles.button}
                    onPress={() => this._map && this._map.easeTo({pitch: 0})}>
                    <View>
                        <Text style={styles.button_text}>Set pitch to 0 degree</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={50}
                    underlayColor={'#00008b'}
                    style={styles.button}
                    onPress={this.addNewMarkers}>
                    <View>
                        <Text style={styles.button_text}>Add marker at UW</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={50}
                    underlayColor={'#00008b'}
                    style={styles.button}
                    onPress={() => this._map && this._map.selectAnnotation('marker_uw')}>
                    <View>
                        <Text style={styles.button_text}>Open UW marker popup</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={50}
                    underlayColor={'#00008b'}
                    style={styles.button}
                    onPress={() => this.setState({annotations: []})}>
                    <View>
                        <Text style={styles.button_text}>Remove all annotations</Text>
                    </View>
                </TouchableHighlight>
                <Text onPress={() => this._map && this._map.setDirection(0)}>
                    Set direction to 0
                </Text>
                <Text onPress={this.updateMarker2}>
                    Update marker2
                </Text>
                <Text onPress={() => this._map && this._map.selectAnnotation('marker1')}>
                    Open marker1 popup
                </Text>
                <Text onPress={this.removeMarker2}>
                    Remove marker2 annotation
                </Text>
                <Text
                    onPress={() => this._map && this._map.setVisibleCoordinateBounds(40.712, -74.227, 40.774, -74.125, 100, 0, 0, 0)}>
                    Set visible bounds to 40.7, -74.2, 40.7, -74.1
                </Text>
                <Text onPress={() => this._map && this._map.getCenterCoordinateZoomLevel((location)=> {
                    console.log(location);
                })}>
                    Get location
                </Text>
                <Text onPress={() => this._map && this._map.getDirection((direction)=> {
                    console.log(direction);
                })}>
                    Get direction
                </Text>
                <Text onPress={() => this._map && this._map.getBounds((bounds)=> {
                    console.log(bounds);
                })}>
                    Get bounds
                </Text>
                <Text onPress={() => {
                    Mapbox.addOfflinePack({
                        name: 'test',
                        type: 'bbox',
                        bounds: [0, 0, 0, 0],
                        minZoomLevel: 0,
                        maxZoomLevel: 0,
                        metadata: {anyValue: 'you wish'},
                        styleURL: Mapbox.mapStyles.dark
                    }).then(() => {
                        console.log('Offline pack added');
                    }).catch(err => {
                        console.log(err);
                    });
                }}>
                    Create offline pack
                </Text>
                <Text onPress={() => {
                    Mapbox.getOfflinePacks()
                        .then(packs => {
                            console.log(packs);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }}>
                    Get offline packs
                </Text>
                <Text onPress={() => {
                    Mapbox.removeOfflinePack('test')
                        .then(info => {
                            if (info.deleted) {
                                console.log('Deleted', info.deleted);
                            } else {
                                console.log('No packs to delete');
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }}>
                    Remove pack with name 'test'
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#f0f8ff'
    },
    map: {
        flex: 2
    },
    scrollView: {
        flex: 1
    },
    button_text: {
        color: '#fffafa'
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
    text_input:{
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        paddingLeft: 10,
        paddingRight: 10
    },
    view_text: {
        marginTop: 5,
        textAlign: 'center'
    }
});
