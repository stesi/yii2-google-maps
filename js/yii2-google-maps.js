(function ($) {
    $.fn.showMap = function (options) {

        var map;
        var mapOptions = {
            center: new google.maps.LatLng(55.997778, 37.190278),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            panControl: true
        };
        map = new google.maps.Map($(this).get(0), mapOptions);
        var marker = null;
        var createMarker = function (latLng) {
            // удалить маркер если уже был
            if (marker) {
                marker.remove();
            }
            marker = new google.maps.Marker({
                'position': latLng,
                'map': map
            });

            marker.remove = function () {
                google.maps.event.clearInstanceListeners(this);
                this.setMap(null);
            };
            map.setCenter(latLng);
            google.maps.event.addListener(map, 'idle', function () {
                google.maps.event.trigger(map, 'resize');
            });
        };
        createMarker(new google.maps.LatLng(options.latitude, options.longitude))

    };
    $.fn.directionMap = function (options) {
        var self = this;
        var map;

        var mapOptions = {
            center: new google.maps.LatLng(55.997778, 37.190278),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            panControl: true
        };
        map = new google.maps.Map($(self).get(0), mapOptions);
        google.maps.event.addListener(map, 'idle', function () {
            google.maps.event.trigger(map, 'resize');
        });
        if (options.onLoadMap) {
            options.onLoadMap(map);
        }
        var directionsDisplay = new google.maps.DirectionsRenderer({
            map: map
        });
        google.maps.event.addListener(map, 'click', function (event) {
            console.log(event)
        });
        if (typeof options.coords !== 'undefined') {
            var coords = [];
            var waypoints = [];
            $.each(options.coords, function (i, v) {
                var latLng = new google.maps.LatLng(v.lat, v.lng);
                coords.push(latLng);
                // var MarkerOpts = {
                //     position: latLng,
                //     label: v.label,
                //     map: map
                // };
                // if (typeof options.defaultMarkerIcon !== 'undefined') {
                //     MarkerOpts['icon'] = options.defaultMarkerIcon;
                // }
                //var marker = new google.maps.Marker(MarkerOpts);
                waypoints.push({
                    location: latLng,
                    stopover: true
                });

            });
            if (options.showPoly) {
                var flightPath = new google.maps.Polyline({
                    path: coords,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });
                flightPath.setMap(map);
            }
            directionsDisplay.setMap(map);
            map.setCenter(start);
            var start = coords.shift();
            var end = coords.pop();
        }

        // debugger;
        var directionsService = new google.maps.DirectionsService;
        directionsService.route({
            origin: start,
            destination: end,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Google Maps error: ' + status);
            }
        });
    }

})(jQuery);
