angular.module('socially').directive('resetpw', function() {
	return {
		restrict: 'E',
		templateUrl: 'client/auth/reset-password/reset-password.html',
		controllerAs: 'resetpw',
		controller: function ($scope, $reactive, $state) {
			$reactive(this).attach($scope);
			//Initialize credential
			this.credentials = {
				email: ''
			};
			//Initialize error
			this.error = '';
			//Reset method
			this.reset = () => {
				//Attempt to reset password
				Accounts.forgotPassword(this.credentials, (err) => {
					//if there's an error, attach it
					if (err) {
						this.error = err;
					}
					//otherwise, reroute to 'parties'
					else {
						$state.go('parties');
					}
				});
			};
		}
	}
});