import { AddTransactionUseCase } from '@application/use-cases/add-transaction.use-case';
import { CreateAccountUseCase } from '@application/use-cases/create-account.use-case';
import { GetAccountByIdUseCase } from '@application/use-cases/get-account-by-id.use-case';
import { GetAccountsByUserUseCase } from '@application/use-cases/get-accounts-by-user.use-case';
import { DeleteAccountUseCase } from '@application/use-cases/delete-account.use-case';
import { GetTransactionsByAccountIdUseCase } from '@application/use-cases/get-transactions-by-account-id.use-case';

export const USE_CASES = [
	CreateAccountUseCase,
	GetAccountByIdUseCase,
	GetAccountsByUserUseCase,
	DeleteAccountUseCase,
	AddTransactionUseCase,
	GetTransactionsByAccountIdUseCase,
];
