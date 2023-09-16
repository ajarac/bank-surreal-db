import { Account } from '@domain/Account';
import { Transaction } from '@domain/Transaction';
import { Nullable } from '@shared/types/nullable';
import { PaginationResponse } from '@application/dto/pagination.response';

export const ACCOUNT_REPOSITORY_TOKEN = Symbol('ACCOUNT_REPOSITORY_TOKEN');

export interface AccountRepository {
	generateId(): string;

	createAccount(account: Account): Promise<void>;

	getAccountsByUserId(userId: string): Promise<Account[]>;

	getAccountById(accountId: string): Promise<Nullable<Account>>;

	saveAccount(account: Account): Promise<void>;

	deleteAccountById(AccountId: string): Promise<void>;

	addTransaction(transaction: Transaction): Promise<void>;

	getTransactionsByAccountId(accountId: string, page: number, limit: number): Promise<PaginationResponse<Transaction>>;
}
