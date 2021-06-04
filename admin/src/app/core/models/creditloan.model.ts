import { ImageInfo } from './image.model';
export class CreditLoan {
    constructor(
        public sSanctionAmount : string = '',        
        public sTransactionId : number = null,//unique: true},        
        public sDate : string = '',        
        public sTypeofLoan : string = '',
        public sInstallmentType : string = '',
        public sLoanRepaymentPeriod : string = '',
        public sInstallmentAmount : string = '',        
        public sLetPenaltyPercentage : string = '',        
        public sEmployeeName : string = '',
        
    ) {

    }
}
