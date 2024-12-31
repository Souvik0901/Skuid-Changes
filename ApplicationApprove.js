var params = arguments[0],
	$ = skuid.$;


// Fetch Application Data
var applicationModel = skuid.model.getModel('MyPersonalDetails');
var applicationData = applicationModel.getFirstRow();

var loanAmount=applicationData.genesis__Loan_Amount__c; 

var applicationModel2 = skuid.model.getModel('collateralOwner');
var applicationData2 = applicationModel2.getFirstRow();

//fetch Broker party data
var partyModel=skuid.model.getModel('BrokerParty');
var partyData=partyModel.getFirstRow();
// Fetch Quote Data
var quoteModel = skuid.model.getModel('QuoteModel');
var quoteData = quoteModel.getFirstRow();
console.log('Debug->');
console.log('Quote -> ' + quoteData);

// Fetch Other Loan Data
var othLoanModel = skuid.model.getModel('OtherLoans');
console.log(othLoanModel);
var othLoanData = othLoanModel.getRows();
console.log('othLoanDataIssue=>'+othLoanModel.getRows());


var otherLoandebtModel = skuid.model.getModel('otherLoan_debt');
var otherLoandebtData = otherLoandebtModel.getFirstRow();
console.log('othLoanDataIssue2=>'+otherLoandebtModel.getRows());
var payeeModel=skuid.model.getModel('PayeeParty');
console.log('payeeModel=>'+payeeModel.getRows());

//Fetch Insurance Model for Motor
var insuranceDef = skuid.model.getModel('InsuranceDefination');

// Fetch Credit Card Data
var creditCardModel = skuid.model.getModel('creditCard');
var creditCardData = creditCardModel.getFirstRow();

var bankModel = skuid.model.getModel('Broker_Bank_Account');
var bankRow = bankModel.getRows().length;

var borrower=skuid.model.getModel('BorrowerParty');
var brData=borrower.getFirstRow();

//LMAU-1980
var quoteModel = skuid.model.getModel('QuickQuoteForConsent');
var quoteModelRow = quoteModel.getFirstRow();
var quoteBSBNo=quoteModelRow.BSB_No_of_Old_Loans__c;
var quoteCRNNo=quoteModelRow.CRN_No_of_Old_Loans__c;
//Split the string by commas
if(quoteBSBNo != undefined && quoteCRNNo != undefined && quoteBSBNo != null && quoteCRNNo != null){
    let BSBNoValues = quoteBSBNo.split(',');
    let CRNNoValues = quoteCRNNo.split(',');
    console.log("Extracted valuesCRN1:", CRNNoValues);
    console.log("Extracted valuesCRN1:", BSBNoValues);
    //Filter out empty strings (null values) and handle extra comma
    CRNNoValues = CRNNoValues.filter(value => value.trim() !== '');
    BSBNoValues = BSBNoValues.filter(value => value.trim() !== '');
    console.log("Extracted valuesCRN:", CRNNoValues);
console.log("Extracted valuesCRN:", BSBNoValues);
}
//Output or further processing


///************************************ FOR LMAU -1720 **************************************/
//var myModel;
// if(applicationData.Top_Up__c){
//     myModel = skuid.model.getModel('AppConsentForTopup');
// }
// else{
//     myModel = skuid.model.getModel('AppConsentForNonTopup');
// }
// var modData = myModel.getFirstRow();
// console.log('consent==>',modData.Application_Confirmation__c);
///******************************* FOR LMAU -1720 ******************************************/
var sumOfOtherLoans = 0;


