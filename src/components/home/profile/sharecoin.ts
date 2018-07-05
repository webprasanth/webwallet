/**
 * Landing page of Flash wallet Share
 */
import { riot, template } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import { userActions } from '../../../model/users/actions';
import { profileActions } from '../../../model/profile/actions';
import { PROFILE } from '../../../model/action-types';
import ShareCoinTemplate from './sharecoin.html!text';
import BaseElement from '../../base-element';
import { USERS } from '../../../model/action-types';
import * as utils from '../../../model/utils';

@template(ShareCoinTemplate)
export default class ShareCoin extends BaseElement {
  private static unsubscribe = null;
  private sixDigitCode = null;
  private txnPercent = 0;
  private showAddressForm = false;
  private showGenerateButton = true;
  private showSubmitAddressButton = false;
  private showUpdateButton = true;
  private showSubmitPayoutButton = false;
  private showRemovePayoutButton = true;
  private showCopyButton = false ;
  private sumPercent = 0;
  private payoutCode = '';
  private payoutCodeResponse = '';
  private myWalletAddress = '';
  

  mounted() {
    let state = store.getState();
    let data = state.profileData;

    this.getSharingCode();
    this.getPayoutCode();
	
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
	//alert('type is ' + type + 'address' + state.profileData.wallet.address );
    switch (type) {
      case PROFILE.GET_WALLETS_BY_EMAIL_SUCCESS:
        this.myWalletAddress = state.profileData.wallet.address ;
        break;	  
      case PROFILE.ADD_SHARECOIN_SUCCESS:
        this.showGenerateButton = false;
        this.showCopyButton = true;
        this.showUpdateButton = true;
        this.showSubmitAddressButton = false;
        this.disableSharePercent();
        super.showMessage('', this.getText('wallet_share_record_added'));
        break;
      case PROFILE.ADD_SHARECOIN_FAILED:
        super.showMessage('', this.getText('wallet_share_record_failed'));
        break;
      case PROFILE.GET_SHARECODE_SUCCESS:
        if(data.sharing_code.length != 0){
          this.showGenerateButton = false;
          this.showCopyButton = true;
          this.showUpdateButton = true;
          this.showSubmitAddressButton = false;
          this.showAddressForm = true;
          this.sixDigitCode = data.sharing_code[0].code;
          this.txnPercent = data.sharing_code[0].sharing_fee;
          this.populateShareDetails(data);
          this.disableSharePercent();
        }
        else {
          this.showGenerateButton = true;
          this.showCopyButton = false;
          this.showUpdateButton = false;
          this.showSubmitAddressButton = true;		
        }
       break;
      case PROFILE.GET_SHARECODE_FAILED:
        super.showMessage('', this.getText('wallet_share_code_not_get'));
        break;
      case PROFILE.UPDATE_SHARECOIN_SUCCESS:
        super.showMessage('', this.getText('wallet_share_record_updated'));
        break;
      case PROFILE.UPDATE_SHARECOIN_FAILED:
        super.showMessage('', this.getText('wallet_share_update_failed'));
        break;
      case PROFILE.ADD_PAYOUTCODE_SUCCESS:
        this.showSubmitPayoutButton = false;
        this.showRemovePayoutButton = true;
        super.showMessage('', this.getText('wallet_share_payout_added'));
        break;
      case PROFILE.ADD_PAYOUTCODE_FAILED:
        super.showMessage('', this.getText('ERROR : ' + data.reason));
        break;
      case PROFILE.GET_PAYOUTCODE_SUCCESS:
        this.payoutCodeResponse = data;
        this.payoutCode = this.payoutCodeResponse.payout_code;
        if(this.payoutCode == ''){
          this.showSubmitPayoutButton = true;
          this.showRemovePayoutButton = false;
        }
        $("#mypayoutcode").val(this.payoutCode);
        break;
      case PROFILE.GET_PAYOUTCODE_FAILED:
        break;
      case PROFILE.REMOVE_PAYOUTCODE_SUCCESS:
        this.payoutCode = '';
        $("#mypayoutcode").val(this.payoutCode);
        this.showSubmitPayoutButton = true;
        this.showRemovePayoutButton = false;
        super.showMessage('', this.getText('wallet_share_payout_removed'));
        break;
      case PROFILE.REMOVE_PAYOUTCODE_FAILED:	    
        super.showMessage('', this.getText('ERROR : ' + data.reason));
        break;
		default: break;
    }

    this.update();
  }

  generateMyShareCode(){
    //this button should be disabled if any code is generated and valid
	this.sixDigitCode = utils.getSixCharString();
    $('#mysharecode').val(this.sixDigitCode);
    this.showAddressForm = true;
	this.showGenerateButton = false;
 }
  
  
  submitAddressDetail(){
	if(!this.isValidTxnAmountPercent())
	return;
    if(!this.isValidAllShareAddress())
	return;
    if(!this.sumHundredPercent())
	return;
	
    this.addShareAddressAndPercentage();
  }

  updateSharecodeRecords(){
	if(!this.isValidTxnAmountPercent())
	return;
    if(!this.isValidAllShareAddress())
	return;
    if(!this.sumHundredPercent())
	return;
	this.updateShareAddressAndPercentage();
  }   

  isValidTxnAmountPercent(){
    this.txnPercent = $("#txnshare-percent").val();
      if(this.txnPercent === ''){
        super.showError('', this.getText('wallet_share_percent_nonempty'));
        $("#txnshare-percent").focus().select();
        return false;
      }
      else {
        return true;
      }
  }

