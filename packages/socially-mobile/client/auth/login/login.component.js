angular.module('socially.mobile').directive('login', function() {
  return {
    restrict: 'E',
    templateUrl: 'packages/socially-mobile/client/auth/login/login.html',
    controllerAs: 'login',
    controller: function($scope, $reactive, $state) {
      $reactive(this).attach($scope);
      // Initialize SMS verification variables
      this.isStepTwo = false;
      this.phoneNumber = '';
      this.verificationCode = '';
      this.error = '';
      // Verify phone number method
      this.verifyPhone = () => {
        // Call reqPhnVerif... method on phone & go to verifyCode (step2)
        Accounts.requestPhoneVerification(this.phoneNumber);
        this.isStepTwo = true;
      };
      // Confirm verify code method
      this.verifyCode = () => {
        // Verify phone with code, handle error, redirect to 'parties'
        Accounts.verifyPhone(this.phoneNumber, this.verificationCode, (err) => {
          if (err) {
            this.error = err;
          }
          else {
            $state.go('parties');
          }
        });
      }
    }
  }
});