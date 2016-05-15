'use strict';
angular
    .module('cards', ['ngMaterial', 'LocalStorageModule'])
    .service('cardService', ['$q', '$mdDialog', '$mdToast', 'localStorageService', cardService])
    .controller('cardDialogController', ['$scope', '$mdDialog', '$mdToast', 'cardService', cardDialogController])

/**
 * [CardService description]
 * @param {[type]} $q                  [description]
 * @param {[type]} localStorageService [description]
 */
function cardService($q, $mdDialog, $mdToast, localStorageService) {
    var self = this;

    self.cards = {};

    self.loadAll = function() {
        return $q.when(localStorageService.get('cards'))
            .then(function(cards){
                self.cards = cards || {};
            })
            .catch(function(err) {
                throw new Error('cards loadAll:' + err.message);
            });
    };

    self.load = function(term) {
        return $q.when(localStorageService.get('cards'))
            .then(function(cards){
                if (!cards[term]) {
                    throw 'Missing term';
                }
                return cards[term];
            })
            .catch(function(err) {
                throw new Error('cards load:' + err.message);
            });
    };

    self.save = function() {
        localStorageService.set('cards', self.cards);
    };

    self.addCard = function(term, definition) {
        if (!term) {
            throw new Error('cards save: Missing term');
        }
        if (!definition) {
            throw new Error('cards save: Missing definition');
        }
        var currentCards = localStorageService.get('cards') || {};
        currentCards[term] = definition;
        localStorageService.set('cards', currentCards);
        self.cards = currentCards;
    };

    self.remove = function(term) {
        var found = self.cards[term];
        if (found) {
            delete self.cards[term];
            self.save();
        }
    };

    self.showAddCardDialog = function(ev) {
        return $mdDialog.show({
            controller: 'cardDialogController',
            templateUrl: './src/cards/view/addDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullScreen: true
        });
    };

    self.loadAll();
};


function cardDialogController($scope, $mdDialog, $mdToast, cardService) {
    $scope.addCard = function(cardList) {
        cardService.addCard($scope.term, $scope.definition);
        $mdDialog.hide($scope.term);
    };
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
};