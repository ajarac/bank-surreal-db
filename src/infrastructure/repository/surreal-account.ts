import { Account } from '@domain/Account';

export const ACCOUNTS_TABLE = 'account';

export interface SurrealAccount extends Record<string | number | symbol, unknown> {
	id: string;
	name: string;
	userId: string;
	amount: number;
	currency: string;
	createdAt: Date;
	updatedAt: Date;
}

export class SurrealAccountMapper {
	public static idReference(id: string): string {
		return `${ACCOUNTS_TABLE}:${id}`;
	}

	public static toDomain(surrealAccount: SurrealAccount): Account {
		return new Account({
			id: surrealAccount.id.replace(`${ACCOUNTS_TABLE}:`, ''),
			userId: surrealAccount.userId,
			name: surrealAccount.name,
			balance: surrealAccount.amount,
			currency: surrealAccount.currency,
			createdAt: surrealAccount.createdAt,
			updatedAt: surrealAccount.updatedAt,
		});
	}

	public static fromDomain(account: Account): SurrealAccount {
		return {
			id: this.idReference(account.id),
			name: account.name,
			userId: account.userId,
			amount: account.getBalance(),
			currency: account.getCurrency(),
			createdAt: account.createdAt,
			updatedAt: account.updatedAt,
		};
	}
}
