//Publish all public parties & parties owned by current user
Meteor.publish("parties", function () {
	return Parties.find({
		$or: [
			{
				$and: [
					{"public": true},
					{"public": {$exists: true}}
				]
			},
			{
				$and: [
					{owner: this.userId},
					{owner: {$exists: true}}
				]
			}
		]
	});
});