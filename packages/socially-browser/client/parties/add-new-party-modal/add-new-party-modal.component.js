angular.module('socially.browser').directive('addNewPartyModal', function() {
	return {
		restrict: 'E',
		templateUrl: 'packages/socially-browser/client/parties/add-new-party-modal/add-new-party-modal.html',
		controllerAs: 'addNewPartyModal',
		controller: function($scope, $stateParams, $reactive, $mdDialog) {
			$reactive(this).attach($scope);
			// Declare add party helper functions
			this.helpers({
				// Determine is user is logged in
				isLoggedIn: () => {
					return Meteor.userId() !== null;
				}
			});
			// Declare newParty variable
			this.newParty = {};
			// Add the new party
			this.addNewParty = () => {
				this.newParty.owner = Meteor.userId();
				//Maps imageIds from 'saveCroppedImage' method, or empty obj
				this.newParty.images = (this.newParty.images || {}).map((image) => {
					return image._id;
				});
				Parties.insert(this.newParty)
				this.newParty = {};
				$mdDialog.hide();
			};
			// Close the dialog
			this.close = () => {
				$mdDialog.hide();
			};
			// Add images to party
			this.addImages = (files) => {
				if (files.length > 0) {
					// Inintialize file reader
					let reader = newFileReader();
					// Reader vars store src image & cropped img url 
					reader.onload = (e) => {
						$scope.$apply(() => {
							this.cropImgSrc = e.target.result;
							this.myCroppedImage = '';
						});
					};
					// Read file as DataUrl
					reader.readAsDataUrl(files[0]);
				}
				// Otherwise, if not files exist, save image as undefined
				else {
					this.cropImgSrc = undefined;
				}
			};
			// Save image after cropping
			this.saveCroppedImage = () => {
				// As long as the data url exists
				if (this.myCroppedImage !== '') {
					// Insert the data url, with error & file object callbacks
					Images.insert(this.myCroppedImage, (err, fileObj) => {
						// If no images are saved to party yet, create the images array
						if (!this.newParty.images) {
							this.newParty.images = [];
						}
						// Push file object to party's images array
						this.newParty.images.push(fileObj);
						// Re-set source & cropped image variables
						this.cropImgSrc = undefined;
						this.myCroppedImage = '';
					});
				}
			};
			// Set metadata image description
			this.updateDescription = ($data, image) => {
				Images.update({_id: image._id}, {$set: {'metadata.description': $data}});
			};
		}
	}
});