// Fetch Current User Data
var userInfoModel = skuid.model.getModel('UserModel');
var userInfoData = userInfoModel.getFirstRow();
//Fetch Bank Data
var bankModel = skuid.model.getModel('Broker_Fund_Bank_Account');
var bankRows = bankModel.getRows();
var count = bankRows.length;
console.log(bankRows);
console.log(count);
//broker contact record
var brokerContact=skuid.model.getModel('Broker_Contact');
var brokerCon=brokerContact.getFirstRow();
var brokerAccountModel=skuid.model.getModel('Broker_Account');	
var brokerAcc=brokerAccountModel.getFirstRow();	
console.log('brokerAcc '+String.valueOf(brokerAcc));
console.log('brokerAcc '+brokerAcc.recordtypeid);
console.log('brokerAcc '+brokerAcc.brk_AccreditationStatus__c);
// JS Function to display Errors
var displayMessage = function (message, severity) {
    
    var pageTitle = $('#task-list'); 
    console.log(pageTitle);
    var editor = pageTitle.data('object').editor;
    console.log(editor);
    
    editor.messages.empty();
    editor.handleMessages([
        {
            message: message,
            severity: severity.toUpperCase()
        }
    ]);

    return false;
};
var topUp = applicationData.Top_Up__c;
var productName=applicationData.genesis__CL_Product_Name__c;
var AppLicationColateralModel = skuid.model.getModel('ApplicationColateral');
AppLicationCol = AppLicationColateralModel.data[0];
var nameApp=AppLicationColateralModel.data[0].Name;

// Fetch CCT_Queue_Model
var cctQueueModel = skuid.model.getModel('CCT_Queue_Model');
var cctQueueData = cctQueueModel.getFirstRow();

var loanType=false;
///*********************************************** FOR LMAU -1720 ******************************************/
// LMB-927
/*console.log('modData==>',modData);
console.log('consent==>',modData.Application_Confirmation__c);
if(modData!== undefined && modData.Application_Confirmation__c !==true){
    return displayMessage('The customer has not provided consent to perform a credit check', 'ERROR');
}*/

console.log('applicationObj applicationConfirmationConsent ==>',applicationData.Application_Confirmation__c);
if(applicationData !== undefined && applicationData.Application_Confirmation__c !== true){
    return displayMessage('The customer has not provided consent to perform a credit check', 'ERROR');
}
///*********************************************** FOR LMAU -1720 ******************************************/

if(applicationData.Insurance_Rebate_Amount__c !== null && applicationData.Insurance_Rebate_Amount__c !== undefined){
   if((applicationData.Top_Up__c === true) && ((applicationData.Top_Up_Payout_Amount__c).toFixed(2) !== ((applicationData.CL_Contract__r.loan__Pay_Off_Amount_As_Of_Today__c - applicationData.Insurance_Rebate_Amount__c + 100).toFixed(2)))){
    return displayMessage('Please Refresh Top Up Payout Amount prior to approval', 'ERROR');
   } 
}else if((applicationData.Top_Up__c === true) && ((applicationData.Top_Up_Payout_Amount__c).toFixed(2) !== ((applicationData.CL_Contract__r.loan__Pay_Off_Amount_As_Of_Today__c + 100).toFixed(2)))){
    return displayMessage('Please Refresh Top Up Payout Amount prior to approval', 'ERROR');
}

///*********************************************** FOR LMAU -1938 ******************************************/
if(applicationData.Top_Up__c === true){
    if((applicationData.genesis__Loan_Amount__c < 5000)
    || ((applicationData.Top_Up_Payout_Amount__c !== null) 
    && ((applicationData.CL_Contract__r.loan__Pay_Off_Amount_As_Of_Today__c + applicationData.Top_Up_Amount__c) < 5000))){
        return displayMessage('The total loan amount (excluding the Loan Establishment Fee) must be at least $5,000. Please adjust the top-up amount if you wish to proceed.', 'ERROR');
    }
}

if((productName==='Secured Personal Loan Fixed Rate' ||productName==='Secured Personal Loan Variable Rate') && nameApp ===undefined && topUp === false){
    loanType=true;
    return displayMessage('Please provide collateral details', 'ERROR');
}
if(productName==='Secured Personal Loan Fixed Rate' ||productName==='Secured Personal Loan Variable Rate'){
    loanType=true;
}
console.log('gyugygtyngy'+loanType);
// lmb-876
// if(brData!== null && brData!== undefined && (brData.Certified_ID_Compliant__c === false && brData.ID_Matrix_Response__c === 'REJECT')){
//     return displayMessage('ALERT: Certifeid Id Compliant is not checked', 'ERROR');
// }

