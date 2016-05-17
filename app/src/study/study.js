'use strict';

/**
    Module for study mode related
**/

angular
    .module('study', ['ngMaterial', 'cards', 'LocalStorageModule', 'gajus.swing'])
    .service('studyService', ['$rootScope', '$q', '$mdDialog', '$mdToast', 'localStorageService', studyService])
    .controller('studyDialogController', ['$scope', '$mdDialog', '$mdToast', 'cardService', 'cardListsService', 'studyService', 'list', studyDialogController])
    .controller('restudyDialogController', ['$scope', '$mdDialog', 'wrongCards', restudyDialogController])

function studyService($rootScope, $q, $mdDialog, $mdToast, localStorageService) {
    var self = this;

    /**
        Starts the stud mode
    **/
    self.showStudyDialog = function(ev, list, originalList) {
        if (!list.cards.length) {
            throw new Error('study: No cards found for this list.')
        }
        if (!originalList) {
            originalList = list;
        }
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
            .then(function(wrongstack) {
                self.showRestudyDialog(ev, wrongstack, originalList);
            });
    }

    self.showRestudyDialog = function(ev, wrongCards, originalList) {
        return $mdDialog.show({
                controller: 'restudyDialogController',
                templateUrl: './src/study/view/restudyDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    wrongCards: wrongCards
                }
            })
            .then(function(withWrongStack) {
                var newTerms = [];
                if (withWrongStack) {
                    angular.forEach(wrongCards, function(card) {
                        newTerms.push(card.term);
                    })
                    var list = {
                        name: originalList.name,
                        cards: newTerms
                    };
                } else {
                    list = originalList;
                }
                self.showStudyDialog(ev, list, originalList);
            });
    }
}


function studyDialogController($scope, $mdDialog, $mdToast, cardService, cardListsService, studyService, list) {
    $scope.listName = list.name;
    $scope.cards = [];
    $scope.wrongStack = [];
    $scope.correctStack = [];
    /**
        Options for determining the drag distance for cards
    **/
    $scope.swingOptions = {
        minThrowOutDistance: 460
    };

    (function initializeStudy() {
        showHint();
        setupCard();
    })();

    /**
        Show drag hint toaster in the begining
    **/
    function showHint() {
        $mdToast.show(
            $mdToast.simple()
            .textContent('Drag the cards to the Left or Right')
            .position('top right')
            .hideDelay(5000)
        );
    }

    /**
        Creates a card list with the definition mapped
        Removes the item from the list if definition isn't found
    **/
    function setupCard() {
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
    }

    /**
        Handler for throwing out cards
    **/
    $scope.throwout = function(evName, evObj, card) {
        var cardElem = angular.element(evObj.target);
        if (evObj.throwDirection == -1) { //left
            cardElem.addClass('correct');
            $scope.correctStack.push(card);
        } else {
            cardElem.addClass('wrong');
            $scope.wrongStack.push(card);
        }
        if (cardElem.hasClass('last-card')) {
            $scope.hide($scope.wrongStack);
        }
    }

    /**
        End the study mode
    **/
    $scope.hide = function(wrongStack) {
        $mdDialog.hide(wrongStack);
    };

    /**
        Close the study mode dialog
    **/
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
};

function restudyDialogController($scope, $mdDialog, wrongCards) {
    $scope.showWrongCards = wrongCards.length > 0;
    $scope.hide = function() {
        $mdDialog.hide($scope.withWrongStack);
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}