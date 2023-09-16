import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_REPOSITORY_TOKEN, AccountRepository } from '@application/providers/account.repository';
import { AccountNotFoundException } from '@domain/exceptions/account-not-found.exception';
import { AccountWithBalanceCanNotBeDeletedException } from '@domain/exceptions/account-with-balance-can-not-be-deleted.exception';

@Injectable()
export class DeleteAccountUseCase {
	constructor(@Inject(ACCOUNT_REPOSITORY_TOKEN) private readonly repository: AccountRepository) {}

	async delete(accountId: string): Promise<void> {
		const account = await this.repository.getAccountById(accountId);

		if (account == null) {
			throw new AccountNotFoundException(accountId);
		}

		if (account.getBalance()) {
			throw new AccountWithBalanceCanNotBeDeletedException(accountId);
		}

		await this.repository.deleteAccountById(accountId);
	}
}
