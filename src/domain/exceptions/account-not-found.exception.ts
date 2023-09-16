export class AccountNotFoundException extends Error {
	constructor(accountId: string) {
		super(`Account with id ${accountId} not found`);
	}
}
