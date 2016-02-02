angular.module('socially').directive('socially', function () {
	return {
		restrict: 'E',
		templateUrl: () => {
      // Assign platform-appropriate templateUrl
      if (Meteor.isCordova) {
        return 'packages/socially-mobile/client/socially/socially.html';
      }
      else {
        return 'packages/socially-browser/client/socially/socially.html';
      }
    },
		controllerAs: 'socially',
		controller: function ($scope, $reactive) {
			$reactive(this).attach($scope);
			// Helpers
			this.helpers({
				// Ensure user is logged in
				isLoggedIn: () => {
					return Meteor.userId() !== null;
				},
				//Get current user object
				currentUser: () => {
					return Meteor.user();
				}
			});
			//Logout method
			this.logout = () => {
				Accounts.logout();
			}
		}
	}
});