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
        $this->js[] = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&sensor=true&key=' . \Yii::$app->params['googleMapApiKey'];
    }
}
