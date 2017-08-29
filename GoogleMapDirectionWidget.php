<?php

namespace stesi\googlemaps;

use yii\base\Widget;
use yii\helpers\ArrayHelper;
use yii\helpers\Json;
use yii\web\JsExpression;

/**
 * Class GoogleMapDirectionWidget
 * @package stesi\googlemaps
 */
class GoogleMapDirectionWidget extends Widget
{
    const TRAVEL_MODE_DRIVING = 'DRIVING';
    const TRAVEL_MODE_BICYCLING = 'BICYCLING';
    const TRAVEL_MODE_TRANSIT = 'TRANSIT';
    const TRAVEL_MODE_WALKING = 'WALKING';

    const MAP_TYPE_HYBRID = 'google.maps.MapTypeId.HYBRID';
    const MAP_TYPE_ROADMAP = 'google.maps.MapTypeId.ROADMAP';
    const MAP_TYPE_SATELLITE = 'google.maps.MapTypeId.SATELLITE';
    const MAP_TYPE_TERRAIN = 'google.maps.MapTypeId.TERRAIN';

    /**
     * @var string
     */
    public $travelMode = self::TRAVEL_MODE_DRIVING;

    /**
     * @var array|null
     */
    public $transitOptions;

    /**
     * @var array|null
     */
    public $drivingOptions;

    public $unitSystem;

    /**
     * @var bool
     */
    public $optimizeWaypoints;

    /**
     * @var bool
     */
    public $provideRouteAlternatives;

    /**
     * @var bool
     */
    public $avoidHighways;

    /**
     * @var bool
     */
    public $avoidTolls;

    /**
     * @var string
     */
    public $region;


    /**
     * @var array JavaScript options
     */
    public $jsOptions = [];

    public $mapOptions = [];

    protected $script = '';

    /**
     * @var string
     */
    public $mapDiv;

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();

        $this->mapOptions = ArrayHelper::merge([
            'zoom' => 12,
            'mapTypeId' => self::MAP_TYPE_ROADMAP,
        ], $this->mapOptions);
        $this->mapOptions['mapTypeId'] = new JsExpression($this->mapOptions['mapTypeId']);

        $this->script .= 'var gMap = $("' . $this->mapDiv . '");';
        $this->script .= 'gMap.googleMaps(' . Json::encode($this->mapOptions) . ');';
    }

    public function direction($options)
    {
        $this->script .= 'gMap.googleMaps("direction", ' . Json::encode($options) . ');';
    }

    /**
     * @inheritdoc
     */
    public function run()
    {
        $view = $this->getView();
        GoogleMapAsset::register($view);

        $view->registerJs('$(document).one("google.maps.initialized", function () {' . $this->script . '});');
    }
}
