import { Catch, HttpStatus } from '@nestjs/common';
import { AccountNotFoundException } from '@domain/exceptions/account-not-found.exception';
import { BaseCatchException } from '@infrastructure/catch-exceptions/base-catch.exception';

@Catch(AccountNotFoundException)
export class CatchAccountNotFoundException extends BaseCatchException {
	constructor() {
		super(HttpStatus.NOT_FOUND);
	}
}
