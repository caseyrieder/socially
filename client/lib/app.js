/*
Add package dependencies
-angular for meteor
-ui router to handle deep linking
-login, signup, password stuff, security
*/
angular.module('socially', [
	'angular-meteor',
	'ui.router',
	'accounts-ui'
]);
