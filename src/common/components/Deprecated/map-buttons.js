'use strict';

const {Platform} = require('react-native');

async function _renderButtons() {
    return (
        <View>
            <Text onPress={() => this._map && this._map.setDirection(0)}>
                Set direction to 0
            </Text>
            <Text onPress={() => this._map && this._map.setZoomLevel(6)}>
                Zoom out to zoom level 6
            </Text>
            <Text onPress={() => this._map && this._map.setCenterCoordinate(48.8589, 2.3447)}>
                Go to Paris at current zoom level {parseInt(this.state.currentZoom)}
            </Text>
            <Text onPress={() => this._map && this._map.setCenterCoordinateZoomLevel(35.68829, 139.77492, 14)}>
                Go to Tokyo at fixed zoom level 14
            </Text>
            <Text onPress={() => this._map && this._map.easeTo({pitch: 30})}>
                Set pitch to 30 degrees
            </Text>
            <Text onPress={this.addNewMarkers}>
                Add new marker
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
            <Text onPress={() => this.setState({annotations: []})}>
                Remove all annotations
            </Text>
            <Text
                onPress={() => this._map && this._map.setVisibleCoordinateBounds(40.712, -74.227, 40.774, -74.125, 100, 0, 0, 0)}>
                Set visible bounds to 40.7, -74.2, 40.7, -74.1
            </Text>
            <Text onPress={() => this.setState({userTrackingMode: Mapbox.userTrackingMode.followWithHeading})}>
                Set userTrackingMode to followWithHeading
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
            <Text>User tracking mode is {this.state.userTrackingMode}</Text>
        </View>
    );
}

module.exports =  {_renderButtons};