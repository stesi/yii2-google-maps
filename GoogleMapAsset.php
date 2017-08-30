<?php

namespace stesi\googlemaps;

use yii\web\AssetBundle;

/**
 * Class GoogleMapDirectionAssets
 * @package stesi\googlemaps
 */
class GoogleMapAsset extends AssetBundle
{
    public $sourcePath = '@vendor/stesi/yii2-google-maps/dist';

    public $css = [
        'css/yii2-google-maps.css',
    ];

    public $js = [
        'js/marker-with-label.js',
        'js/yii2-google-maps.js',
    ];

    /**
     * @inheritdoc
     */
    public function registerAssetFiles($view)
    {
        $js = 'var apiUrl = "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&callback=google_maps_initialize&sensor=true&key=' . \Yii::$app->params['googleMapApiKey'] . '";';
        $js .= <<<'JS'
if (window.google && window.google.maps) {
    if (!window.google_maps_initialize) {
        $(document).trigger("google.maps.initialized");
    }
} else {
    if (!window.google_maps_initialize) {
        window.google_maps_initialize = function() {
            delete window.google_maps_initialize;
            $(document).trigger("google.maps.initialized");
        };
    }
    var s = document.createElement('script');
    s.src = apiUrl;
    document.body.appendChild(s);
}
JS;
        $view->registerJs($js);

        parent::registerAssetFiles($view);
    }
}
