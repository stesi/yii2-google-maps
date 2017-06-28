<?php

namespace stesi\googlemaps;

use yii\base\Widget;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\helpers\Json;
use yii\web\JsExpression;


/**
 * Class GoogleMapDirectionWidget
 * @package stesi\googlemaps
 */
class GoogleMapDirectionWidget extends Widget
{
    /**
     * @var array
     */
    public $coords;

    /**
     * @var array options for map wrapper div
     */
    public $wrapperOptions = [];

    public $showPoly = true;

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
        $this->jsOptions = ArrayHelper::merge($this->jsOptions, ['coords' => $this->coords], $defaultMarker, ['showPoly' => $this->showPoly]);
    }

    /**
     * @inheritdoc
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
        $view->registerJs('$("#' . $this->wrapperOptions['id'] . '").directionMap(' . Json::encode($this->jsOptions) . ');');
    }
}
