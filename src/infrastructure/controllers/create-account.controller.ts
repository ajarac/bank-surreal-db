import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountCommand, CreateAccountUseCase } from '@application/use-cases/create-account.use-case';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiBody, ApiProperty } from '@nestjs/swagger';

class CreateAccountRequestBody implements CreateAccountCommand {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	userId: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	currency: string;
}

@Controller('account')
export class CreateAccountController {
	constructor(private readonly createAccountUseCase: CreateAccountUseCase) {}

	@Post()
	@ApiBody({ type: CreateAccountRequestBody })
	createAccount(@Body() body: CreateAccountRequestBody): Promise<void> {
		return this.createAccountUseCase.create(body);
	}
}
