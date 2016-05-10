'use strict';

angular
    .module('sfcardApp', ['ngMaterial', 'LocalStorageModule', 'cardLists', 'cards', 'study'])
    .config(AppConfig)
    .controller('appController', ['$mdSidenav', '$mdDialog', '$mdToast', 'cardListsService', 'cardService', 'studyService', AppController]);


function AppConfig($mdThemingProvider, $mdIconProvider) {
    /**
     * angular material config
     */
    $mdIconProvider
        .defaultIconSet("./assets/svg/avatars.svg", 128)
        .icon("menu", "./assets/svg/menu.svg", 24)
        .icon("close", "./assets/svg/ic_close_white_24px.svg", 24)
        .icon("communication", "./assets/svg/ic_message_black_24px.svg", 24);

    $mdThemingProvider.theme('default')
        .primaryPalette('brown')
        .accentPalette('red');
};


/**
 * Main app controller 
 */
function AppController($mdSidenav, $mdDialog, $mdToast, cardListsService, cardService, studyService) {
    var self = this;

    self.clService = cardListsService;

    self.addCardList = function() {
        cardListsService.showAddDialog()
            .then(function(name) {
                self.selectCardList(name);
                $mdSidenav('cardListsBar').close();
            });
    };

    self.removeList = function(cList) {
        cardListsService.remove(self.selectedCardList);
        self.selectedCardList = cardListsService.cardLists[0];
    };

    self.addCard = function(ev) {
        cardService.showAddCardDialog()
            .then(function(term) {
                var list = self.selectedCardList;
                cardListsService.addCardToList(list, term);
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(term + ' was added to ' + list.name));
            });
    };

    self.removeCardFromList = function(term) {
        if (self.selectedCardList) {
            self.selectedCardList.cards
        }
    }

    self.toggleSideBar = function(id) {
        if (id) {
            $mdSidenav('cardListsBar').toggle();
        }
    }

    self.selectCardList = function(cList) {
        self.selectedCardList = cList;
        $mdSidenav('cardListsBar').close();
    }

    self.selectedCards = [];
    self.toggle = function(item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        } else {
            list.push(item);
        }
    };
    self.exists = function(item, list) {
        return list.indexOf(item) > -1;
    };
    self.isIndeterminate = function() {
        return (self.selectedCards.length !== 0 &&
            self.selectedCards.length !== self.selectedCardList.cards.length);
    };
    self.isChecked = function() {
        return self.selectedCards.length === self.selectedCardList.cards.length;
    };
    self.toggleAll = function() {
        if (self.isChecked()) {
            self.selectedCards = [];
        } else {
            self.selectedCards = self.selectedCardList.cards.slice(0);
        }
    };

    self.removeCards = function() {
        if (self.selectedCards) {
            angular.forEach(self.selectedCards, function(term) {
                cardListsService.removeCardFromList(self.selectedCardList, term);
            });
            $mdToast.show(
                $mdToast.simple()
                .textContent('Cards Removed from list')
                );
        }
    }

    self.quickDefinition = function(term) {
        var definition = cardService.cards[term];
        $mdDialog.show(
            $mdDialog.alert()
            .title(term)
            .textContent(definition)
            .ok('Close')
            .targetEvent(event)
        );
    }

    self.startStudy = function(ev) {
        var list = self.selectedCardList;
        if (!list) {
            throw new Error('study: Missing list to start');
        }
        if (!list.cards || list.cards.length == 0) {
            throw new Error('study: No cards in this list')
        }
        studyService.showStudyDialog(ev, list);
    }

    // // uncomment to start study session
    // self.clService.load().
    // then(function() {
    //     self.selectedCardList = self.clService.cardLists[0];
    //     self.startStudy();
    // })
};