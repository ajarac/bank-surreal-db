import { TransactionType } from './transaction-type';
import { Transaction } from './Transaction';
import { AccountInsufficientFundsException } from './exceptions/account-insufficient-funds.exception';
import { Money } from 'ts-money';

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
	public money: Money;
	public readonly createdAt: Date;
	public updatedAt: Date;

	constructor(args: AccountArgs) {
		this.id = args.id;
		this.userId = args.userId;
		this.name = args.name;
		this.money = Money.fromDecimal(args.balance, args.currency);
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
			case TransactionType.DEPOSIT:
				this.money.add(transaction.money);
				break;
			case TransactionType.WITHDRAWAL:
				if (this.money.amount < transaction.money.amount) {
					throw new AccountInsufficientFundsException(this.id);
				}
				this.money.subtract(transaction.money);
				break;
		}
		this.updatedAt = new Date();
	}

	public getBalance(): number {
		return this.money.amount;
	}
}