if(count>1){
    return displayMessage('There are more than one active bank accounts!', 'ERROR');
}
if(bankRows < 1 && applicationData.Broker_Application__c === true){
    return displayMessage('ALERT: Broker bank account record not found. Contact Broker Support.', 'ERROR');
}
//Fix for SYM-3734
var bankEmpty=false;
var refinanceCheck = false;
if(creditCardModel!==null || creditCardModel !== undefined){   
    console.log('credit=>'+creditCardModel.getRows());
    $.each(creditCardModel.getRows(),function(i,iRow){
        console.log('credit=>'+iRow);
                if(iRow.To_be_paid_out__c === true && iRow.Bank_Account__c===undefined){
                    bankEmpty=true;
                }
                if(iRow.Bank_Account__c !== undefined && iRow.To_be_paid_out__c === false){
                    refinanceCheck = true;
                }
                if(iRow.To_be_paid_out__c === true){
                 sumOfOtherLoans+=iRow.Total_Balance__c;
            }
            });
}
if(otherLoandebtModel!== null || otherLoandebtModel !== undefined){ 
    console.log('otherloan=>'+otherLoandebtModel.getRows());
    $.each(otherLoandebtModel.getRows(),function(i,iRow){
        console.log('credit=>'+iRow);
                if(iRow.Eligible_for_Debt_Consolidation__c === true && (iRow.Bank_Account__c===undefined || iRow.Financial_Institution__c === undefined)){
                    bankEmpty=true;
                }
                if((iRow.Bank_Account__c !== undefined && iRow.Financial_Institution__c !== undefined) && iRow.Eligible_for_Debt_Consolidation__c === false){
                    refinanceCheck = true;
                }
                if(iRow.Eligible_for_Debt_Consolidation__c === true){
                 sumOfOtherLoans+=iRow.Total_Balance__c;
            }
            });
}
if((productName !== 'Motor Loan Fixed Rate' && productName !=='Motor Loan Variable Rate') && bankEmpty && applicationData.Broker_Application__c === true){
    return displayMessage('Payout details are incomplete. Please review.', 'ERROR');
}
console.log('bank ='+bankEmpty);
//lmb-632 changes
if((productName !== 'Motor Loan Fixed Rate' && productName !=='Motor Loan Variable Rate') && refinanceCheck){
    return displayMessage('Payout details are incorrect. Please review.', 'ERROR');
}
if((productName !== 'Motor Loan Fixed Rate' && productName !=='Motor Loan Variable Rate') && bankEmpty){
    return displayMessage('Refinance info incomplete - please update', 'ERROR');
}
console.log(sumOfOtherLoans);
console.log(loanAmount);
if(sumOfOtherLoans!== undefined && sumOfOtherLoans!== 0 && sumOfOtherLoans !== null && sumOfOtherLoans.toFixed(2) > loanAmount){
    return displayMessage('Loan Amount should be equal or greater than the Total Debt sum','ERROR');
}
var totalRefinanceAmount=0;
if(othLoanModel!== null || othLoanModel !== undefined){ 
    console.log('otherloan=>'+othLoanModel.getRows());
    $.each(othLoanModel.getRows(),function(i,iRow){
                 totalRefinanceAmount+=iRow.Total_Balance__c;
            });
}
console.log('refinance calculated==>'+totalRefinanceAmount);
console.log('refinance amount===>'+applicationData.Refinance_Amount__c);
//SYM-3446 defect fix
if((quoteData !== null || quoteData !== undefined) && ((othLoanModel === null || othLoanModel === undefined) || ((othLoanModel !== null || othLoanModel !== undefined) && totalRefinanceAmount.toFixed(2) !== applicationData.Refinance_Amount__c?.toFixed(2))) && applicationData.Refinance__c === true){
    return displayMessage('Please Verify Refinance Loan details', 'ERROR');
}

