'use strict';
angular
    .module('study', ['ngMaterial', 'cards', 'LocalStorageModule', 'gajus.swing'])
    .service('studyService', ['$rootScope', '$q', '$mdDialog', '$mdToast', 'localStorageService', studyService])
    .controller('studyDialogController', ['$scope', '$mdDialog', '$mdToast', 'cardService', 'cardListsService', 'studyService', 'list', studyDialogController])

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
        })
        .then(function(wrongs) {
            $mdDialog.show(
                $mdDialog.confirm()
                .title('Study Again?')
                .ok('Study')
                .cancel('Done')
            ).then(function() {
                self.showStudyDialog(ev, list);
            });
        });
    }
}


function studyDialogController($scope, $mdDialog, $mdToast, cardService, cardListsService, studyService, list) {
    $mdToast.show(
        $mdToast.simple()
        .textContent('Drag the cards to the Left or Right')
        .position('top right')
        .hideDelay(5000)
    );
    $scope.listName = list.name;
    $scope.cards = [];
    $scope.wrongStack = [];
    $scope.correctStack = [];
    angular.forEach(list.cards, function(term) {
        var definition = cardService.cards[term];
        if (definition) {
            $scope.cards.push({
                term: term,
                definition: definition
            });
        } else {
            //sync the cards if the term definition doesn't exist
            cardService.remove(term);
        }
    });

    $scope.throwout = function(evName, evObj, card) {
        var cardElem = angular.element(evObj.target);
        if (evObj.throwDirection == -1) { //left
            cardElem.addClass('correct');
            $scope.correctStack.push(card);
        } else {
            cardElem.addClass('wrong');
            $scope.wrongStack.push(card);
        }
    }

    $scope.dragStart = function(evName, evObj) {
        var cardElem = angular.element(evObj.target);
    }

    $scope.dragEnd = function(evName, evObj) {
        var cardElem = angular.element(evObj.target);
        if (cardElem.hasClass('last-card')) {
            $scope.hide($scope.wrongStack);
        }
    }

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
};