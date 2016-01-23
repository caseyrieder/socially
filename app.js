Parties = new Mongo.Collection("parties");

if (Meteor.isClient) {
	angular.module('socially', ['angular-meteor']);

	angular.module('socially').directive('partiesList', function() {
		return {
			restrict: 'E',
			templateUrl: 'parties-list.html'
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
}