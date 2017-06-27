<?php

namespace stesi\googlemaps;

use Yii;
use yii\base\Widget;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\helpers\Json;

/**
 * Class GoogleMapDirectionWidget
 * @package stesi\googlemaps
 */
class GoogleMapShowMapWidget extends Widget
{
    public $latitude;

    public $longitude;

    /**
     * @var array options for map wrapper div
     */
    public $wrapperOptions = [];

    /**
     * @var array options for attribute text input
     */
    public $textOptions = ['class' => 'form-control'];

    public $defaultMarkerIcon;

    /**
     * @var array JavaScript options
     */
    public $jsOptions = [];

    /**
     * @var callable function for custom map render
     */
    public $renderWidgetMap;

    /**
     * @var string Google API Key for Google Maps
     */
    public $googleMapApiKey;

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();
        $this->id = uniqid('map_');
        $defaultMarker = !empty($this->defaultMarkerIcon) ? ['defaultMarkerIcon' => $this->defaultMarkerIcon] : [];
        $this->jsOptions = ArrayHelper::merge($this->jsOptions, [
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
        ], $defaultMarker);
    }

    /**
     * Run widget
     */
    public function run()
    {
        if (!isset($this->wrapperOptions['id'])) {
            $this->wrapperOptions['id'] = $this->id;
        }

        if (!isset($this->wrapperOptions['style'])) {
            $this->wrapperOptions['style'] = 'width: 100%; height: 500px;';
        }

        $this->registerAssets();

        $mapHtml = Html::tag('div', '', $this->wrapperOptions);

        return $mapHtml;
    }

    public function registerAssets()
    {
        $view = $this->getView();
        GoogleMapAsset::register($view);
        $view->registerJs('$("#' . $this->wrapperOptions['id'] . '").showMap(' . Json::encode($this->jsOptions) . ');');
    }
}
