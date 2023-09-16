import { Module } from '@nestjs/common';
import { HealthController } from '@infrastructure/controllers/health.controller';
import { USE_CASES } from '@application/use-cases';
import Surreal from 'surrealdb.js';
import { ACCOUNT_REPOSITORY_TOKEN } from '@application/providers/account.repository';
import { SurrealAccountRepository } from '@infrastructure/repository/surreal-account.repository';
import { CreateAccountController } from '@infrastructure/controllers/create-account.controller';
import { GetAccountByIdController } from '@infrastructure/controllers/get-account-by-id.controller';
import { DeleteAccountController } from '@infrastructure/controllers/delete-account.controller';
import { AddTransactionController } from '@infrastructure/controllers/add-transaction.controller';
import { GetAccountsByUserIdController } from '@infrastructure/controllers/get-accounts-by-user-id.controller';

@Module({
	imports: [],
	controllers: [
		HealthController,
		CreateAccountController,
		GetAccountByIdController,
		GetAccountsByUserIdController,
		DeleteAccountController,
		AddTransactionController,
	],
	providers: [
		...USE_CASES,
		{
			provide: Surreal,
			useFactory: async () => {
				// Connect to the database
				const db = new Surreal();
				await db.connect('http://localhost:8000/rpc');

				// Signin as a namespace, database, or root user
				await db.signin({
					user: 'root',
					pass: 'password',
				});

				// Select a specific namespace / database
				await db.use({ ns: 'bank', db: 'bank' });
				return db;
			},
		},
		{
			provide: ACCOUNT_REPOSITORY_TOKEN,
			useClass: SurrealAccountRepository,
		},
	],
})
export class AppModule {}
