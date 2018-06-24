/**
 * Landing page
 */
import { riot, template } from '../../riot-ts';
import store from '../../../model/store';
import { userActions } from '../../../model/users/actions';
import ShareCoinTemplate from './sharecoin.html!text';
import BaseElement from '../../base-element';
import { USERS } from '../../../model/action-types';
import * as utils from '../../../model/utils';

let tag = null;
@template(ShareCoinTemplate)
export default class ShareCoin extends BaseElement {
  private sesureMsg: string = null;
  private static unsubscribe = null;
  private sixDigitCode = null;
  private showAddressForm = false;
  private showGenerateButton = true;
  private sumPercent = 0;
  

  mounted() {
    tag = this;
	//TODO 1 call function and poulate fill My Share code and All address and there percentage
	//TODO 2 Call function and populate MyPayoutShare code
    
	//call get-sharing-code  , if response not null , set showAddress form true and showgenerate true, vice versa and populate other detail
	var i;
	for (i = 1; i <= 10; i++) {
		$("#share-percent" + i).keypress(utils.filterNumberEdit);
	}	
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
	var i;
	for (i = 1; i <= 3; i++) {
        var flashShareAddress = $("#share-address" + i).val();
		var percentToShare = $("#share-percent" + i).val();
		alert( 'address is ' + flashShareAddress);
		if(flashShareAddress == ''){
		$("#share-percent" + i).val('0');
			alert('cannot be blank');
		}
	}
	
	this.sumPercent =  parseFloat($('#share-percent1').val()) + parseFloat($('#share-percent2').val()) + parseFloat($('#share-percent3').val()) + 
	                   parseFloat($('#share-percent4').val()) + parseFloat($('#share-percent5').val()) + parseFloat($('#share-percent6').val()) + 
                       parseFloat($('#share-percent7').val()) + parseFloat($('#share-percent8').val()) + parseFloat($('#share-percent9').val()) + 
                       parseFloat($('#share-percent10').val());
	alert('submit share code form' + this.sumPercent);
	if(!this.checkAllAddress()){
        alert('invalid flash address');
		return;
    }
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

  generateSixDigitShareCode(){
  //return a 6 digit share code
      alert('generateSixDigitShareCode');
  }

  checkAllAddress() {
    let term = $('#share-address1').val();

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
  checkSecureQuestion() {
    let questionA = $('#questionA').val();
    let questionB = $('#questionB').val();
    let questionC = $('#questionC').val();
    let answerA = $('#answerA').val();
    let answerB = $('#answerB').val();
    let answerC = $('#answerC').val();

    if (
      !questionA ||
      !questionB ||
      !questionC ||
      !answerA ||
      !answerB ||
      !answerC
    ) {
      this.sesureMsg = this.getText('sc_question_required_msg');
      return;
    }

    this.sesureMsg = null;
    riot.mount('#confirm-send', 'request-password', {
      cb: this.setSecurityQuestion,
    });
  }

  setSecurityQuestion(password) {
    $('#btn-submit').button('loading');

    let questionA: string = $('#questionA').val();
    let questionB: string = $('#questionB').val();
    let questionC: string = $('#questionC').val();
    let answerA: string = $('#answerA').val();
    let answerB: string = $('#answerB').val();
    let answerC: string = $('#answerC').val();
    let answers = [answerA, answerB, answerC];

    store.dispatch(
      userActions.updateRecoveryKeys(
        questionA,
        answerA,
        questionB,
        answerB,
        questionC,
        answerC,
        password
      )
    );
  }

  clearField() {
    $('#questionA').val('');
    $('#questionB').val('');
    $('#questionC').val('');
    $('#answerA').val('');
    $('#answerB').val('');
    $('#answerC').val('');
  }

  onApplicationStateChanged() {
    let state = store.getState();
    let data = state.userData;
    let type = state.lastAction.type;

    switch (type) {
      case USERS.UPDATE_SECURITY_QUESTIONS_FAIL:
        $('#btn-submit').button('reset');
        super.showError('', this.getText('sc_question_update_fail'));
        break;
      case USERS.UPDATE_SECURITY_QUESTIONS_SUCCESS:
        $('#btn-submit').button('reset');
        super.showMessage(
          '',
          this.getText('sc_question_update_ok'),
          this.clearField
        );
        break;
      default:
        break;
    }

    this.update();
  }
}
