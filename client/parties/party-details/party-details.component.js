// Define the party details component
angular.module('socially').directive('partyDetails', function() {
	return {
		restrict: 'E',
		templateUrl: 'client/parties/party-details/party-details.html',
		controllerAs: 'partyDetails',
		controller: function($scope, $stateParams, $reactive) {
			$reactive(this).attach($scope);
			//Subscribe to 'parties' AND 'users' publications
			this.subscribe('parties');
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
				},
				//Ensure that user is logged in
				isLoggedIn: () => {
					return Meteor.userId() !== null;
				},
				//Get current user id
				currentUserId: () => {
					return Meteor.userId();
				}
			});
			//Define default map parameters
			this.map = {
				center: {
					latitude: 45,
					longitude: -73
				},
				zoom: 8,
				events: {
					click: (mapModel, eventName, originalEventArgs) => {
						//Ignore click for non-party
						if (!this.party)
							return;
						//Set empty object for location-less party
						if (!this.party.location)
							this.party.location = {};
						//Assign lat & long based on click location
						this.party.location.latitude = originalEventArgs[0].latLng.lat();
						this.party.location.longitude = originalEventArgs[0].latLng.lng();
						//apply to scope because this event handler is outside angular domain
						$scope.$apply();
					}
				},
				marker: {
					//Set marker to be draggable
					options: { draggable: true },
					events: {
						dragend: (marker, eventName, args) => {
							//If party is location-less on drag end, set as empty object
							if (!this.party.location)
								this.party.location = {};
							//Set new location based on drag end location
							this.party.location.latitude = marker.getPosition().lat();
							this.party.location.longitude = marker.getPosition().lng();
						}
					}
				}
			};
			//Save/update the name & description of the current party
			this.save = () => {
				Parties.update({_id: $stateParams.partyId}, {
					$set: {
						name: this.party.name,
						description: this.party.description,
						'public': this.party.public,
						location: this.party.location
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
			//Handle permissions to determine is invitations should be shown
			this.canInvite = () => {
				if (!this.party)
					return false;
				return !this.party.public && this.party.owner === Meteor.userId();
			};
		}
	}
});