import { Catch, HttpStatus } from '@nestjs/common';
import { AccountInsufficientFundsException } from '@domain/exceptions/account-insufficient-funds.exception';
import { BaseCatchException } from '@infrastructure/catch-exceptions/base-catch.exception';

@Catch(AccountInsufficientFundsException)
export class CatchAccountInsufficientFundsException extends BaseCatchException {
	constructor() {
		super(HttpStatus.BAD_REQUEST);
	}
}
