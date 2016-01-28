//Parties publisher
Meteor.publish("parties", function (options, searchString) {
	if (!searchString || searchString == null) {
		searchString = '';
	}

	let selector = {
		//Enable user-define string searching
		name: { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
		//Select all parties that are public, owned by current user, or to which the user has been invited
		$or: [
			{
				$and: [
					{'public': true},
					{'public': {$exists: true}}
				]
			},
			{
				$and: [
					{owner: this.userId},
					{owner: {$exists: true}}
				]
			},
			{
				$and: [
					{invited: this.userId},
					{invited: {$exists:true}}
				]
			}
		]
	};
	//Count all parties gathered by selector
	//Ensure that publication waits for our main cursor to be ready
	Counts.publish(this, 'numberOfParties', Parties.find(selector), {noReady: true});
	//Return all parties gathered by selector which meet client-defined options
	return Parties.find(selector, options);
});