    isValidAllShareAddress(){
	  for (var i = 1; i <= 10; i++) {
        var flashShareAddress = $("#share-address" + i).val();
        var percentToShare = $("#share-percent" + i).val();
        if(flashShareAddress == ''){
		$("#share-percent" + i).val('0');
			continue;
		}
        if(flashShareAddress == this.myWalletAddress){
          return true;
        }
        if(!this.isValidFlashAddress(flashShareAddress)){
          super.showError('', this.getText('wallet_share_invalid_flash_address'));
          return false;
		}
	  }
      return true;	  
	}

  sumHundredPercent(){
 	this.sumPercent =  parseFloat($('#share-percent1').val()) + parseFloat($('#share-percent2').val()) + parseFloat($('#share-percent3').val()) + 
	                   parseFloat($('#share-percent4').val()) + parseFloat($('#share-percent5').val()) + parseFloat($('#share-percent6').val()) + 
                       parseFloat($('#share-percent7').val()) + parseFloat($('#share-percent8').val()) + parseFloat($('#share-percent9').val()) + 
                       parseFloat($('#share-percent10').val());
					   
	if(this.sumPercent != '100'){
      super.showError('', this.getText('wallet_share_sum_hundread'));
      return false;
	} else {
	  return true;
	}
  }
	

  submitPayoutCode(){

    this.payoutCode = $("#mypayoutcode").val();
	if(this.payoutCode === ''){
	  super.showError('', this.getText('wallet_share_payout_nonempty'));
	  return ;
	}  
    
    if(this.payoutCode === this.sixDigitCode){
      super.showError('', this.getText('Can not add self ShareCode as payout code'));
      return ;
	}

    let params = {
	  sharing_code: this.payoutCode,
	  };

    store.dispatch(profileActions.addPayoutCode(params));	
  }
  
  getPayoutCode (){
    let params = {};
    store.dispatch(profileActions.getCurrentPayoutCode(params));	
  } 

 removePayoutCode (){ 
    let params = {};
	if(this.payoutCode == ''){	
	  super.showError('', this.getText('no_payout_code'));
	  return;
	}
    if(this.payoutCodeResponse.payout_code_is_locked == '1'){
	 super.showError('', this.getText('locked_payout_code'));
	 return;
    }
    store.dispatch(profileActions.removePayoutCode(params));
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
	  address_2:$('#share-address2').val(),
	  address_3:$('#share-address3').val(),
	  address_4:$('#share-address4').val(),
	  address_5:$('#share-address5').val(),
	  address_6:$('#share-address6').val(),
	  address_6:$('#share-address7').val(),
	  address_8:$('#share-address8').val(),
	  address_9:$('#share-address9').val(),
	  address_10:$('#share-address10').val(),
	  label_1:$('#remark1').val(),
	  label_2:$('#remark2').val(),
	  label_3:$('#remark3').val(),
	  label_4:$('#remark4').val(),
	  label_5:$('#remark5').val(),
	  label_6:$('#remark6').val(),
	  label_7:$('#remark7').val(),
	  label_8:$('#remark8').val(),
	  label_9:$('#remark9').val(),
	  label_10:$('#remark10').val(),
	  percentage_1:$('#share-percent1').val(),
	  percentage_2:$('#share-percent2').val(),
	  percentage_3:$('#share-percent3').val(),
	  percentage_4:$('#share-percent4').val(),
	  percentage_5:$('#share-percent5').val(),
	  percentage_6:$('#share-percent6').val(),
	  percentage_7:$('#share-percent7').val(),
	  percentage_8:$('#share-percent8').val(),
	  percentage_9:$('#share-percent9').val(),
	  percentage_10:$('#share-percent10').val(),
	  };

    store.dispatch(profileActions.addSharecoinDetails(params));
  }

  getSharingCode() {
    let params = {};
    store.dispatch(profileActions.getSharingCode(params));
  }

  updateShareAddressAndPercentage() {
    let params = {
	  sharing_code: this.sixDigitCode,
	  sharing_fee: this.txnPercent,
	  address_1:$('#share-address1').val(),
	  address_2:$('#share-address2').val(),
	  address_3:$('#share-address3').val(),
	  address_4:$('#share-address4').val(),
	  address_5:$('#share-address5').val(),
	  address_6:$('#share-address6').val(),
	  address_6:$('#share-address7').val(),
	  address_8:$('#share-address8').val(),
	  address_9:$('#share-address9').val(),
	  address_10:$('#share-address10').val(),
	  label_1:$('#remark1').val(),
	  label_2:$('#remark2').val(),
	  label_3:$('#remark3').val(),
	  label_4:$('#remark4').val(),
	  label_5:$('#remark5').val(),
	  label_6:$('#remark6').val(),
	  label_7:$('#remark7').val(),
	  label_8:$('#remark8').val(),
	  label_9:$('#remark9').val(),
	  label_10:$('#remark10').val(),
	  percentage_1:$('#share-percent1').val(),
	  percentage_2:$('#share-percent2').val(),
	  percentage_3:$('#share-percent3').val(),
	  percentage_4:$('#share-percent4').val(),
	  percentage_5:$('#share-percent5').val(),
	  percentage_6:$('#share-percent6').val(),
	  percentage_7:$('#share-percent7').val(),
	  percentage_8:$('#share-percent8').val(),
	  percentage_9:$('#share-percent9').val(),
	  percentage_10:$('#share-percent10').val(),
	  };

    store.dispatch(profileActions.updateSharecoinDetails(params));
  }
  
  copyMyShareCode() {
    var copyText = document.getElementById("mysharecode");
    copyText.disabled=false;	
    copyText.select();
    document.execCommand("copy");
    copyText.disabled = true;
    super.showMessage('', this.getText('wallet_share_code_copied'));
  }  
  disableSharePercent(){
    var txnshareElement = document.getElementById("txnshare-percent");
    txnshareElement.disabled=true;
  }
}
