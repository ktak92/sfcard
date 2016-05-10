'use strict';
angular
    .module('study', ['ngMaterial', 'cards', 'LocalStorageModule', 'gajus.swing'])
    .service('studyService', ['$rootScope', '$q', '$mdDialog', '$mdToast', 'localStorageService', studyService])
    .controller('studyDialogController', ['$scope', '$mdDialog', '$mdToast', 'cardService', 'list', studyDialogController])

function studyService($rootScope, $q, $mdDialog, $mdToast, localStorageService) {
    var self = this;
    self.showStudyDialog = function(ev, list) {
        return $mdDialog.show({
            controller: 'studyDialogController',
            templateUrl: './src/study/view/studyDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                list: list
            }
        });
    }
}


function studyDialogController($scope, $mdDialog, $mdToast, cardService, list) {
    $scope.listName = list.name;
    $scope.cards = [];
    angular.forEach(list.cards, function(term) {
        var definition = cardService.cards[term];
        if (definition) {
            $scope.cards.push({
                term: term,
                definition: definition
            });
        } else {
            cardService.remove(term);

        }
    });

    $scope.flip = function() {
        $scope.flip = true;
    }

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
};