// //LMAU-1980
// var sumOfRefinanceOtherLoan = 0;
// var incorrectRefinanceBank = false;
// if(othLoanData!== null || othLoanData !== undefined){ 
//     console.log('otherloan=>'+othLoanModel.getRows());
//     $.each(othLoanModel.getRows(),function(i,iRow){
//         console.log('EachBSB=>'+iRow.Bank_Account__r.BSB_Number__c);
//         console.log('EachCRN=>'+iRow.Bank_Account__r.loan__Bank_Account_Number__c);
//         console.log(iRow.Bank_Account__r.BSB_Number__c);
//         if((BSBNoValues!== null || BSBNoValues!==undefined) && !BSBNoValues.includes(iRow.Bank_Account__r.BSB_Number__c)){
//             incorrectRefinanceBank = true;
//         }
//         console.log(iRow.Bank_Account__r.loan__Bank_Account_Number__c);
//         if((CRNNoValues!== null || CRNNoValues!==undefined) && !CRNNoValues.includes(iRow.Bank_Account__r.loan__Bank_Account_Number__c)){
//             incorrectRefinanceBank = true;
//         }
//         sumOfRefinanceOtherLoan+=iRow.Total_Balance__c;
//     });
// }
// console.log('sumOfRefinanceOtherLoan: '+sumOfRefinanceOtherLoan);
// console.log('Typeof(sumOfRefinanceOtherLoan): '+ typeof(sumOfRefinanceOtherLoan));
// console.log('incorrectRefinanceBank: '+incorrectRefinanceBank);
//SYM-3446 defect fix
// if((othLoanData === null || othLoanData === undefined) || ((Number(sumOfRefinanceOtherLoan)!== Number(applicationData.Refinance_Amount__c)) || (othLoanData.length !== BSBNoValues.length) || (incorrectRefinanceBank === true)) && applicationData.Refinance__c === true){
//     return displayMessage('Please Verify Refinance Loan details', 'ERROR');
// }
//console.log('applicationData.Broker_Application__c'+applicationData.Broker_Application__c);
//console.log('brokerCon.brk_AccreditationStatus__c '+brokerCon.brk_AccreditationStatus__c );
//console.log('brokerAcc.brk_AccreditationStatus__c '+brokerAcc.brk_AccreditationStatus__c );
// console.log('brokerAcc.Id '+brokerAcc.Id );
// console.log('brokerCon.AccountId '+brokerCon.AccountId);
// console.log('brokerCon.Id '+brokerCon.Id);
// console.log('brokerAcc Record'+brokerAcc.RecordTypeId);

