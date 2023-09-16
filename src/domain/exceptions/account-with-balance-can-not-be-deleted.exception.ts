export class AccountWithBalanceCanNotBeDeletedException extends Error {
	constructor(accountId: string) {
		super(`Account with id ${accountId} can not be deleted because it has balance`);
	}
}
