import { Controller, Get, Param } from '@nestjs/common';
import { GetAccountsByUserUseCase } from '@application/use-cases/get-accounts-by-user.use-case';
import { Account } from '@domain/Account';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class GetAccountsByUserIdParams {
	@IsString()
	@ApiProperty()
	userId: string;
}

@Controller('users')
export class GetAccountsByUserIdController {
	constructor(private readonly getAccountsByUserIdUseCase: GetAccountsByUserUseCase) {}

	@Get(':userId/accounts')
	getAccountsByUserId(@Param() { userId }: GetAccountsByUserIdParams): Promise<Account[]> {
		return this.getAccountsByUserIdUseCase.get(userId);
	}
}
