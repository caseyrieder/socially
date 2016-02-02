angular.module('socially.browser').directive('login', function() {
  return {
    restrict: 'E',
    templateUrl: 'packages/socially-browser/client/auth/login/login.html',
    controllerAs: 'login',
    controller: function ($scope, $reactive, $state) {
      $reactive(this).attach($scope);
      // Initialize user credentials
      this.credentials = {
        email: '',
        password: ''
      };
      // Initialize error
      this.error = '';
      // Login method
      this.login = () => {
        Meteor.loginWithPassword(this.credentials.email, this.credentials.password, (err) => {
          // Save error if needed
          if (err) {
            this.error = err;
          }
          // On success, reroute to 'parties'
          else {
            $state.go('parties');
          }
        });
      };
    }
  }
});