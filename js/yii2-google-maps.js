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

        if (options.onLoadMap) {
            options.onLoadMap(map);
        }
        var directionsDisplay = new google.maps.DirectionsRenderer({
            map: map
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
            var waypoints = [];
            var start = coords.shift();
            var end = coords.pop();
            $.each(coords, function (i, v) {
                waypoints.push({
                    location: v,
                    stopover: true
                });
            })
        }
       /* var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
        directionsService.route({
            origin: partenza.LatLang,
            destination: arrivo.LatLang,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Errore Google Maps: ' + status);
            }
        });*/
        /**
         * Выбрать местоположение, на входе объект у которго есть geometry
         * @param {Object} item
         */
        var selectLocation = function (item) {
            if (!item.geometry) {
                return;
            }
            //  debugger;
            var bounds = item.geometry.viewport ? item.geometry.viewport : item.geometry.bounds;
            var center = null;
            if (bounds) {
                map.fitBounds(new google.maps.LatLngBounds(bounds.getSouthWest(), bounds.getNorthEast()));
            }
            if (item.geometry.location) {
                center = item.geometry.location;
            }
            else if (bounds) {
                var lat = bounds.getSouthWest().lat() + ((bounds.getNorthEast().lat() - bounds.getSouthWest().lat()) / 2);
                var lng = bounds.getSouthWest().lng() + ((bounds.getNorthEast().lng() - bounds.getSouthWest().lng()) / 2);
                center = new google.maps.LatLng(lat, lng);
            }
            if (center) {
                map.setCenter(center);
                createMarker(center);
                setLatLngAttributes(center);
            }
        };

        // валидация адреса, если не найдены координаты
        // испльзуется событие из ActiveForm
        if ($(options.address).parents('form').length) {
            var $form = $(options.address).parents('form');
            $form.on('afterValidateAttribute', function (e, attribute, messages) {
                if (attribute.input == options.address && !$(options.latitude).val() && !$(options.longitude).val() && !messages.length) {
                    // не найдены координаты
                    messages.push(options.addressNotFound);
                    e.preventDefault();
                }
            });
        }
        google.maps.event.addListener(map, 'idle', function () {
            google.maps.event.trigger(map, 'resize');
        });

        // автокомплит для поиска местонахождения
        //  debugger;
        if (typeof options.address !== 'undefined' && $(options.address).length > 0) {
//debugger;
            var autocomplete = new google.maps.places.Autocomplete($(options.address).get(0));

            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace();
                if (!place) {
                    return;
                }
                selectLocation(place);
            });
        }
        var defaults = {
            'lat': $(options.latitude).val(),
            'lng': $(options.longitude).val()
        };
        if (defaults.lat && defaults.lng) {

            var center = new google.maps.LatLng(defaults.lat, defaults.lng);
            map.setCenter(center);

            createMarker(center);
            setLatLngAttributes(center);

        }

    };
    var convertCoords = function (coords) {
        var crd = new Array();
        $.each(coords, function (i, v) {
            var latLng = new google.maps.LatLng(coords.lat, coords.lng);
            crd.push(latLng)
        })
        return crd;
    }
})(jQuery);