'use strict';
angular
    .module('cardLists', ['ngMaterial', 'LocalStorageModule'])
    .service('cardListsService', ['$rootScope', '$q', '$mdDialog', '$mdToast', 'localStorageService', cardListsService])

/**
 * [CardService description]
 * @param {[type]} $q                  [description]
 * @param {[type]} localStorageService [description]
 */
function cardListsService($rootScope, $q, $mdDialog, $mdToast, localStorageService) {
    var self = this;

    self.cardLists = [];

    self.load = function() {
        return $q.when(localStorageService.get('cardLists'))
            .then(function(data) {
                console.log('cardList loaded:', data);
                self.cardLists = data || [];
            })
            .catch(function(err) {
                throw new Error('cardLists load:' + err.message);
            });
    };

    self.remove = function(cList) {
        angular.forEach(self.cardLists, function(item, index){
            if(item == cList) {
                self.cardLists.splice(index,1);
                self.save();
            }
        });
    };

    self.save = function() {
        localStorageService.set('cardLists', self.cardLists);
    };

    self.addList = function(name, cards) {
        if (!name) {
            throw new Error('save: Missing list name');
        }
        if (cards && !Array.isArray(cards)) {
            throw new Error('save: cards have to be an array');
        }
        var currentLists = localStorageService.get('cardLists') || [];
        var newList = {
            name: name,
            cards: cards || []
        };
        currentLists.push(newList);
        self.cardLists = currentLists;
        self.save();
        return newList;
    };

    self.showAddDialog = function(ev) {
        var confirm = $mdDialog.prompt()
            .title('New Card List')
            .textContent('What do you want to name this card list?')
            .placeholder('Art History')
            .targetEvent(ev)
            .ok('Create')
            .cancel('Cancel');

        return $mdDialog.show(confirm)
            .then(self.addList);
    };

    self.load();

};