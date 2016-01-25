//Declare Parties table
Parties = new Mongo.Collection("parties");

if (Meteor.isClient) {

	//Add ui-router & angular-meteor dependencies
	angular.module('socially', [
		'angular-meteor',
		'ui.router'
	]);

	// Define router for parties list & party details
	angular.module('socially').config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
		$locationProvider.html5Mode(true);

		$stateProvider
			.state('parties', {
				url: '/parties',
				template: '<parties-list></parties-list>'
			})
			.state('partyDetails', {
				url: '/parties/:partyId',
				template: '<party-details></party-details>'
			});

		$urlRouterProvider.otherwise("/parties");
	});

	//Define the parties list component
	angular.module('socially').directive('partiesList', function() {
		return {
			restrict: 'E',
			templateUrl: 'parties-list.html',
			controllerAs: 'partiesList',
			controller: function($scope, $reactive) {
				$reactive(this).attach($scope);
				// Declare newParty variable
				this.newParty = {};
				// List parties from Collection
				this.helpers({
					parties: () => {
						return Parties.find({});
					}
				});
				// Insert party into Collection
				this.addParty = () => {
					Parties.insert(this.newParty);
					this.newParty = {};
				};
				// Delete party from Collection
				this.removeParty = (party) => {
					Parties.remove({_id: party._id});
				};
			}
		}
	});

	// Define the party details component
	angular.module('socially').directive('partyDetails', function() {
		return {
			restrict: 'E',
			templateUrl: 'party-details.html',
			controllerAs: 'partyDetails',
			controller: function($scope, $stateParams) {
				this.partyId = $stateParams.partyId;
			}
		}
	});
}