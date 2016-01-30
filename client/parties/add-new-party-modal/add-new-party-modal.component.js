angular.module('socially').directive('addNewPartyModal', function() {
	return {
		restrict: 'E',
		templateUrl: 'client/parties/add-new-party-modal/add-new-party-modal.html',
		controllerAs: 'addNewPartyModal',
		controller: function($scope, $stateParams, $reactive) {
			$reactive(this).attach($scope);
			// Declare add party helper functions
			this.helpers({
				// Determine is user is logged in
				isLoggedIn: () => {
					return Meteor.userId() !== null;
				}
			});
			// Declare newParty variable
			this.newParty = {};
			// Add the new party
			this.addNewParty = () => {
				this.newParty.owner = Meteor.userId();
				Parties.insert(this.newParty)
				this.newParty = {};
				$scope.$close();
			};
		}
	}
});