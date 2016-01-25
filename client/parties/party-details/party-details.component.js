// Define the party details component
angular.module('socially').directive('partyDetails', function() {
	return {
		restrict: 'E',
		templateUrl: 'client/parties/party-details/party-details.html',
		controllerAs: 'partyDetails',
		controller: function($scope, $stateParams, $reactive) {
			$reactive(this).attach($scope);
			//Find the appropriate party
			this.helpers({
				party: () => {
					return Parties.findOne({_id: $stateParams.partyId});
				}
			});
			//Save/update the name & description of the current party
			this.save = () => {
				Parties.update({_id: $stateParams.partyId}, {
					$set: {
						name: this.party.name,
						description: this.party.description
					}
				}, (error) => {
					if (error) {
						console.log("Oops, unable to update the party...");
					} else {
						console.log("Done!")
					}
				});
			};

		}
	}
});