if(applicationData.Broker_Application__c === true && brokerCon.brk_AccreditationStatus__c !== undefined && (brokerCon.brk_AccreditationStatus__c !=='Active' || brokerAcc.brk_AccreditationStatus__c !=='Active')){
    return displayMessage('Broker Accreditation Status is not Active. Contact Broker Support.','ERROR');
}
var colError=false;
if(loanType===true && AppLicationColateralModel!==null && AppLicationColateralModel!==undefined && topUp === false){ 
    $.each(AppLicationColateralModel.getRows(),function(i,iRow){
            if(iRow.Registration_State__c === undefined || iRow.Registration_State__c === null ){
                colError=true;
                return displayMessage('Please provide correct collateral details : Registration State', 'ERROR');
            }
            if(iRow.VIN_Chassis_Number__c === undefined || iRow.VIN_Chassis_Number__c === null){
                colError=true;
                return displayMessage('Please provide correct collateral details : 	VIN/Chassis Number', 'ERROR');
            }
            if(iRow.genesis__Collateral__r.clcommon__Make__c === undefined || iRow.genesis__Collateral__r.clcommon__Make__c === null ){
                colError=true;
                return displayMessage('Please provide correct collateral details : 	Make', 'ERROR');
            }
            if(iRow.genesis__Collateral__r.clcommon__Model__c === undefined || iRow.genesis__Collateral__r.clcommon__Model__c === null ){
                colError=true;
                return displayMessage('Please provide correct collateral details : 	Model', 'ERROR');
            }
            if(iRow.genesis__Collateral__r.clcommon__Year__c === undefined || iRow.genesis__Collateral__r.clcommon__Year__c === null ){
                colError=true;
                return displayMessage('Please provide correct collateral details : 	Year', 'ERROR');
            }
            if(iRow.genesis__Collateral__r.clcommon__Collateral_Type__c === undefined || iRow.genesis__Collateral__r.clcommon__Collateral_Type__c === null ){
                colError=true;
                return displayMessage('Please provide correct collateral details : 	Collateral Type', 'ERROR');
            }
        });
}
var totalPayeeAmount = 0;
if(applicationData.Broker_Application__c===true && applicationData.Product_Name__c==='Motor'){	
         if(payeeModel.data.length > 0){	
                for(var i=0; i<payeeModel.data.length;i++){	
                          if (payeeModel.data[i].Distribution_Amount__c === null || payeeModel.data[i].Distribution_Amount__c === undefined || payeeModel.data[i].Distribution_Amount__c<=0)   	
                                    { 	
                                      colError =true;	
                                      return displayMessage('Payee,s Payout Amount is missing .', 'ERROR');	
                                      break;	
                                    } else{
                                        totalPayeeAmount = totalPayeeAmount + payeeModel.data[i].Distribution_Amount__c;
                                    }	
                }	
                  //  console.log(' total sum'+total_policy_value);	
          }else{	
              colError =true;	
              return displayMessage('Payee is not provided', 'ERROR');	
          }	
 }
 console.log('totalPayeeAmount======='+totalPayeeAmount);
 var totalInsuranceAmt = 0;
 for(var i = 0; i<insuranceDef.data.length; i++){
     console.log('Value========='+insuranceDef.data[i].Policy_Value__c);
     if(insuranceDef.data[i].Policy_Value__c !== undefined && insuranceDef.data[i].Policy_Value__c !== null){
         totalInsuranceAmt = totalInsuranceAmt + insuranceDef.data[i].Policy_Value__c;
     }
 }
 console.log('totalInsuranceAmt======='+totalInsuranceAmt);
 var totalLoanAmt = totalPayeeAmount + totalInsuranceAmt;
 var ppsrRegFee=(applicationData.PPSR_Registration_Fee__c!==undefined && applicationData.PPSR_Registration_Fee__c!==null)?applicationData.PPSR_Registration_Fee__c:0;
 var ppsrSearchFee=(applicationData.PPSR_Search_Fee__c!==undefined && applicationData.PPSR_Search_Fee__c!==null)?applicationData.PPSR_Search_Fee__c:0;
 var brokerFee=(applicationData.broker_fee__c!==undefined && applicationData.broker_fee__c!==null)?applicationData.broker_fee__c:0;
 var lefFee=(applicationData.Loan_Establishment_Fee__c !== undefined && applicationData.Loan_Establishment_Fee__c!==null) ? applicationData.Loan_Establishment_Fee__c:0;
 var topUpPayoutAmnt=(applicationData.Top_Up_Payout_Amount__c!== undefined && applicationData.Top_Up_Payout_Amount__c!==null) ? applicationData.Top_Up_Payout_Amount__c:0;
 var loanAmountExcludingLef=applicationData.Total_Loan_Amount-lefFee;
 var topupLoanAmountExcludingLef=loanAmountExcludingLef - topUpPayoutAmnt;
 var sumOfDebtConsolLoan = (sumOfOtherLoans !== undefined && sumOfOtherLoans !== null)?sumOfOtherLoans:0;
 var newCashExcludingLef = applicationData.New_Cash__c - lefFee;
 var newCashExcludingLefBrokerFee = newCashExcludingLef - brokerFee;
 console.log('totalLoanAmt======='+totalLoanAmt);
 console.log('loanAmountExcludingLef======'+loanAmountExcludingLef);
 console.log('topupAmt ======'+applicationData.Top_Up_Amount__c);
