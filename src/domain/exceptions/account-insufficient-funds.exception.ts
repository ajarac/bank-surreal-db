export class AccountInsufficientFundsException extends Error {
	constructor(accountId: string) {
		super(`Account with id ${accountId} has insufficient funds`);
	}
}
