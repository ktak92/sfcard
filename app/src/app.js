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
        .icon("close", "./assets/svg/ic_close_white_24px.svg", 24);

    $mdThemingProvider.theme('default')
        .primaryPalette('brown')
        .accentPalette('red');
};

function AppController($mdSidenav, $mdDialog, $mdToast, cardListsService, cardService, studyService) {
    var self = this;

    self.clService = cardListsService;

    self.addCardList = function() {
       cardListsService.showAddDialog()
        .then(function(name){
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
                if (self.selectedCardList) {
                    var listCards = self.selectedCardList.cards;
                    var listName = self.selectedCardList.name;
                    if (listCards.indexOf(term) === -1) {
                        self.selectedCardList.cards.push(term);
                        cardListsService.save();
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(term + ' was added to ' + listName));
                    }
                }
            });
    };

    self.toggleSideBar = function(id) {
        if (id) {
            $mdSidenav('cardListsBar').toggle();
        }
    }

    self.selectCardList = function(cList) {
        self.selectedCardList = cList;
        $mdSidenav('cardListsBar').close();
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

    // test code remove
    self.clService.load().
        then(function() {
            self.selectedCardList = self.clService.cardLists[0];
            self.startStudy();
        })
};