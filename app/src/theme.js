'use strict';

/**
    Configuration to override the theme color
**/

angular
    .module('sfcardApp')
    .config(themeConfig);


function themeConfig($mdThemingProvider, $mdIconProvider) {
    var customPrimary = {
        '50': '#60d2ff',
        '100': '#47cbff',
        '200': '#2dc4ff',
        '300': '#14bdff',
        '400': '#00b3f9',
        '500': '#00A1E0',
        '600': '#008fc6',
        '700': '#007cad',
        '800': '#006a93',
        '900': '#00587a',
        'A100': '#7adaff',
        'A200': '#93e1ff',
        'A400': '#ade8ff',
        'A700': '#004560',
        'contrastDefaultColor': 'light'
    };
    $mdThemingProvider
        .definePalette('customPrimary',
            customPrimary);
    $mdThemingProvider.theme('default')
        .primaryPalette('customPrimary')
}