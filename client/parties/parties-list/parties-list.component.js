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
			//Add pagination default params
			this.perPage = 3;
			this.page = 1;
			this.sort = {
				name: 1
			};
			//Subscribe to 'parties' publication, include subscription params
			this.subscribe('parties', () => {
				return [
					{
						limit: parseInt(this.perPage),
						skip: parseInt((this.getReactively('page') - 1) * this.perPage),
						sort: this.getReactively('sort')
					}
				]
			});
			// List parties from Collection
			this.helpers({
				parties: () => {
					return Parties.find({}, { sort: this.getReactively('sort') });
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