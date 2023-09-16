import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetTransactionsByAccountIdUseCase } from '@application/use-cases/get-transactions-by-account-id.use-case';
import { IsNumber, IsPositive, IsString, Max } from 'class-validator';
import { Transaction } from '@domain/Transaction';
import { PaginationResponse } from '@application/dto/pagination.response';
import { ApiProperty } from '@nestjs/swagger';

class PaginationQueryParams {
	@IsNumber()
	@IsPositive()
	page: number;

	@IsNumber()
	@Max(100)
	@IsPositive()
	limit: number;
}

class TransactionsByAccountIdParams {
	@IsString()
	@ApiProperty()
	accountId: string;
}

@Controller('accounts')
export class TransactionsController {
	constructor(private readonly getTransactionsByAccountIdUseCase: GetTransactionsByAccountIdUseCase) {}

	@Get(':accountId/transactions')
	getTransactionsByAccountId(
		@Query() queryParams: PaginationQueryParams,
		@Param() { accountId }: TransactionsByAccountIdParams,
	): Promise<PaginationResponse<Transaction>> {
		const { page, limit } = queryParams;
		return this.getTransactionsByAccountIdUseCase.get(accountId, page, limit);
	}
}
