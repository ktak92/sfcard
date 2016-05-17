'use strict';

/** 
    Main Application Module and configuration
**/

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
        .icon("communication", "./assets/svg/ic_message_black_24px.svg", 24)
        .icon("watch", "./assets/svg/ic_watch_later_white_24px.svg", 12)
        .icon("list", "./assets/svg/ic_view_list_black_24px.svg", 12)

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
    self.selectedCards = [];

    /** 
        Shows a dialog to add a new list 
    **/
    self.addCardList = function() {
        cardListsService.showAddDialog()
            .then(function(name) {
                self.selectCardList(name);
                $mdSidenav('cardListsBar').close();
            });
    };

    /**
        Removes an existing list
    **/
    self.removeList = function(cList) {
        cardListsService.remove(self.selectedCardList);
        self.selectedCardList = cardListsService.cardLists[0];
        if (!self.selectedCardList) {
           self.addCardList();
        }
    };

    /**
        Shows a dialog to add a new card 
    **/
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

    /**
        Removes an existing card
    **/
    self.removeCardFromList = function(term) {
        if (self.selectedCardList) {
            self.selectedCardList.cards
        }
    }

    /**
        Toggles the side card lists bar
    **/
    self.toggleSideBar = function(id) {
        if (id) {
            $mdSidenav('cardListsBar').toggle();
        }
    }

    /**
        Sets the current card list to show
    **/
    self.selectCardList = function(cList) {
        self.selectedCardList = cList;
        $mdSidenav('cardListsBar').close();
    }

    /**
        Toggles the checkbox used to remove cards
    **/    
    self.toggleCardCheckbox = function(item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        } else {
            list.push(item);
        }
    };

    /**
        Checks if the card is already selected
    **/
    self.isCardChecked = function(item, list) {
        return list.indexOf(item) > -1;
    };

    /** 
        Check indeterimnate state for checkbox
    **/
    self.isIndeterminate = function() {
        return (self.selectedCards.length !== 0 &&
            self.selectedCards.length !== self.selectedCardList.cards.length);
    };

    /**
        Checks if all cards are selected for removal
    **/
    self.isAllChecked = function() {
        return self.selectedCards.length === self.selectedCardList.cards.length;
    };

    /**
        Toggles all selection of cards
    **/
    self.toggleAll = function() {
        if (self.isAllChecked()) {
            self.selectedCards = [];
        } else {
            self.selectedCards = self.selectedCardList.cards.slice(0);
        }
    };

    /**
        Removes cards that are selected
    **/
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

    /**
        Opens a dialog to show the definition of the card
    **/
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

    /**
        Starts the study dialog
    **/
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

    /**
        Initial seeding of data
    **/
    self.seed = function() {
        cardService.addCard('Monet', 'Oscar-Claude Monet was a founder of French Impressionist painting, and the most consistent and prolific practitioner of the movements philosophy of expressing ones perceptions before nature, especially as applied to plein-air landscape painting');
        cardService.addCard('Picasso', 'Pablo Ruiz y Picasso, also known as Pablo Picasso, was a Spanish painter, sculptor, printmaker, ceramicist, stage designer, poet and playwright who spent most of his adult life in France');
        cardService.addCard('Van Gogh', 'Vincent Willem van Gogh Dutch; was a Dutch post-Impressionist painter whose work had far-reaching influence on 20th-century art.');
        cardListsService.addList('Art History', ['Monet', 'Picasso', 'Van Gogh']);
        self.selectedCardList = self.clService.cardLists[0];
    }

    /**
        Selects the first active list or seed with data if no lists exists
    **/
    self.clService.load().
        then(function() {
            if (self.clService.cardLists.length) {
                self.selectedCardList = self.clService.cardLists[0];
                self.startStudy();
            } else {
                self.seed();
            }
        })
};