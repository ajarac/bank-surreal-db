import { Body, Controller, Post } from '@nestjs/common';
import { AddTransactionCommand, AddTransactionUseCase } from '@application/use-cases/add-transaction.use-case';
import { TransactionType } from '@domain/transaction-type';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiBody, ApiProperty } from '@nestjs/swagger';

class AddTransactionRequestBody implements AddTransactionCommand {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	accountId: string;

	@IsNumber()
	@IsPositive()
	@ApiProperty()
	amount: number;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	currency: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	description: string;

	@IsEnum(TransactionType)
	@IsNotEmpty()
	@ApiProperty({ enum: TransactionType })
	type: TransactionType;
}

@Controller('transactions')
export class AddTransactionController {
	constructor(private readonly addTransactionUseCase: AddTransactionUseCase) {}

	@Post()
	@ApiBody({ type: AddTransactionRequestBody })
	addTransaction(@Body() body: AddTransactionRequestBody): Promise<void> {
		return this.addTransactionUseCase.add(body);
	}
}
