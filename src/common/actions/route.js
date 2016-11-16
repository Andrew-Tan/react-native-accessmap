'use strict';

import {routing_api} from '../api';

export var get_route = (origin, destination, callback) => {
    const ori_lat = origin[0];
    const ori_lon = origin[1];
    const des_lat = destination[0];
    const des_lon = destination[1];

    const api_url = routing_api + '?waypoints=[' + ori_lat + ',' + ori_lon + ',' + des_lat + ',' + des_lon + ']';

    var request = new XMLHttpRequest();
    request.addEventListener("readystatechange", process_route_request, false);
    request.open('GET', api_url, true);
    request.send( null );

    function process_route_request() {
        if (request.readyState == 4 && request.status == 200) {
            // request success
            var response_json = JSON.parse(request.responseText);

            callback(response_json.routes[0].geometry);
        }
    }
};

/*
var json_to_annotation = (json) => {
    var route_coordinates = json.routes[0].geometry.coordinates;

    route_coordinates = route_coordinates.map(coordinate => {
        return [coordinate[1], coordinate[0]];
    });

    return {
        coordinates: route_coordinates,
        type: 'polyline',
        strokeColor: '#00FB00',
        strokeWidth: 5,
        strokeAlpha: .5,
        id: 'route'
    };
};*/
