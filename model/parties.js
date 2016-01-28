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
//Define parties methods
Meteor.methods({
	//Invite users to private party
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
		if (userId !== party.owner && !_.contains(party.invited, userId)) {
			//Add this user to the invited array			
			Parties.update(partyId, {$addToSet: {invited: userId}});
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
	},
	//Let invitees RSVP to invitations
	rsvp: function (partyId, rsvp) {
		//Ensure both params are strings
		check(partyId, String);
		check(rsvp, String);
		//If user has no Id, login error
		if (!this.userId)
			throw new Meteor.Error(403, "You must be logged in to RSVP");
		//If user's rsvp is incorrect, tell'em
		if (!_.contains(['yes', 'no', 'maybe'], rsvp))
			throw new Meteor.Error(400, "Invalid RSVP");
		//Get party
		let party = Parties.findOne(partyId);
		//If party doesn't exist, tell user
		if (!party)
			throw new Meteor.Error(404, "That party does not exist");
		//If party is private, owner is NOT current user, but current user is NOT invited
		if (!party.public && party.owner !== this.userId && !_.contains(party.invited, this.userId))
			throw new Meteor.Error(403, "No such party");
		//Assign rsvpIndex variable
		let rsvpIndex = _.indexOf(_.pluck(party.rsvps, 'user'), this.userId);
		//If index already exists
		if (rsvpIndex !== -1) {
			//Update existing rsvp entry with '$' from server
			if (Meteor.isServer) {
				Parties.update(
					{_id: partyId, "rsvps.user": this.userId},
					{$set: {"rsvps.$.rsvp": rsvp}});
			} else {
				//Minimongo doedsnt support '$' in modifier
				//As temporary workaround, make modifier that uses an index
				//This is safe on client b/c theres only 1 thread
				let modifier = {$set: {}};
				modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;
				//Update on client
				Parties.update(partyId, modifier);
			}
		} else {
			//Add new rsvp entry to party's rsvps list if index doesn't yet exist
			Parties.update(partyId,
				{$push: {rsvps: {user: this.userId, rsvp: rsvp}}});
		}
	}
});