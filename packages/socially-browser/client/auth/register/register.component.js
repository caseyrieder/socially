angular.module('socially.browser').directive('register', function() {
	return {
		restrict: 'E',
		templateUrl: 'packages/socially-browser/client/auth/register/register.html',
		controllerAs: 'register',
		controller: function ($scope, $reactive, $state) {
			$reactive(this).attach($scope);
			//Initialize crendentials
			this.crendentials = {
				email: '',
				password: ''
			};
			//Initialize error
			this.error = '';
			//Register method
			this.register = () => {
				//Attempt to create the user
				Accounts.createUser(this.credentials, (err) => {
					//if it fails, save the error
					if (err) {
						this.error = err;
					}
					//if it succeeds, save the user & re-route to 'parties'
					else {
						$state.go('parties');
					}
				});
			};
		}
	}
});