if((productName === 'Motor Loan Fixed Rate' || productName === 'Motor Loan Variable Rate') && (((totalLoanAmt+ppsrRegFee+ppsrSearchFee+brokerFee) !== loanAmountExcludingLef) || (applicationData.genesis__Loan_Amount__c!==totalLoanAmt))){
    return displayMessage('Total disbursements amount does not match with the loan amount (including Broker fee, PPSR reg fee and PPSR search fee - if applicable) ', 'ERROR');
} 
else if((productName === 'Personal Loan Fixed Rate' ||  productName === 'Personal Loan Variable Rate') 
&& ((applicationData.Top_Up__c===false && applicationData.Broker_Application__c===false && applicationData.genesis__Loan_Amount__c!==loanAmountExcludingLef)
|| (applicationData.Top_Up__c===false && applicationData.Broker_Application__c===true && applicationData.genesis__Loan_Amount__c+brokerFee !== loanAmountExcludingLef)
|| (applicationData.Top_Up__c===true && applicationData.Broker_Application__c===false && (applicationData.Top_Up_Amount__c + lefFee !== applicationData.New_Cash__c || sumOfDebtConsolLoan > newCashExcludingLef))
|| (applicationData.Top_Up__c===true && applicationData.Broker_Application__c===true && (applicationData.Top_Up_Amount__c + lefFee + brokerFee !== applicationData.New_Cash__c  || sumOfDebtConsolLoan > newCashExcludingLefBrokerFee ))
)){
    return displayMessage('Total disbursements amount does not match with the loan amount (including Broker fee, PPSR reg fee and PPSR search fee - if applicable) ', 'ERROR');
}
else if((productName === 'Secured Personal Loan Fixed Rate' ||  productName === 'Secured Personal Loan Variable Rate') 
&&  ((applicationData.Top_Up__c===false && applicationData.Broker_Application__c===false && applicationData.genesis__Loan_Amount__c + ppsrRegFee + ppsrSearchFee !== loanAmountExcludingLef)
|| (applicationData.Top_Up__c===false && applicationData.Broker_Application__c===true && applicationData.genesis__Loan_Amount__c+ppsrRegFee+ppsrSearchFee+brokerFee !== loanAmountExcludingLef)
|| (applicationData.Top_Up__c===true && applicationData.Broker_Application__c===false && (applicationData.Top_Up_Amount__c + ppsrRegFee + ppsrSearchFee + lefFee !== applicationData.New_Cash__c || sumOfDebtConsolLoan + ppsrRegFee + ppsrSearchFee > newCashExcludingLef))
|| (applicationData.Top_Up__c===true && applicationData.Broker_Application__c===true && (applicationData.Top_Up_Amount__c + ppsrRegFee + ppsrSearchFee + lefFee + brokerFee !== applicationData.New_Cash__c  || sumOfDebtConsolLoan + ppsrRegFee + ppsrSearchFee > newCashExcludingLefBrokerFee ))
)){
    return displayMessage('Total disbursements amount does not match with the loan amount (including Broker fee, PPSR reg fee and PPSR search fee - if applicable) ', 'ERROR');
}

// ///****************************************LMAU-3100**************************************/
// if(applicationData.genesis__Loan_Amount__c >= 50000 && applicationData.broker_fee__c >2500){
//     return displayMessage('The Broker Fee cannot exceed $2500 for loan amounts greater than or equal to $50,000.', 'ERROR');
// }else if(applicationData.genesis__Loan_Amount__c >= 20000 && applicationData.broker_fee__c >2200){
//     return displayMessage('The Broker Fee cannot exceed $2200 for loan amounts between $20,000-$49,999.', 'ERROR');
// }else if(applicationData.genesis__Loan_Amount__c >= 10000 && applicationData.broker_fee__c >990){
//     return displayMessage('The Broker Fee cannot exceed $990 for loan amounts between $10,000-$19,999.', 'ERROR');
// }else if(applicationData.genesis__Loan_Amount__c >= 7501 && applicationData.broker_fee__c >750){
//     return displayMessage('The Broker Fee cannot exceed $750 for loan amounts between $7,501-$9,999.', 'ERROR');
// }else if(applicationData.genesis__Loan_Amount__c >= 5000 && applicationData.broker_fee__c >350){
//     return displayMessage('The Broker Fee cannot exceed $350 for loan amounts between $5,000-$7,500.', 'ERROR');
// }else if(applicationData.Top_Up__c == true){ //Need to confirm
//     return displayMessage('The Broker Fee cannot exceed $0 for loan amounts $4999 or less.', 'ERROR');
// }
// ///****************************************LMAU-3100**************************************/




