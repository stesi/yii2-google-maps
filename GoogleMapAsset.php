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
    public function init()
    {
        parent::init();
        $this->js[] = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&callback=google_maps_initialize&sensor=true&key=' . \Yii::$app->params['googleMapApiKey'];
    }

    /**
     * @inheritdoc
     */
    public function registerAssetFiles($view)
    {
        $view->registerJs(<<<'JS'
if (!window.google_maps_initialize) {
    window.google_maps_initialize = function() {
        $(document).trigger("google.maps.initialized");
    };
}
JS
            , \yii\web\View::POS_HEAD);

        parent::registerAssetFiles($view);
    }
}
