//Parties publisher
/*
Selector:
-enables user-define string searching
-selects all parties that are public OR owned by current user
Counts:
-counts all parties gathered by selector
-ensures that publication waits for our main cursor to be ready
Publication:
-returns all parties gathered by selector which meet client-defined options
*/
Meteor.publish("parties", function (options, searchString) {
	if (!searchString || searchString == null) {
		searchString = '';
	}

	let selector = {
		name: { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
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
			}
		]
	};

	Counts.publish(this, 'numberOfParties', Parties.find(selector), {noReady: true});
	return Parties.find(selector, options);
});