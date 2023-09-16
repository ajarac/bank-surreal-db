import { Controller, Delete, Param } from '@nestjs/common';
import { DeleteAccountUseCase } from '@application/use-cases/delete-account.use-case';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class DeleteAccountParams {
	@ApiProperty()
	@IsString()
	accountId: string;
}

@Controller('accounts')
export class DeleteAccountController {
	constructor(private readonly deleteAccountUseCase: DeleteAccountUseCase) {}

	@Delete(':accountId')
	deleteAccount(@Param() { accountId }: DeleteAccountParams): Promise<void> {
		return this.deleteAccountUseCase.delete(accountId);
	}
}
