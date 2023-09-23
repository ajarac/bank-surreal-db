import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AccountRepository } from '@application/providers/account.repository';
import { Transaction } from '@domain/Transaction';
import { Account } from '@domain/Account';
import { Nullable } from '@shared/types/nullable';
import { PaginationResponse } from '@application/dto/pagination.response';
import Surreal from 'surrealdb.js';
import { SurrealTransaction, SurrealTransactionMapper, TRANSACTIONS_TABLE } from '@infrastructure/repository/surreal-transaction';
import { ACCOUNTS_TABLE, SurrealAccount, SurrealAccountMapper } from '@infrastructure/repository/surreal-account';

type SurrealAccountQueryResultPagination = [{ transaction: SurrealTransaction }[], { count: number }[]];

const TRANSACTED_RELATION = 'transacted';

@Injectable()
export class SurrealAccountRepository implements AccountRepository, OnApplicationBootstrap {
	constructor(private readonly surrealDB: Surreal) {}

	onApplicationBootstrap() {
		const accountTransactionRelationshipIndex = `define index account_transaction_relationships on table ${TRANSACTIONS_TABLE} columns in, out UNIQUE`;
		const translatedWhenIndex = `define index transacted_when on table ${TRANSACTIONS_TABLE} columns when`;
		this.surrealDB
			.query(`${accountTransactionRelationshipIndex};${translatedWhenIndex}`)
			.then(() => console.log('Added surreal db indexes'));
	}

	generateId(): string {
		return String(Date.now().toString(32) + Math.random().toString(16)).replace(/\./g, '');
	}

	async addTransaction(transaction: Transaction): Promise<void> {
		const surrealTransaction = SurrealTransactionMapper.fromDomain(transaction);
		const [transactionCreated] = await this.surrealDB.create<SurrealTransaction>(TRANSACTIONS_TABLE, surrealTransaction);
		const accountReference = SurrealAccountMapper.idReference(transaction.accountId);
		await this.surrealDB.query(`RELATE ${accountReference}->${TRANSACTED_RELATION}->${transactionCreated.id} SET when = time::now();`);
	}

	async createAccount(account: Account): Promise<void> {
		const surrealAccount = SurrealAccountMapper.fromDomain(account);
		await this.surrealDB.create<SurrealAccount>(ACCOUNTS_TABLE, surrealAccount);
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
		const paginationQuery = `SELECT when, out.* as transaction FROM ${TRANSACTED_RELATION} WHERE in = $accountId ORDER BY when DESC LIMIT $limit START $start`;
		const totalQuery = `SELECT count() FROM ${TRANSACTED_RELATION} WHERE in = $accountId group all`;
		const variablesQuery = {
			accountId: SurrealAccountMapper.idReference(accountId),
			limit: limit,
			start: (page - 1) * limit,
		};
		const [surrealTransactions, total] = await this.surrealDB.query<SurrealAccountQueryResultPagination>(
			`${paginationQuery};${totalQuery}`,
			variablesQuery,
		);
		return {
			total: total.result[0].count,
			result: surrealTransactions.result.map(({ transaction }) => SurrealTransactionMapper.toDomain(transaction, accountId)),
		};
	}

	async saveAccount(account: Account): Promise<void> {
		const surrealAccount = SurrealAccountMapper.fromDomain(account);
		await this.surrealDB.merge<SurrealAccount>(SurrealAccountMapper.idReference(account.id), surrealAccount);
	}
}
