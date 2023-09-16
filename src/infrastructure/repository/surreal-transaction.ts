import { TransactionType } from '@domain/transaction-type';
import { Transaction } from '@domain/Transaction';

export interface SurrealTransaction extends Record<string | number | symbol, unknown> {
	id: string;
	accountId: string;
	amount: number;
	currency: string;
	type: TransactionType;
	description: string;
	createdAt: Date;
}

export class SurrealTransactionMapper {
	static toDomain(surrealDBTransaction: SurrealTransaction): Transaction {
		return new Transaction({
			id: surrealDBTransaction.id,
			accountId: surrealDBTransaction.accountId,
			amount: surrealDBTransaction.amount,
			type: surrealDBTransaction.type,
			currency: surrealDBTransaction.currency,
			description: surrealDBTransaction.description,
			createdAt: surrealDBTransaction.createdAt,
		});
	}

	static fromDomain(transaction: Transaction): SurrealTransaction {
		return {
			id: transaction.id,
			accountId: transaction.accountId,
			amount: transaction.amount,
			currency: transaction.currency,
			type: transaction.type,
			description: transaction.description,
			createdAt: transaction.createdAt,
		};
	}
}
