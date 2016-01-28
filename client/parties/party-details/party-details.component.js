// Define the party details component
angular.module('socially').directive('partyDetails', function() {
	return {
		restrict: 'E',
		templateUrl: 'client/parties/party-details/party-details.html',
		controllerAs: 'partyDetails',
		controller: function($scope, $stateParams, $reactive) {
			$reactive(this).attach($scope);
			//Subscribe to 'parties' AND 'users' publications
			this.suibscribe('parties');
			this.subscribe('users');
			//Define helper fxns for details component
			this.helpers({
				//Find selected party
				party: () => {
					return Parties.findOne({_id: $stateParams.partyId});
				},
				//Find all accessible users (their emails & profiles)
				users: () => {
					return Meteor.users.find({});
				}
			});
			//Save/update the name & description of the current party
			this.save = () => {
				Parties.update({_id: $stateParams.partyId}, {
					$set: {
						name: this.party.name,
						description: this.party.description,
						'public': this.party.public
					}
				}, (error) => {
					if (error) {
						console.log("Oops, unable to update the party...");
					} else {
						console.log("Done!")
					}
				});
			};
			//Invite user to a private party
			this.invite = (user) => {
				//Call the 'invite' method defined in the parties model
				Meteor.call('invite', this.party._id, user._id, (error) => {
					if (error) {
						console.log('Oops, unable to invite!');
					} else {
						console.log('Invited!');
					}
				});
			};
		}
	}
});