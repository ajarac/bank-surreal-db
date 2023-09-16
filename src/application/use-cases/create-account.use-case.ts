import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_REPOSITORY_TOKEN, AccountRepository } from '../providers/account.repository';
import { Account } from '../../domain/Account';

export class CreateAccountCommand {
	constructor(public readonly userId: string, public readonly name: string, public readonly currency: string) {}
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
