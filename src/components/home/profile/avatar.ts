/**
 * Profile avatar
 */
import { riot, template, Element } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import AndamanService from '../../../model/andaman-service';
import ProfileAvatarTemplate from './avatar.html!text';
import { profileActions } from '../../../model/profile/actions';
import { PROFILE } from '../../../model/action-types';
import cropbox from 'cropbox';

@template(ProfileAvatarTemplate)
export default class ProfileAvatar extends Element {

    private userProfile = null;
    private avartarServer: string = null;
    private isUploadingImage: boolean = false;
    private avatarUrl: string = 'assets/images/avatar_default.png';
    private buttonLabel: string = 'Choose Image';
    private cropper = null;
    private static unsubscribe = null;

    mounted() {
        this.userProfile = store.getState().userData.user;
        this.avartarServer = AndamanService.AvatarServer;

        if (this.userProfile.profile_pic_url) {
            this.avatarUrl = `${AndamanService.AvatarServer}${this.userProfile.profile_pic_url}`;
            this.buttonLabel = 'Change Image';
        }

        this.registerFileChangeEvent();
        if (ProfileAvatar.unsubscribe) ProfileAvatar.unsubscribe();
        ProfileAvatar.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.profileData;
        let type = state.lastAction.type;

        if (type == PROFILE.UPDATE_AVATAR_SUCCESS) {
            this.userProfile.profile_pic_url = data.avatarToken;
            this.avatarUrl = `${AndamanService.AvatarServer}${this.userProfile.profile_pic_url}`;
            this.buttonLabel = 'Change Image';
            this.showAvatar();
        }

        this.update();
    }

    zoomOut() {
        if (this.cropper) {
            this.cropper.zoomOut();
        }
    }

    zoomIn() {
        if (this.cropper) {
            this.cropper.zoomIn();
        }
    }

    updateAvatar() {
        let img = this.cropper.getDataURL();
        let oFile = this.cropper.getBlob();
        oFile.name = "avatar";

        let percentCb = function (percent) {
            console.log("percent", percent);
            $('#up_percent').html('<p> Uploading : ' + percent + ' % </p>');
        };
        let doneCb = function (resp) {
        };

        store.dispatch(profileActions.updateAvatar(oFile));
    }

    showAvatar() {
        this.isUploadingImage = false;
        delete this.cropper;
        this.cropper = null;

        let input = $("#file");
        input.val('');
    }

    registerFileChangeEvent() {
        let self = this;

        document.querySelector('#file').addEventListener('change', function () {
            self.isUploadingImage = true;

            let options = {
                imageBox: '.imageBox',
                thumbBox: '.thumbBox',
                spinner: '.spinner',
                imgSrc: 'avatar.png'
            };
            let reader = new FileReader();
            reader.onload = function (e) {
                options.imgSrc = e.target.result;
                self.cropper = cropbox(options);
                self.cropper.ratio *= 0.45;

                self.update();
            }
            reader.readAsDataURL(this.files[0]);
        });
    }
}
