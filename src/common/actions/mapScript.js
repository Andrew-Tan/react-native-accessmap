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
                            "line-color": "#00ff00",
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
                default:
                    break;
            }
        };
    }
};