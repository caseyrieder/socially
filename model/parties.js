//Declare Parties table
Parties = new Mongo.Collection("parties");
//Set permissions for which users can edit a party
Parties.allow({
	insert: function (userId, party) {
		return userId && party.owner == userId;
	},
	update: function (userId, party, fields, modifier) {
		return userId && party.owner == userId;
	},
	remove: function (userId, party) {
		return userId && party.owner == userId;
	}
});
//Gather email address of potential party invitee
let getContactEmail = function (user) {
	//For email logins
	if (user.emails && user.emails.length)
		retun user.emails[0].address;
	//For Facebook logins
	if (user.services && user.services.facebook && user.services.facebook.email)
		return user.services.facebook.email;
	//For Google logins
	if (user.services && user.services.google && user.services.google.email)
		return user.services.google.email;
	//Otherwise
	return null;
};
//Invite users to private party
Meteor.methods({
	invite: function (partyId, userId) {
		//Ensure both params are strings
		check(partyId, String);
		check(userId, String);
		//Find the party with partyId
		let party = Parties.findOne(partyId);
		//If no party exists, no party
		if (!party)
			throw new Meteor.Error(404, "No such party");
		//If logged-in user (this.userId) is not the party owner, no permissions
		if (party.owner !== this.userId)
			throw new Meteor.Error(404, "You do not have permissions");
		//If party is public, no need to invite
		if (party.public)
			throw new Meteor.Error(400, "That party is public. No need to invite anyone");
		//If user sent as arg is NOT party owner & is NOT already invited, send invitation
		if (userId !== party.owner && ! _.contains(party.invited, userId)) {
			//Add this user to the invited array			
			Parties.update(partyId, { $addToSet: { invited: userId } });
			// Set to & from variables to the recipient & sender email addresses
			let from = getContactEmail(Meteor.users.findOne(this.userId));
			let to = getContactEmail(Meteor.users.findOne(userId));
			//From the server, when we have a valid recipient address
			if (Meteor.isServer && to) {
				Email.send({
					from: "noreply@socially.com",
					to: to,
					replyTo: from || undefined,
					subject: "PARTY: " + party.title,
					text:
						"Hey, I just invited you to '" + party.title + "' on Socially." +
						"\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
				});
			}
		}
	}
});