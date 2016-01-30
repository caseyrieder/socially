/*
Add package dependencies
-angular for meteor
-ui router to handle deep linking
-login, signup, password stuff, security
-pagination directives
-google maps
*/
angular.module('socially', [
	'angular-meteor',
	'ui.router',
	'accounts.ui',
	'angularUtils.directives.dirPagination',
	'uiGmapgoogle-maps'
]);

//bootstrap Angular according to platform (browser v mobile)
function onReady() {
  angular.bootstrap(document, ['socially'], {
    strictDi: true
  });
}
 
if (Meteor.isCordova)
  angular.element(document).on("deviceready", onReady);
else
  angular.element(document).ready(onReady);