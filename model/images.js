// Define Images collection
Images = new FS.Collection('images', {
	// Define image store(s)
	stores: [
		// Original store
		new FS.Store.GridFS("original"),
		// Thumbnail store
		new FS.Store.GridFS("thumbnail", {
			// Use transWrite to make 32x32 thumbnails
			tansformWrite: function(fileObj, readStream, writeStream) {
				gm(readStream, fileObj.name()).resize('32', '32', '!').stream().pipe(writeStream);
			}
		})
	],
	// Filter filetypes by location
	filter: {
		allow: {
			contentTypes: ['/image/*']
		}
	}
});
// Editing on server-side only
if (Meteor.isServer) {
	Images.allow({
		// Add only with userId
		insert: function (userId) {
			return (userId ? true : false);
		},
		// Delete only with userId
		remove: function (userId) {
			return (userId ? true : false);
		},
		// Download for anyone
		download: function () {
			return true;
		},
		// Upload only with userId
		update: function (userId) {
			return (userId ? true : false);
		}
	});
	// Publish all Images in images CollectionFS
	Meteor.publish('images', function() {
		return Images.find({});
	});
}