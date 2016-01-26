//Publish email address & profile info for all users
Meteor.publish("users", function () {
	return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});