import { Catch, HttpStatus } from '@nestjs/common';
import { AccountWithBalanceCanNotBeDeletedException } from '@domain/exceptions/account-with-balance-can-not-be-deleted.exception';
import { BaseCatchException } from '@infrastructure/catch-exceptions/base-catch.exception';

@Catch(AccountWithBalanceCanNotBeDeletedException)
export class CatchAccountWithBalanceCanNotBeDeletedException extends BaseCatchException {
	constructor() {
		super(HttpStatus.BAD_REQUEST);
	}
}
