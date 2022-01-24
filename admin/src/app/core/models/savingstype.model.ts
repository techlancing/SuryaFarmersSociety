export class SavingsType {
    constructor(
        public sAccountNo : string = '',
        public nSavingsId : number = null,
        public nDepositAmount : number = null,
        public nIntrest : number = null,
        public nSavingDays : number = null ,
        public nSavingMonths : number = null,
       // public nSavingDays : number = null,
        public nMaturityAmount : number = null,
        public sMonthInterestAddDate : string ='',
        public sTransactionId : string = '',//unique: true},  
        public sStartDate : string = '',
        public sMaturityDate : string ='',   
        public sRepaymentDate : string ='',
        public nSavingTotalYears : number = null,
        public nSavingTotalDays : number =null ,
        public sPensionInterestAddDate : string = '', 
        public nPensionInterestAddAmount : number = null,
        public nPensionAmountMonths : number =null ,    
        public sTypeofSavings : string = '',           
        public sEmployeeName : string = '',
        public sPensionDepositInterestOnAccount : string = '',
        public oTransactionInfo: any = null
    ){}
}