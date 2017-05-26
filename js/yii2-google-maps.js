(function ($) {

    $.fn.directionMap = function (options) {
        var self = this;
        var map;

        var mapOptions = {
            center: new google.maps.LatLng(55.997778, 37.190278),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
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
        google.maps.event.addListener(map, 'click', function(event) {
            console.log(event)
        });
        if (typeof options.coords != 'undefined') {
            var coords = convertCoords(options.coords);
            var flightPath = new google.maps.Polyline({
                path: coords,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            flightPath.setMap(map);
            directionsDisplay.setMap(map)
            var waypoints = [];

            $.each(coords, function (i, v) {
                var marker = new google.maps.Marker({
                    position: v,
                    label: 'label' + i,
                    map: map,
                    icon:'/images/icons/eseguito.png'
                });
              console.log(i);
                waypoints.push({
                    location: v,
                    stopover: true
                });
            })
            map.setCenter(start)
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
                window.alert('Errore Google Maps: ' + status);
            }
        });
    }

        var convertCoords = function (coords) {
            var crd = [];
            //    debugger;
            $.each(coords, function (i, v) {
                var latLng = new google.maps.LatLng(v.lat, v.lng);
                crd.push(latLng)
            })
            return crd;
        }

})(jQuery);