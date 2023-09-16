import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_REPOSITORY_TOKEN, AccountRepository } from '../providers/account.repository';
import { Account } from '../../domain/Account';

@Injectable()
export class GetAccountsByUserUseCase {
	constructor(@Inject(ACCOUNT_REPOSITORY_TOKEN) private readonly repository: AccountRepository) {}

	async get(userId: string): Promise<Account> {
		return this.repository.getAccountsByUserId(userId);
	}
}
