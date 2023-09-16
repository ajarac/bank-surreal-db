import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_REPOSITORY_TOKEN, AccountRepository } from '../providers/account.repository';
import { Account } from '@domain/Account';

export interface CreateAccountCommand {
	readonly userId: string;
	readonly name: string;
	readonly currency: string;
}

@Injectable()
export class CreateAccountUseCase {
	constructor(@Inject(ACCOUNT_REPOSITORY_TOKEN) private readonly repository: AccountRepository) {}

	async create(command: CreateAccountCommand): Promise<void> {
		const account = Account.create({
			id: this.repository.generateId(),
			userId: command.userId,
			name: command.name,
			currency: command.currency,
		});

		await this.repository.createAccount(account);
	}
}
