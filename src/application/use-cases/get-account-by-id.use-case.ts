import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_REPOSITORY_TOKEN, AccountRepository } from '../providers/account.repository';
import { Account } from '@domain/Account';
import { Nullable } from '@shared/types/nullable';
import { AccountNotFoundException } from '@domain/exceptions/account-not-found.exception';

@Injectable()
export class GetAccountByIdUseCase {
	constructor(@Inject(ACCOUNT_REPOSITORY_TOKEN) private readonly repository: AccountRepository) {}

	async get(accountId: string): Promise<Account> {
		const account: Nullable<Account> = await this.repository.getAccountById(accountId);

		if (account == null) {
			throw new AccountNotFoundException(accountId);
		}

		return account;
	}
}
