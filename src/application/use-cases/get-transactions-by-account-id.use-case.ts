import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_REPOSITORY_TOKEN, AccountRepository } from '@application/providers/account.repository';
import { Transaction } from '@domain/Transaction';
import { PaginationResponse } from '@application/dto/pagination.response';

@Injectable()
export class GetTransactionsByAccountIdUseCase {
	constructor(@Inject(ACCOUNT_REPOSITORY_TOKEN) private readonly repository: AccountRepository) {}

	get(accountId: string, page: number, limit: number): Promise<PaginationResponse<Transaction>> {
		return this.repository.getTransactionsByAccountId(accountId, page, limit);
	}
}
