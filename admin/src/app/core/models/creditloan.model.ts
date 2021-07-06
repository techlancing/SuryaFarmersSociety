import { ImageInfo } from './image.model';
export class CreditLoan {
    constructor(
        public sAccountNo : string = '',
        public nSanctionAmount : number = null,        
        public sTransactionId : string = '',//unique: true},        
        public sDate : string = '',        
        public sTypeofLoan : string = '',
        public sInstallmentType : string = '',
        public sLoanRepaymentPeriod : string = '',
        public nInstallmentAmount : number = null, 
        public sEndofLoanDate : string = '',       
        public nLetPenaltyPercentage : number = null,        
        public sEmployeeName : string = '',
        
    ) {

    }
}
