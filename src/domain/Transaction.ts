import { TransactionType } from './transaction-type';
import { Money } from 'ts-money';

export interface TransactionArgs {
	id: string;
	accountId: string;
	amount: number;
	currency: string;
	type: TransactionType;
	description: string;
	createdAt: Date;
}

export type CreateTransactionArgs = Omit<TransactionArgs, 'createdAt'>;

export class Transaction {
	public readonly id: string;
	public readonly accountId: string;
	public readonly money: Money;
	public readonly type: TransactionType;
	public readonly description: string;
	public readonly createdAt: Date;

	constructor(args: TransactionArgs) {
		this.id = args.id;
		this.accountId = args.accountId;
		this.money = Money.fromDecimal(args.amount, args.currency);
		this.type = args.type;
		this.description = args.description;
		this.createdAt = args.createdAt;
	}

	public static create(transactionCreateArgs: CreateTransactionArgs): Transaction {
		return new Transaction({
			id: transactionCreateArgs.id,
			accountId: transactionCreateArgs.accountId,
			amount: transactionCreateArgs.amount,
			type: transactionCreateArgs.type,
			currency: transactionCreateArgs.currency,
			description: transactionCreateArgs.description,
			createdAt: new Date(),
		});
	}
}