///**************************************** For LMAU-3278 (Souvik Sen) ******************************************///

// For New Application
if (applicationData.Top_Up__c !== true && 
    applicationData.Sales_Channel__c === 'Broker' && 
    (applicationData.genesis__CL_Product_Name__c === 'Personal Loan Variable Rate' || 
     applicationData.genesis__CL_Product_Name__c === 'Personal Loan Fixed Rate')) {

    const loanAmount = applicationData.genesis__Loan_Amount__c;
    const brokerFee = applicationData.broker_fee__c;

    if (loanAmount >= 5000 && loanAmount <= 7499.99 && brokerFee > 200) {
        return displayMessage('The Broker Fee cannot exceed $200 for loan amounts between $5,000-$7,499.99', 'ERROR');
    }
    if (loanAmount >= 7500 && loanAmount <= 9999.99 && brokerFee > 650) {
        return displayMessage('The Broker Fee cannot exceed $650 for loan amounts between $7,500-$9,999.99', 'ERROR');
    }
    if (loanAmount >= 10000 && loanAmount <= 19999.99 && brokerFee > 990) {
        return displayMessage('The Broker Fee cannot exceed $990 for loan amounts between $10,000-$19,999.99', 'ERROR');
    }
    if (loanAmount >= 20000 && loanAmount <= 49999.99 && brokerFee > 2200) {
        return displayMessage('The Broker Fee cannot exceed $2,200 for loan amounts between $20,000-$49,999.99', 'ERROR');
    }
    if (loanAmount >= 50000 && brokerFee > 2500) {
        return displayMessage('The Broker Fee cannot exceed $2,500 for loan amounts greater than or equal to $50,000', 'ERROR');
    }
}

// For Motor Application
else if (applicationData.Top_Up__c !== true && 
    applicationData.Sales_Channel__c === 'Broker' && 
    (applicationData.genesis__CL_Product_Name__c === 'Motor Loan Variable Rate' || 
     applicationData.genesis__CL_Product_Name__c === 'Motor Loan Fixed Rate')) {

    const loanAmount = applicationData.Total_Loan_Amount__c;
    const brokerFee = applicationData.broker_fee__c;

    if (loanAmount >= 5000 && loanAmount <= 7499.99 && brokerFee > 200) {
        return displayMessage('The Broker Fee cannot exceed $200 for loan amounts between $5,000-$7,499.99', 'ERROR');
    }
    if (loanAmount >= 7500 && loanAmount <= 9999.99 && brokerFee > 650) {
        return displayMessage('The Broker Fee cannot exceed $650 for loan amounts between $7,500-$9,999.99', 'ERROR');
    }
    if (loanAmount >= 10000 && loanAmount <= 19999.99 && brokerFee > 990) {
        return displayMessage('The Broker Fee cannot exceed $990 for loan amounts between $10,000-$19,999.99', 'ERROR');
    }
    if (loanAmount >= 20000 && loanAmount <= 49999.99 && brokerFee > 2200) {
        return displayMessage('The Broker Fee cannot exceed $2,200 for loan amounts between $20,000-$49,999.99', 'ERROR');
    }
    if (loanAmount >= 50000 && brokerFee > 2500) {
        return displayMessage('The Broker Fee cannot exceed $2,500 for loan amounts greater than or equal to $50,000', 'ERROR');
    }
}


