if (Meteor.isClient) {
	angular.module('socially', ['angular-meteor']);

	angular.module('socially').controller('PartiesListCtrl', function ($scope) {
		$scope.parties = [
			{
				'name': 'Dubstep-Free Zone',
				'description': 'Can we PLEASE just for an evening not listen to dubstep!?!?!?'
			},
			{
				'name': 'All Dubstep All the Time',
				'description': 'Get it on!'
			},
			{
				'name': 'Savage Lounging',
				'description': 'Leisure suit required. And only fiercest manners'
			}
		];
	});
}