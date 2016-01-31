angular.module('socially').directive('login', function() {
	return {
		restrict: 'E',
		templateUrl: 'client/auth/login/login.html',
		controllerAs: 'login',
		controller: function ($scope, $reactive, $state) {
			$reactive(this).attach($scope);
			//Initialize credentials
			this.credentials = {
				email: '',
				password: ''
			};
			//Initialize error
			this.error = '';
			//Login method
			this.login = () => {
				Meteor.loginWithPassword(this.credentials.email, this.credentials.password, (err) => {
					//On login error, display error
					if (err) {
						this.error = err;
					}
					//On login success, go to 'parties'
					else {
						$state.go('parties');
					}
				})
			};
		}
	}
});