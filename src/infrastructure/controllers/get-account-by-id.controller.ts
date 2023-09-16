import { Controller, Get, Param } from '@nestjs/common';
import { GetAccountByIdUseCase } from '@application/use-cases/get-account-by-id.use-case';
import { Account } from '@domain/Account';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class GetAccountByIdParams {
	@IsString()
	@ApiProperty()
	accountId: string;
}

@Controller('accounts')
export class GetAccountByIdController {
	constructor(private readonly getAccountByIdUseCase: GetAccountByIdUseCase) {}

	@Get(':accountId')
	getAccountById(@Param() { accountId }: GetAccountByIdParams): Promise<Account> {
		return this.getAccountByIdUseCase.get(accountId);
	}
}
