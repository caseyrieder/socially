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
			//Add pagination, sort/order, & search defaults
			this.perPage = 3;
			this.page = 1;
			this.sort = {
				name: 1
			};
			this.orderProperty = '1';
			this.searchText = '';
			//Subscribe to 'parties' publication, include subscription params
			this.subscribe('parties', () => {
				return [
					{
						limit: parseInt(this.perPage),
						skip: parseInt((this.getReactively('page') - 1) * this.perPage),
						sort: this.getReactively('sort')
					},
					this.getReactively('searchText')
				]
			});
			// Helper functions for this component
			this.helpers({
				// List parties from Collection
				parties: () => {
					return Parties.find({}, { sort: this.getReactively('sort') });
				},
				// Count total parties (from server/parties.js)
				partiesCount: () => {
					return Counts.get('numberOfParties');
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
			// Change page on pagination
			this.pageChanged = (newPage) => {
				this.page = newPage;
			};
			// Change sort value when order is changed
			this.updateSort = () => {
				this.sort = {
					name: parseInt(this.orderProperty)
				}
			};
		}
	}
});