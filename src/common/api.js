'use strict';

export const access_token = 'pk.eyJ1IjoiYml0bG9ja2VyIiwiYSI6ImNpdWVxdzQ2ZjAwY2oyeXJ1ZHBnOHg4ZGcifQ.k1PUnopcHUTI4vcuP1qvkg';

export const routing_api = "https://accessmapseattle.com/api/v2/route.json";

export const map_style = {
    "version": 8,
    "sources": {
        "simple-tiles": {
            "type": "raster",
            "url": "mapbox://mapbox.streets",
            "tileSize": 256
        }
    },
    "layers": [
        {
            "id": "simple-tiles",
            "type": "raster",
            "source": "simple-tiles"
        }
    ]
}