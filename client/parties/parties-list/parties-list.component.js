// Define the parties list component
angular.module('socially').directive('partiesList', function() {
	return {
		restrict: 'E',
		templateUrl: () => {
      // Assign platform-appropriate view
      if (Meteor.isCordova) {
        return 'packages/socially-mobile/client/parties/parties-list/parties-list.html';
      }
      else {
        return 'packages/socially-browser/client/parties/parties-list/parties-list.html';
      }
    },
		controllerAs: 'partiesList',
		controller: function($scope, $reactive, $mdDialog, $filter) {
			$reactive(this).attach($scope);
			// Declare newParty variable
			this.newParty = {};
			// Add pagination, sort/order, & search defaults
			this.perPage = 3;
			this.page = 1;
			this.sort = {
				name: 1
			};
			this.orderProperty = '1';
			this.searchText = '';
			// Add map logic & initialize map object
			this.map = {
				center: {
					latitude: 45,
					longitude: -73
				},
				options: {
					maxZoom: 10,
					styles: [{
						"featureType": "administrative",
						"elementType": "labels.text.fill",
						"stylers": [{"color": "#444444"}]
					}, {
						"featureType": "landscape",
						"elementType": "all",
						"stylers": [{"color": "#f2f2f2"}]
					}, {
						"featureType": "poi",
						"elementType": "all",
						"stylers": [{"visibility": "off"}]
					}, {
						"featureType": "road",
						"elementType": "all",
						"stylers": [{"saturation": -100}, {"lightness": 45}]
					}, {
						"featureType": "road.highway",
						"elementType": "all",
						"stylers": [{"visibility": "simplified"}]
					}, {
						"featureType": "road.arterial",
						"elementType": "labels.icon",
						"stylers": [{"visibility": "off"}]
					}, {
						"featureType": "transit",
						"elementType": "all",
						"stylers": [{"visibility": "off"}]
					}, {
						"featureType": "water",
						"elementType": "all",
						"stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
					}]
				},
				zoom: 8
			};
			// Subscribe to 'users' publication
			this.subscribe('users');
			// Subscribe to 'parties' publication, include subscription params
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
			//Subscribe to 'images' publication
			this.subscribe('images');
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
				},
				// Get images from CollectionFS
				images: () => {
					return Images.find({});
				}
			});
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
			this.getPartyCreator = function (party) {
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
				// Call model's rsvp method w/appropriate args & error callback
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
			// Open new party modal
			this.openAddNewPartyModal = function () {
				$mdDialog.show({
					template: '<add-new-party-modal></add-new-party-modal>',
					clickOutsideToClose: true
				});
			};
			// Check RSVP
			this.isRSVP = (rsvp, party) => {
				// Ensure user exists
				if (Meteor.userId() == null) {
					return false;
				}
				// Find rsvp index from partiy's list of rsvps
				let rsvpIndex = party.myRsvpIndex;
				rsvpIndex = rsvpIndex || _.indexOf(_.pluck(party.rsvps, 'user'), Meteor.userId());
				// If rsvp index exists
				if (rsvpIndex !== -1) {
					party.myRsvpIndex = rsvpIndex;
					return party.rsvps[rsvpIndex].rsvp === rsvp;
				}
			};
			// Set 1st image from images array as background image
			this.getMainImage = (images) => {
				// Confirm images exists & there is at least 1 image in array
				if (images && images.length && images[0] && images[0]) {
					// Get id of 1st image, save dataUrl of that id
					var url = $filter('filter')(this.images, {_id: images[0]})[0].url();
					//return main-image as background image
					return {
						'background-image': 'url("' + url + '")'
					}
				}
			};
		}
	}
});