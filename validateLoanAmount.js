var params = arguments[0],
$ = skuid.$;
var app=skuid.model.getModel('Application');
var applicationData=app.getFirstRow();

var displayMessage = function (message, severity) {
    console.log(message);
    console.log(severity);

    var pageTitle = $('#app-tab'); 
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

if(applicationData.Top_Up__c === true){
    if((applicationData.genesis__Loan_Amount__c < 5000)
    || ((applicationData.CL_Contract__r.loan__Pay_Off_Amount_As_Of_Today__c !== null) 
    && ((applicationData.CL_Contract__r.loan__Pay_Off_Amount_As_Of_Today__c + applicationData.Top_Up_Amount__c) < 5000))){
        return displayMessage('The total loan amount (excluding the Loan Establishment Fee) must be at least $5,000. Please adjust the top-up amount if you wish to proceed.', 'ERROR');
    }
}



///**************************************** For LMAU-3278- Souvik Sen- (SKIUD PAGE Latitude_CustomApplicationDetails) ******************************************///

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

///**************************************** End Here LMAU-3278- Souvik Sen- (SKIUD PAGE Latitude_CustomApplicationDetails) ******************************************///
