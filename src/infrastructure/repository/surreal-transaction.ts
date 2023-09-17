import { TransactionType } from '@domain/transaction-type';
import { Transaction } from '@domain/Transaction';

export const TRANSACTIONS_TABLE = 'transaction';

export interface SurrealTransaction extends Record<string | number | symbol, unknown> {
	id: string;
	amount: number;
	currency: string;
	type: TransactionType;
	description: string;
	createdAt: Date;
}

export class SurrealTransactionMapper {
	public static idReference(id: string): string {
		return `${TRANSACTIONS_TABLE}:${id}`;
	}

	static toDomain(surrealDBTransaction: SurrealTransaction, accountId: string): Transaction {
		return new Transaction({
			id: surrealDBTransaction.id.replace(`${TRANSACTIONS_TABLE}:`, ''),
			accountId,
			amount: surrealDBTransaction.amount,
			type: surrealDBTransaction.type,
			currency: surrealDBTransaction.currency,
			description: surrealDBTransaction.description,
			createdAt: surrealDBTransaction.createdAt,
		});
	}

	static fromDomain(transaction: Transaction): SurrealTransaction {
		return {
			id: this.idReference(transaction.id),
			amount: transaction.amount,
			currency: transaction.currency,
			type: transaction.type,
			description: transaction.description,
			createdAt: transaction.createdAt,
		};
	}
}
