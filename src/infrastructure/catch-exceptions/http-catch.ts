import { APP_FILTER } from '@nestjs/core';
import { Provider } from '@nestjs/common';
import { CatchAccountInsufficientFundsException } from '@infrastructure/catch-exceptions/catch-account-insufficient-funds.exception';
import { CatchAccountNotFoundException } from '@infrastructure/catch-exceptions/catch-account-not-found.exception';
import { CatchAccountWithBalanceCanNotBeDeletedException } from '@infrastructure/catch-exceptions/catch-account-with-balance-can-not-be-deleted.exception';

const exceptions = [CatchAccountInsufficientFundsException, CatchAccountNotFoundException, CatchAccountWithBalanceCanNotBeDeletedException];

export const EXCEPTIONS: Provider[] = exceptions.map((exception) => ({
	provide: APP_FILTER,
	useClass: exception,
}));
