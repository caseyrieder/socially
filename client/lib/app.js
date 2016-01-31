/*
Add package dependencies
-angular for meteor
-ui router to handle deep linking
-login, signup, password stuff, security
-pagination directives
-google maps
-angular material
*/
angular.module('socially', [
	'angular-meteor',
	'ui.router',
	'accounts.ui',
	'angularUtils.directives.dirPagination',
	'uiGmapgoogle-maps',
	'ngMaterial'
]);

//Define material icon provider
angular.module('socially').config(($mdIconProvider) => {
	$mdIconProvider
		.iconSet("social", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg")
		.iconSet("action", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg")
		.iconSet("communication", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg")
		.iconSet("content", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg")
		.iconSet("toggle", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-toggle.svg")
		.iconSet("navigation", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg")
		.iconSet("image", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg");
});

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