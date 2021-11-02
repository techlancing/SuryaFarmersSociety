import { ImageInfo } from './image.model';
export class CreditLoan {
    constructor(
        public sAccountNo : string = '',
        public nLoanId : number = null,
        public nSanctionAmount : number = null,
        public nIntrest : number = null,
        public nLoanMonths : number = null,
        public nLoanDays : number = null,
        public nTotalAmount : number = null,
        public sTransactionId : string = '',//unique: true},  
        public sDate : string = '',        
        public sTypeofLoan : string = '',
        public sInstallmentType : string = '',
        public nLoanRepaymentPeriod : number = null,
        public nInstallmentAmount : number = null, 
        public sEndofLoanDate : string = '',       
        public nLetPenaltyPercentage : number = null,        
        public sEmployeeName : string = '',
        public oTransactionInfo: any = null
        
    ) {

    }
}
