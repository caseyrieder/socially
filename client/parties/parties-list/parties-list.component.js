//Define the parties list component
angular.module('socially').directive('partiesList', function() {
	return {
		restrict: 'E',
		templateUrl: 'client/parties/parties-list/parties-list.html',
		controllerAs: 'partiesList',
		controller: function($scope, $reactive) {
			$reactive(this).attach($scope);
			// Declare newParty variable
			this.newParty = {};
			//Subscribe to 'parties' publication
			this.subscribe('parties');
			// List parties from Collection
			this.helpers({
				parties: () => {
					return Parties.find({});
				}
			});
			// Insert party into Collection
			this.addParty = () => {
				this.newParty.owner = Meteor.user()._id;
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