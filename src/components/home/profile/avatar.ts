import { riot, template, Element } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import AndamanService from '../../../model/andaman-service';
import ProfileAvatarTemplate from './avatar.html!text';

@template(ProfileAvatarTemplate)
export default class ProfileAvatar extends Element {

    private userProfile = null;
    private avartarServer: string = null;
    private isUploadingImage: boolean = false;
    private cropper = null;

    mounted() {
        this.userProfile = store.getState().userData.user;
        this.avartarServer = AndamanService.AvatarServer;
        this.registerFileChangeEvent();
    }

    registerFileChangeEvent() {
        var self = this;

        document.querySelector('#file').addEventListener('change', function() {
            self.isUploadingImage = true;

            var options = {
                imageBox: '.imageBox',
                thumbBox: '.thumbBox',
                spinner: '.spinner',
                imgSrc: 'avatar.png'
            };
            var reader = new FileReader();
            reader.onload = function(e) {
                options.imgSrc = e.target.result;
                self.cropper = new cropbox(options);
                self.cropper.ratio *= 0.45;
            }
            reader.readAsDataURL(this.files[0]);
        });
    }
}
