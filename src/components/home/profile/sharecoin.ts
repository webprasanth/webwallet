/**
 * Landing page
 */
import { riot, template } from '../../riot-ts';
import store from '../../../model/store';
import { userActions } from '../../../model/users/actions';
import { profileActions } from '../../../model/profile/actions';
import { PROFILE } from '../../../model/action-types';
import ShareCoinTemplate from './sharecoin.html!text';
import BaseElement from '../../base-element';
import { USERS } from '../../../model/action-types';
import * as utils from '../../../model/utils';

let tag = null;
@template(ShareCoinTemplate)
export default class ShareCoin extends BaseElement {
  private static unsubscribe = null;
  private sixDigitCode = null;
  private txnPercent = 0;
  private showAddressForm = false;
  private showGenerateButton = true;
  private sumPercent = 0;
  

  mounted() {
    tag = this;
	//TODO 1 call function and poulate fill My Share code and All address and there percentage
	//TODO 2 Call function and populate MyPayoutShare code
    
	//call get-sharing-code  , if response not null , set showAddress form true and showgenerate true, vice versa and populate other detail
    this.getSharingCode();
	
	if (ShareCoin.unsubscribe) ShareCoin.unsubscribe();
    ShareCoin.unsubscribe = store.subscribe(
      this.onApplicationStateChanged.bind(this)
    );
	
	$("#txnshare-percent").keypress(utils.filterNumberEdit);
	for (var i = 1; i <= 10; i++) {
		$("#share-percent" + i).keypress(utils.filterNumberEdit);
	}	
  }

    onApplicationStateChanged() {
    let state = store.getState();
    let type = state.lastAction.type;
    let data = state.lastAction.data;
	//alert('type is ' + type);
    switch (type) {
      case PROFILE.ADD_SHARECOIN_SUCCESS:
        super.showMessage('', this.getText('UPDATE_SHARECOIN_SUCCESS'));
        break;
      case PROFILE.ADD_SHARECOIN_FAILED:
        super.showMessage('', this.getText('UPDATE_SHARECOIN_FAILED'));
        break;
      case PROFILE.GET_SHARECODE_SUCCESS:
	    if(data.sharing_code.length != 0){
          this.showGenerateButton = false;
		  this.showAddressForm = true;
		  this.sixDigitCode = data.sharing_code[0].code;
		  this.txnPercent = data.sharing_code[0].sharing_fee;
		}
		this.populateShareDetails(data);
		
	    super.showMessage('', this.getText('GET_SHARECODE_SUCCESS'));
		alert(data.sharing_code[0].address);
        break;
      case PROFILE.GET_SHARECODE_FAILED:
        super.showMessage('', this.getText('GET_SHARECODE_FAILED'));
        break;
	default: break;
    }

    this.update();
  }

  //Add a method to Generate Share code
  generateMyShareCode(){
    //this button should be disabled if any code is generated and valid
    //alert('generating my 6 digit share code');
	this.sixDigitCode = utils.getSixCharString();
    $('#mysharecode').val(this.sixDigitCode);
    this.showAddressForm = true;
	this.showGenerateButton = false;
  }
  
  //Add a method to delete myShareCode
  deleteMyShareCode(){
    //Show warning message for before deleting all address and code
   //This method will delete my Share Code and all address containd in it
   alert('delete my Share Code');
  }
  
  //Add method to submit all address and percentage amount to database 
  submitAddressDetail(){
	/* TODO
	1. Validate all address is valid flash Address
	2. Sum of percentage makes excatly 100%	
	*/
	this.txnPercent = $("#txnshare-percent").val();
	if(this.txnPercent === ''){
	  super.showError('', 'Transaction Share Percent cannot be empty');
	  $("#txnshare-percent").focus().select();
	  //TODO test this focus feature
      return;
	}
	
	for (var i = 1; i <= 10; i++) {
        var flashShareAddress = $("#share-address" + i).val();
		var percentToShare = $("#share-percent" + i).val();
		if(flashShareAddress == ''){
		$("#share-percent" + i).val('0');
			continue;
		}
		if(!this.isValidFlashAddress(flashShareAddress)){
          super.showError('', 'Invalid flash address');
          return;
		}
		
	}
		
	this.sumPercent =  parseFloat($('#share-percent1').val()) + parseFloat($('#share-percent2').val()) + parseFloat($('#share-percent3').val()) + 
	                   parseFloat($('#share-percent4').val()) + parseFloat($('#share-percent5').val()) + parseFloat($('#share-percent6').val()) + 
                       parseFloat($('#share-percent7').val()) + parseFloat($('#share-percent8').val()) + parseFloat($('#share-percent9').val()) + 
                       parseFloat($('#share-percent10').val());
					   
	if(this.sumPercent != '100'){
      super.showError('', 'Sum of all share percent must be 100' + this.sumPercent);
      return;
	}

    this.addShareAddressAndPercentage();
}
  
  addPayoutCode(){
  //return if this user is aleady added a payout code , ask user to delete first
  //validate share code 
  // get percent of txn fee , and show that as alert  , this much will be extra charged per 100 flash
  //on ok add that in db
  alert('addPayoutShareCode');
  }
  
  removePayoutCode (){
    //todo if it is locked distribution code it will not ve deleted and returned.
  //show warning before removing payout code  
    alert('removePayoutCode');
  }

  populateShareDetails(data){
	$("#mysharecode").val(this.sixDigitCode);
	$("#txnshare-percent").val(this.txnPercent);
	
	for (var i = 0; i < data.sharing_code.length ; i++) {
        $("#share-address" + (i+1)).val(data.sharing_code[i].address);
		$("#share-percent" + (i+1)).val(data.sharing_code[i].percentage);
        $("#remark" + (i+1)).val(data.sharing_code[i].label);		
    }
  }

  isValidFlashAddress(term) {
    //let term = $('#share-address1').val();

    if (term == '') {
      return false;
    }

    if (!(utils.isValidCryptoAddress(term) && term != store.getState().profileData.wallet.address )) {
      return false;
    }
	else {
	    return true ;
    }
  }  

  addShareAddressAndPercentage() {

    let params = {
	  sharing_code: this.sixDigitCode,
	  sharing_fee: this.txnPercent,
	  address_1:$('#share-address1').val(),
	  label_1:$('#remark1').val(),
	  percentage_1:$('#share-percent1').val(),
	  address_2:$('#share-address2').val(),
	  label_2:$('#remark2').val(),
	  percentage_2:$('#share-percent2').val(),
	  };
//TODO create param object
    store.dispatch(profileActions.addSharecoinDetails(params));
  }
  
  getSharingCode() {
    let params = {};
    store.dispatch(profileActions.getSharingCode(params));
  }

}
