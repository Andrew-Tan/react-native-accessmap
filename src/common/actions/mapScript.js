'use strict';

export var mainScript = function () {
    // Register WebView Bridge
    if (WebViewBridge) {
        WebViewBridge.onMessage = function (message) {
            // Converts the payload in JSON format.
            var jsonData = JSON.parse(message);
            switch (jsonData.func) {
                case "flyTo":
                    map.flyTo({
                        center: [
                            jsonData.args[0],
                            jsonData.args[1]
                        ]
                    });
                    break;
                case "addGeoJSON":
                    if (map.getLayer(jsonData.args[0]) != undefined) {
                        map.removeLayer(jsonData.args[0]);
                        map.removeSource(jsonData.args[0]);
                    }
                    map.addSource(jsonData.args[0], {
                        type: 'geojson',
                        data: jsonData.args[2]
                    });
                    map.addLayer({
                        "id": jsonData.args[0],
                        "type": jsonData.args[1],
                        "source": jsonData.args[0],
                        "layout": {
                            "line-join": "round",
                            "line-cap": "round"
                        },
                        "paint": {
                            "line-color": "#FC6399",
                            "line-width": 5
                        }
                    });
                    break;
                case "removeGeoJSON":
                    map.removeLayer(jsonData.args[0]);
                    map.removeSource(jsonData.args[0]);
                    break;
                case "fitBounds":
                    map.fitBounds(jsonData.args[0], {
                        padding: 60
                    });
                    break;
                case "getCenterCoordinate":
                    let jsonToReturn = {
                        "func": "mapCenter",
                        "args":[map.getCenter()]
                    };
                    WebViewBridge.send(JSON.stringify(jsonToReturn));
                    break;
                case "setVisibility":
                    map.setLayoutProperty(jsonData.args[0], 'visibility', jsonData.args[1]);
                    break;
                case "updateCurrentPosition":
                    if (map == undefined) {
                        return;
                    }
                    if (map.getSource("curPos") != undefined) {
                        map.removeLayer("curPos");
                        map.removeSource("curPos");
                    }

                    map.addSource("curPos", {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection",
                            "features": [{
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [jsonData.args[0], jsonData.args[1]]
                                },
                                "properties": {
                                    "title": "Mapbox DC",
                                    "icon": "monument"
                                }
                            }]
                        }
                    });
                    map.addLayer({
                        "id": "curPos",
                        "type": "symbol",
                        "source": "curPos",
                        "layout": {
                            "icon-image": "monument-15",
                            // "text-field": "Current Position",
                            // "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                            // "text-offset": [0, 0.6],
                            // "text-anchor": "top"
                        }
                    });
                    break;
                default:
                    break;
            }
        };
    }
};