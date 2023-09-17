import { Injectable } from '@nestjs/common';
import { AccountRepository } from '@application/providers/account.repository';
import { Transaction } from '@domain/Transaction';
import { Account } from '@domain/Account';
import { Nullable } from '@shared/types/nullable';
import { PaginationResponse } from '@application/dto/pagination.response';
import Surreal from 'surrealdb.js';
import { SurrealTransaction, SurrealTransactionMapper, TRANSACTIONS_TABLE } from '@infrastructure/repository/surreal-transaction';
import { ACCOUNTS_TABLE, SurrealAccount, SurrealAccountMapper } from '@infrastructure/repository/surreal-account';

@Injectable()
export class SurrealAccountRepository implements AccountRepository {
	constructor(private readonly surrealDB: Surreal) {}

	generateId(): string {
		return '';
	}

	async addTransaction(transaction: Transaction): Promise<void> {
		const { id, ...surrealTransaction } = SurrealTransactionMapper.fromDomain(transaction);
		const [transactionCreated] = await this.surrealDB.create<Omit<SurrealTransaction, 'id'>>(TRANSACTIONS_TABLE, surrealTransaction);
		const accountReference = SurrealAccountMapper.idReference(transaction.accountId);
		await this.surrealDB.query(`RELATE ${accountReference}->transacted->${transactionCreated.id} SET when = time::now();`);
	}

	async createAccount(account: Account): Promise<void> {
		const { id, ...surrealAccount } = SurrealAccountMapper.fromDomain(account);
		await this.surrealDB.create<Omit<SurrealAccount, 'id'>>(ACCOUNTS_TABLE, surrealAccount);
	}

	async deleteAccountById(AccountId: string): Promise<void> {
		await this.surrealDB.delete(SurrealAccountMapper.idReference(AccountId));
	}

	async getAccountById(accountId: string): Promise<Nullable<Account>> {
		const surrealAccounts = await this.surrealDB.select<SurrealAccount>(SurrealAccountMapper.idReference(accountId));
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
		const whereStatement = 'where $accountId->transacted->transaction';
		const query = `select * from transaction ${whereStatement} LIMIT $limit START $start`;
		const totalQuery = `SELECT COUNT() FROM ${TRANSACTIONS_TABLE} ${whereStatement} group all`;
		const [surrealTransactions, total] = await this.surrealDB.query<
			[
				SurrealTransaction[],
				{
					count: number;
				}[],
			]
		>(`${query};${totalQuery}`, {
			accountId: SurrealAccountMapper.idReference(accountId),
			limit: limit,
			start: (page - 1) * limit,
		});
		return {
			total: total.result[0].count,
			result: surrealTransactions.result.map((surrealTransaction) => SurrealTransactionMapper.toDomain(surrealTransaction, accountId)),
		};
	}

	async saveAccount(account: Account): Promise<void> {
		const surrealAccount = SurrealAccountMapper.fromDomain(account);
		await this.surrealDB.merge<SurrealAccount>(SurrealAccountMapper.idReference(account.id), surrealAccount);
	}
}
