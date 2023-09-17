import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_REPOSITORY_TOKEN, AccountRepository } from '@application/providers/account.repository';
import { CreateTransactionArgs, Transaction } from '@domain/Transaction';
import { AccountNotFoundException } from '@domain/exceptions/account-not-found.exception';

export type AddTransactionCommand = Omit<CreateTransactionArgs, 'id'>;

@Injectable()
export class AddTransactionUseCase {
	constructor(@Inject(ACCOUNT_REPOSITORY_TOKEN) private readonly repository: AccountRepository) {}

	async add(command: AddTransactionCommand): Promise<void> {
		const account = await this.repository.getAccountById(command.accountId);

		if (account == null) {
			throw new AccountNotFoundException(command.accountId);
		}
		const id = this.repository.generateId();
		const transaction = Transaction.create({ id, ...command });
		account.addTransaction(transaction);

		await this.repository.saveAccount(account);
		await this.repository.addTransaction(transaction);
	}
}
