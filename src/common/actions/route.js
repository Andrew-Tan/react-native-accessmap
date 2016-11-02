'use strict';

import {routing_api} from '../api';

export var get_route = (map, origin, destination) => {
    const ori_lat = origin[0];
    const ori_lon = origin[1];
    const des_lat = destination[0];
    const des_lon = destination[1];

    const api_url = routing_api + '?waypoints=[' + ori_lat + ',' + ori_lon + ',' + des_lat + ',' + des_lon + ']';
    console.log('API URL:' + api_url);

    var request = new XMLHttpRequest();
    request.onreadystatechange = process_route_request;
    request.open('GET', api_url, true);
    request.send( null );

    function process_route_request() {
        if (request.readyState == 4 && request.status == 200) {
            // Passed
            var response_json = JSON.parse(request.responseText);
            var route_coordinates = response_json.routes[0].geometry.coordinates;

            route_coordinates = route_coordinates.map(coordinate => {
                return [coordinate[1], coordinate[0]];
            });

            var route_annotation = {
                coordinates: route_coordinates,
                type: 'polyline',
                strokeColor: '#00FB00',
                strokeWidth: 5,
                strokeAlpha: .5,
                id: 'route'
            };

            route_annotation.coordinates.forEach(function (element) {
                console.log(element)
            });

            map.setState({
                annotations: [...map.state.annotations, route_annotation]
            });

            map._map.setCenterCoordinateZoomLevel(47.6527025, -122.3075777, 13);
        } else {
            console.log('Could not get route!');
        }
    }
};