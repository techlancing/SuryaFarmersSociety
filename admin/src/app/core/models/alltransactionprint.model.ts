import { ImageInfo } from './image.model';
export class  AllTransactionPrint {
    constructor(
        public sAddress : string = '',
        public sNomineeName : string = '',        
        public sAccountNo : string = null,
        public sDate : string = '',
        public sCustomerName : string = '',
        public sAadharNo : string = '',
        public sSerialId : string = '',        
        public sAccountType : string = '',        
        public sFatherOrHusbandName : string = '',        
        public sEndOfTheLoan : string = '',
        public sSerialID : string = '',        
        public sMobileNumber : string = '',
        public sTypeOfAccount : string = '',
        public sAccountCategory : string = '',
        public sTypesOfShare : string = '',
        public sTypeOfLoan : string = '',
        public sSanctionAmount: string = '',
        public sInstallmentTypes : string = '',
        public sLoanRepaymentPeriod : string = '',

    ) {

    }
}