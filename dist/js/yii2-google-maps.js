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

            Polyline: function (options) {
                return new google.maps.Polyline(options);
            },

            Point: function (x, y) {
                return new google.maps.Point(x, y);
            }
        };

        this.map = this.maps.Map(mapDiv, options);
        this.getMap = function () {
            return this.map;
        };

        this.$map = $(mapDiv);

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
                            self.$map.trigger("stesi.maps.infowindow.open", [infoWindow]);
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
                    if (options.directionName !== undefined) {
                        self.directionsRenderer[options.directionName] = directionsDisplay;
                    }
                    if (options.show !== false) {
                        directionsDisplay.setMap(map);
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

        this.polylines = [];

        this.polyline = function (options) {
            var self = this;
            var lineOptions = $.extend({
                path: {},
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            }, options.lineOptions);

            var coords = [];
            $.each(options.coords, function (coordIndex, coord) {
                var latLng = self.maps.LatLng(coord.lat, coord.lng);
                coords.push(latLng);
            });
            lineOptions.path = coords;

            self.polylines[options.lineName] = self.maps.Polyline(lineOptions);
        };

        this.showPolyline = function (lineName) {
            var self = this;
            var map = self.map;
            var lines = self.polylines;
            if (lines[lineName] !== undefined) {
                lines[lineName].setMap(map);
            }
        };

        this.hidePolyline = function (lineName) {
            var self = this;
            var map = self.map;
            var lines = self.polylines;
            if (lines[lineName] !== undefined) {
                lines[lineName].setMap(null);
            }
        };

        this.marker = function (options) {
            var self = this;
            var map = self.map;

            var latLng = self.maps.LatLng(options.lat, options.lng);
            var markerOptions = $.extend({
                labelClass: "google-map-marker-center-label",
                labelStyle: {}
            }, options.markerOptions);

            if (options.markerOptions.labelContent) {
                markerOptions.labelContent = options.markerOptions.labelContent;
                if (markerOptions.labelClass === "google-map-marker-center-label") {
                    markerOptions.labelContent = "<div>" + markerOptions.labelContent + "</div>";
                }
            } else {
                markerOptions.labelVisible = false;
            }

            markerOptions.map = map;
            markerOptions.position = latLng;

            if (options.markerOptions.labelAnchor) {
                markerOptions.labelAnchor = self.maps.Point(options.markerOptions.labelAnchor[0], options.markerOptions.labelAnchor[1]);
            }

            var marker = self.maps.MarkerWithLabel(markerOptions);

            if (options.infoWindowOptions) {
                var infoWindow = self.maps.InfoWindow(options.infoWindowOptions);
                marker.addListener('click', function () {
                    infoWindow.open(map, marker);
                    self.$map.trigger("stesi.maps.infowindow.open", [infoWindow]);
                });
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

        if (options === "map") {
            return gMaps.getMap();
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

        if (options === 'polyline') {
            gMaps.polyline(arguments[1]);
        }

        if (options === 'showPolyline') {
            gMaps.showPolyline(arguments[1]);
        }

        if (options === 'hidePolyline') {
            gMaps.hidePolyline(arguments[1]);
        }

        if (options === 'marker') {
            gMaps.marker(arguments[1]);
        }

        return self;
    };

}(jQuery, window, document));
