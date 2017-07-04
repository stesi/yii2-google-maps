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

            MarkerWithLabel: function (options) {
                return new stesi.maps.MarkerWithLabel(options);
            },

            InfoWindow: function (options) {
                return new google.maps.InfoWindow(options);
            },

            DirectionsRenderer: function (options) {
                return new google.maps.DirectionsRenderer(options);
            },

            Point: function (x, y) {
                return new google.maps.Point(x, y);
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

                // var markerOptions = {
                //     position: latLng,
                //     label: coord.markerOptions,
                //     map: map
                // };
                // var marker = self.maps.Marker(markerOptions);
                // var markerOptions = {
                //     position: latLng,
                //     // label: coord.markerOptions,
                //     labelContent: "$425K 1313131313",
                //     labelClass: "google-map-marker-label",
                //     labelStyle: {},
                //     labelAnchor: self.maps.Point(50, 0),
                //     map: map
                // };
                if (coord.markerOptions) {
                    var markerOptions = $.extend({
                        labelClass: "google-map-marker-center-label",
                        labelStyle: {}
                    }, coord.markerOptions);

                    if (coord.markerOptions.labelContent) {
                        markerOptions.labelContent = coord.markerOptions.labelContent;
                        if (markerOptions.labelClass === "google-map-marker-center-label") {
                            markerOptions.labelContent = "<div>" + markerOptions.labelContent + "</div>";
                        }
                    } else {
                        markerOptions.labelVisible = false;
                    }

                    markerOptions.map = map;
                    markerOptions.position = latLng;

                    if (coord.markerOptions.labelAnchor) {
                        markerOptions.labelAnchor = self.maps.Point(coord.markerOptions.labelAnchor[0], coord.markerOptions.labelAnchor[1]);
                    }

                    var marker = self.maps.MarkerWithLabel(markerOptions);

                    if (coord.infoWindowOptions) {
                        var infoWindow = self.maps.InfoWindow(coord.infoWindowOptions);
                        marker.addListener('click', function () {
                            infoWindow.open(map, marker);
                        });
                    }
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

}(jQuery, window, document));
