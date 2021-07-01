// Table data
export interface Table {
    name: string;
    position: string;
    office: string;
    age: number;
    date: string;
    salary: string;
}
import { BankAccount } from '../../../core/models/bankaccount.model';
// Search Data
export interface SearchResult {
    tables: BankAccount[];
    total: number;
}
