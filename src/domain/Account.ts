import { TransactionType } from './transaction-type';
import { Transaction } from './Transaction';
import { AccountInsufficientFundsException } from './exceptions/account-insufficient-funds.exception';

export interface AccountArgs {
	id: string;
	userId: string;
	name: string;
	balance: number;
	currency: string;
	createdAt: Date;
	updatedAt: Date;
}

export type CreateAccountArgs = Pick<AccountArgs, 'id' | 'userId' | 'name' | 'currency'>;

export class Account {
	public readonly id: string;
	public readonly userId: string;
	public readonly name: string;
	public balance: number;
	public readonly currency: string;
	public readonly createdAt: Date;
	public updatedAt: Date;

	constructor(args: AccountArgs) {
		this.id = args.id;
		this.userId = args.userId;
		this.name = args.name;
		this.balance = args.balance;
		this.currency = args.currency;
		this.createdAt = args.createdAt;
		this.updatedAt = args.updatedAt;
	}

	static create(args: CreateAccountArgs): Account {
		return new Account({
			id: args.id,
			userId: args.userId,
			name: args.name,
			balance: 0,
			currency: args.currency,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	public addTransaction(transaction: Transaction): void {
		switch (transaction.type) {
			case TransactionType.CREDIT:
				this.balance += transaction.amount;
				break;
			case TransactionType.DEBIT:
				if (this.balance < transaction.amount) {
					throw new AccountInsufficientFundsException(this.id);
				}
				this.balance -= transaction.amount;
				break;
		}
		this.updatedAt = new Date();
	}

	public getBalance(): number {
		return this.balance;
	}

	public getCurrency(): string {
		return this.currency;
	}
}