//For Topup Application
else if(applicationData.Top_Up__c === true && applicationData.Sales_Channel__c === 'Broker' ){
    const loanAmount = applicationData.New_Cash__c;
    const brokerFee = applicationData.broker_fee__c;

    if (loanAmount <= 4999.99 && brokerFee > 0) {
        return displayMessage('The Broker Fee cannot exceed $0 for loan amounts $4,999 or less', 'ERROR');
    }
    if (loanAmount >= 5000 && loanAmount <= 7499.99 && brokerFee > 200) {
        return displayMessage('The Broker Fee cannot exceed $200 for loan amounts between $5,000-$7,499.99', 'ERROR');
    }
    if (loanAmount >= 7500 && loanAmount <= 9999.99 && brokerFee > 650) {
        return displayMessage('The Broker Fee cannot exceed $650 for loan amounts between $7,500-$9,999.99', 'ERROR');
    }
    if (loanAmount >= 10000 && loanAmount <= 19999.99 && brokerFee > 990) {
        return displayMessage('The Broker Fee cannot exceed $990 for loan amounts between $10,000-$19,999.99', 'ERROR');
    }
    if (loanAmount >= 20000 && loanAmount <= 49999.99 && brokerFee > 2200) {
        return displayMessage('The Broker Fee cannot exceed $2,200 for loan amounts between $20,000-$49,999.99', 'ERROR');
    }
    if (loanAmount >= 50000 && brokerFee > 2500) {
        return displayMessage('The Broker Fee cannot exceed $2,500 for loan amounts greater than or equal to $50,000', 'ERROR');
    }
}
/////////////////////*********** End Here - LMAU-3278 - Souvik Sen ****************************/////////////////////////////////////////








console.log('we are here too =>' + colError);
console.log('applicationData2 =>' + applicationData2);
console.log('productName =>' + productName);
if(applicationData.genesis__Status__c !== null && applicationData.genesis__Status__c !== undefined && applicationData.genesis__Status__c === 'Approved'){
    return displayMessage('Application already Approved.', 'ERROR');
}else if(applicationData.genesis__Interest_Rate__c === null || applicationData.genesis__Interest_Rate__c === undefined){
    return displayMessage('The Interest Rate must not be lower than 5.75%. Please fix and submit for approval again.', 'ERROR');
}else if(applicationData.genesis__Interest_Rate__c < 5.75){
    return displayMessage('The Interest Rate must not be lower than 5.75%. Please fix and submit for approval again.', 'ERROR');
}else if(applicationData.Bank_Calculated_UMI__c === null || applicationData.Bank_Calculated_UMI__c === undefined ){
    return displayMessage('The Capacity must not be lower than $1. Please fix and submit for approval again.', 'ERROR');
}else if(applicationData.Bank_Calculated_UMI__c < 1){
    return displayMessage('The Capacity must not be lower than $1. Please fix and submit for approval again.', 'ERROR');
}else if((applicationData2 ===undefined || applicationData2 ===null) && (productName !== 'Motor Loan Fixed Rate' && productName !=='Motor Loan Variable Rate' && productName !=='Personal Loan Variable Rate' && productName !=='Personal Loan Fixed Rate')){
    return displayMessage('Please provide correct collateral details : Collateral Owner', 'ERROR');
}else{
 if(colError === false){
    if(applicationData.Product_Name__c==='Motor') {
        applicationModel.updateRow(applicationData,{
             genesis__Status__c: 'Approved',
             Portal_Page__c : 'Approved',
             AdobeSignParty__c : '',
             OwnerId : userInfoData.Id
        });
    }
    else{
        applicationModel.updateRow(applicationData,{
             genesis__Status__c: 'Approved',
             Portal_Page__c : 'Approved',
             AdobeSignParty__c : '',
        });
    }
}
}
// Update Application Status As Approved

if(applicationData.Broker_Application__c === true){
    applicationModel.updateRow(applicationData,{
             OwnerId: partyData.clcommon__User__c
});
}
else{
    applicationModel.updateRow(applicationData,{
            OwnerId: cctQueueData.Id
});
}
applicationModel.save();


