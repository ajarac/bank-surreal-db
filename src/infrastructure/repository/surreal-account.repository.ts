import { Injectable } from '@nestjs/common';
import { AccountRepository } from '@application/providers/account.repository';
import { Transaction } from '@domain/Transaction';
import { Account } from '@domain/Account';
import { Nullable } from '@shared/types/nullable';
import { PaginationResponse } from '@application/dto/pagination.response';
import * as crypto from 'crypto';
import Surreal from 'surrealdb.js';
import { SurrealTransaction, SurrealTransactionMapper } from '@infrastructure/repository/surreal-transaction';
import { SurrealAccount, SurrealAccountMapper } from '@infrastructure/repository/surreal-account';

const ACCOUNTS_TABLE = 'accounts';
const TRANSACTIONS_TABLE = 'transactions';

@Injectable()
export class SurrealAccountRepository implements AccountRepository {
	constructor(private readonly surrealDB: Surreal) {}

	private static accountIdReference(accountId: string): string {
		return `${ACCOUNTS_TABLE}:${accountId}`;
	}

	private static transactionIdReference(transactionId: string): string {
		return `${TRANSACTIONS_TABLE}:${transactionId}`;
	}

	generateId(): string {
		return crypto.randomUUID();
	}

	async addTransaction(transaction: Transaction): Promise<void> {
		const surrealTransaction = SurrealTransactionMapper.fromDomain(transaction);
		await this.surrealDB.create<SurrealTransaction>(SurrealAccountRepository.transactionIdReference(transaction.id), surrealTransaction);
	}

	async createAccount(account: Account): Promise<void> {
		const surrealAccount = SurrealAccountMapper.fromDomain(account);
		const result = await this.surrealDB.create<SurrealAccount>(ACCOUNTS_TABLE, surrealAccount);
		console.log('result', result);
	}

	async deleteAccountById(AccountId: string): Promise<void> {
		await this.surrealDB.delete(SurrealAccountRepository.accountIdReference(AccountId));
	}

	async getAccountById(accountId: string): Promise<Nullable<Account>> {
		const surrealAccounts = await this.surrealDB.select<SurrealAccount>(SurrealAccountRepository.accountIdReference(accountId));
		if (surrealAccounts.length == 0) {
			return null;
		}
		return SurrealAccountMapper.toDomain(surrealAccounts[0]);
	}

	async getAccountsByUserId(userId: string): Promise<Account[]> {
		const query = `SELECT *
                   FROM ${ACCOUNTS_TABLE}
                   WHERE userId = $userId`;
		const surrealAccounts = await this.surrealDB.query<[SurrealAccount[]]>(query, { userId });
		return surrealAccounts[0].result.map((surrealAccount) => SurrealAccountMapper.toDomain(surrealAccount));
	}

	async getTransactionsByAccountId(accountId: string, page: number, limit: number): Promise<PaginationResponse<Transaction>> {
		const query = `SELECT *
                   FROM ${TRANSACTIONS_TABLE}
                   WHERE accountId = $accountId LIMIT $limit
                   OFFSET $offset`;
		const totalQuery = `SELECT COUNT(*)
                        FROM ${TRANSACTIONS_TABLE}
                        WHERE accountId = $accountId`;
		const [surrealTransactions, total] = await this.surrealDB.query<
			[
				SurrealTransaction[],
				{
					count: number;
				}[],
			]
		>(`${query};${totalQuery}`, {
			accountId,
			limit,
			offset: page * limit,
		});
		return {
			total: total.result[0].count,
			result: surrealTransactions.result.map((surrealTransaction) => SurrealTransactionMapper.toDomain(surrealTransaction)),
		};
	}

	async saveAccount(account: Account): Promise<void> {
		const surrealAccount = SurrealAccountMapper.fromDomain(account);
		await this.surrealDB.update<SurrealAccount>(SurrealAccountRepository.accountIdReference(account.id), surrealAccount);
	}
}
