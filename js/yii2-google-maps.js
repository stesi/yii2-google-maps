(function ($, window, document, undefined) {
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
    // $.fn.directionMap = function (options) {
    //     var self = this;
    //     var map;
    //
    //     console.log(options);
    //
    //     map = new google.maps.Map($(self).get(0), options.mapOptions);
    //
    //     google.maps.event.addListener(map, 'idle', function () {
    //         google.maps.event.trigger(map, 'resize');
    //     });
    //     // if (options.onLoadMap) {
    //     //     options.onLoadMap(map);
    //     // }
    //     var directionsDisplay = new google.maps.DirectionsRenderer({
    //         map: map
    //     });
    //     // google.maps.event.addListener(map, 'click', function (event) {
    //     //     console.log(event)
    //     // });
    //
    //     var coords = [];
    //     var waypoints = [];
    //     $.each(options.coords, function (i, v) {
    //         var latLng = new google.maps.LatLng(v.lat, v.lng);
    //         coords.push(latLng);
    //         // var MarkerOpts = {
    //         //     position: latLng,
    //         //     label: v.label,
    //         //     map: map
    //         // };
    //         // if (typeof options.defaultMarkerIcon !== 'undefined') {
    //         //     MarkerOpts['icon'] = options.defaultMarkerIcon;
    //         // }
    //         //var marker = new google.maps.Marker(MarkerOpts);
    //         waypoints.push({
    //             location: latLng,
    //             stopover: true
    //         });
    //
    //     });
    //     // if (options.showPolyline) {
    //     //     var flightPath = new google.maps.Polyline({
    //     //         path: coords,
    //     //         geodesic: true,
    //     //         strokeColor: '#FF0000',
    //     //         strokeOpacity: 1.0,
    //     //         strokeWeight: 2
    //     //     });
    //     //     flightPath.setMap(map);
    //     // }
    //     directionsDisplay.setMap(map);
    //     //map.setCenter(start);
    //     var start = coords.shift();
    //     var end = coords.pop();
    //
    //     // debugger;
    //     var directionsService = new google.maps.DirectionsService;
    //     directionsService.route({
    //         origin: start,
    //         destination: end,
    //         waypoints: waypoints,
    //         travelMode: google.maps.TravelMode.DRIVING
    //     }, function (response, status) {
    //         if (status === google.maps.DirectionsStatus.OK) {
    //             directionsDisplay.setDirections(response);
    //         } else {
    //             window.alert('Google Maps error: ' + status);
    //         }
    //     });
    // };

    function GoogleMaps(mapDiv, options) {
        this.maps = {
            Map: function (mapDiv, options) {
                return new google.maps.Map(mapDiv, options);
            },

            LatLng: function (lat, lng) {
                return new google.maps.LatLng(lat, lng);
            },

            DirectionsService: function (options) {
                return new google.maps.DirectionsService;
            },

            Marker: function (options) {
                return new google.maps.Marker(options);
            },

            InfoWindow: function (options) {
                return new google.maps.InfoWindow(options);
            },

            DirectionsRenderer: function (options) {
                return new google.maps.DirectionsRenderer(options);
            }
        };

        this.map = this.maps.Map(mapDiv, options);

        this.directionsRenderer = [];

        this.routeDirections = function (options) {
            var self = this;
            var map = self.map;

            var directionsService = self.maps.DirectionsService();

            var coords = [];
            var waypoints = [];
            $.each(options.coords, function (coordIndex, coord) {
                var latLng = self.maps.LatLng(coord.lat, coord.lng);
                coords.push(latLng);
                waypoints.push({
                    location: latLng,
                    stopover: true
                });

                var markerOptions = {
                    position: latLng,
                    label: coord.markerOptions,
                    map: map
                };
                var marker = self.maps.Marker(markerOptions);

                if (coord.infoWindowOptions) {
                    var infoWindow = self.maps.InfoWindow(coord.infoWindowOptions);
                    marker.addListener('click', function () {
                        infoWindow.open(map, marker);
                    });
                }
            });

            var start = coords.shift();
            var end = coords.pop();

            directionsService.route({
                origin: start,
                destination: end,
                waypoints: waypoints,
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    var renderOptions = $.extend({
                        polylineOptions: {
                            strokeColor: "blue",
                            strokeOpacity: 0.5,
                            strokeWeight: 2
                        }
                    }, options.renderOptions);
                    var directionsDisplay = self.maps.DirectionsRenderer(renderOptions);
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap(map);
                    if (options.directionName !== undefined) {
                        self.directionsRenderer[options.directionName] = directionsDisplay;
                    }
                } else {
                    // window.alert('Directions request failed due to ' + status);
                }
            });
        };

        this.showDirections = function (directionName) {
            var self = this;
            var map = self.map;
            var renderer = self.directionsRenderer;
            if (renderer[directionName] !== undefined) {
                renderer[directionName].setMap(map);
            }
        };

        this.hideDirections = function (directionName) {
            var self = this;
            var renderer = self.directionsRenderer;
            if (renderer[directionName] !== undefined) {
                renderer[directionName].setMap(null);
            }
        };
    }

    $.fn.googleMaps = function (options) {
        var self = this;
        var $self = $(self);
        var dataKey = "stesi-google-maps";

        if ($self.data(dataKey) === undefined) {
            var gMapOptions = $.extend({}, options);
            var gMap = new GoogleMaps($self.get(0), gMapOptions);
            $self.data(dataKey, gMap);
        }

        var gMaps = $self.data(dataKey);

        if (options === undefined) {
            return gMaps;
        }

        if (options === 'direction') {
            gMaps.routeDirections(arguments[1]);
        }

        if (options === 'showDirection') {
            gMaps.showDirections(arguments[1]);
        }

        if (options === 'hideDirection') {
            gMaps.hideDirections(arguments[1]);
        }

        return self;
    };

    // $.fn.googleMapsDirections = function (options) {
    //     var self = this;
    //     var $self = $(self);
    //
    //     var map = new google.maps.Map($self.get(0), options.mapOptions);
    //     $self.trigger('stesi.google.map.init', [map]);
    //
    //     // google.maps.event.addListener(map, 'idle', function () {
    //     //     google.maps.event.trigger(map, 'resize');
    //     // });
    //
    //     var mapDirections = {
    //         map: map,
    //         directionsRenderer: [],
    //
    //         routeDirections: function (directionName, options) {
    //             var self = this;
    //             var map = self.map;
    //             var directionsService = new google.maps.DirectionsService;
    //             // var directionsDisplay = new google.maps.DirectionsRenderer;
    //             // directionsDisplay.setMap(self.map);
    //
    //             var coords = [];
    //             var waypoints = [];
    //             $.each(options.coords, function (coordIndex, coord) {
    //                 var latLng = new google.maps.LatLng(coord.lat, coord.lng);
    //                 coords.push(latLng);
    //                 waypoints.push({
    //                     location: latLng,
    //                     stopover: true
    //                 });
    //
    //                 var markerOptions = {
    //                     position: latLng,
    //                     label: coord.markerOptions,
    //                     map: map
    //                 };
    //                 var marker = new google.maps.Marker(markerOptions);
    //
    //                 if (coord.infoWindowOptions) {
    //                     var infoWindow = new google.maps.InfoWindow(coord.infoWindowOptions);
    //                     marker.addListener('click', function () {
    //                         infoWindow.open(map, marker);
    //                     });
    //                 }
    //             });
    //             // directionsDisplay.setMap(map);
    //             // map.setCenter(start);
    //             var start = coords.shift();
    //             var end = coords.pop();
    //
    //             directionsService.route({
    //                 origin: start,
    //                 destination: end,
    //                 waypoints: waypoints,
    //                 travelMode: google.maps.TravelMode.DRIVING
    //             }, function (response, status) {
    //                 if (status === google.maps.DirectionsStatus.OK) {
    //                     var renderOptions = $.extend({
    //                         polylineOptions: {
    //                             strokeColor: "blue",
    //                             strokeOpacity: 0.5,
    //                             strokeWeight: 2
    //                         }
    //                     }, options.renderOptions);
    //                     var directionsDisplay = new google.maps.DirectionsRenderer(renderOptions);
    //                     directionsDisplay.setDirections(response);
    //                     directionsDisplay.setMap(map);
    //                     self.directionsRenderer[directionName] = directionsDisplay;
    //                 } else {
    //                     // window.alert('Directions request failed due to ' + status);
    //                 }
    //             });
    //         },
    //
    //         showDirections: function (directionName) {
    //             var renderer = this.directionsRenderer;
    //             if (renderer[directionName] !== undefined) {
    //                 renderer[directionName].setMap(map);
    //             }
    //         },
    //
    //         hideDirections: function (directionName) {
    //             var renderer = this.directionsRenderer;
    //             if (renderer[directionName] !== undefined) {
    //                 renderer[directionName].setMap(null);
    //             }
    //         }
    //     };
    //
    //     return mapDirections;
    // };

}(jQuery, window, document));
