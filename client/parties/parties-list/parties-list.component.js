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
			//Add map logic & initialize map object
			this.map = {
				center: {
					latitude: 45,
					longitude: -73
				},
				zoom: 8
			};
			//Subscribe to 'users' publication
			this.subscribe('users');
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
				// List users from Collection
				users: () => {
					return Meteor.users.find({});
				},
				// Count total parties (from server/parties.js)
				partiesCount: () => {
					return Counts.get('numberOfParties');
				},
				// Determine is user is logged in
				isLoggedIn: () => {
					return Meteor.userId() !== null;
				},
				// Get the current user Id
				currentUserId: () => {
					return Meteor.userId();
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
			// Define method for gathering the party owner & returning appropriate name
			this.getPartyCreator = function(party) {
				if (!party) {
					return '';
				}
				let owner = Meteor.users.findOne(party.owner);
				if (!owner) {
					return 'nobody';
				}
				if (Meteor.userId() !== null && owner._id === Meteor.userId()) {
					return 'me';
				}
				return owner;
			};
			// RSVP to specific party
			this.rsvp = (partyId, rsvp) => {
				//Call model's rsvp method w/appropriate args & error callback
				Meteor.call('rsvp', partyId, rsvp, (error) => {
					if (error) {
						console.log('Oops, unable to rsvp!');
					}
					else {
						console.log('RSVP Done!');
					}
				});
			};
			// Find a user's Id
			this.getUserById = (userId) => {
				return Meteor.users.findOne(userId);
			};
			// Find users that ARE invited but ARE NOT in RSVPs
			this.outstandingInvitations = (party) => {
				return _.filter(this.users, (user) => {
					return (_.contains(party.invited, user._id) && !_.findWhere(party.rsvps, {user: user._id}));
				});
			};
		}
	}
});