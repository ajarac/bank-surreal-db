const { faker } = require('@faker-js/faker');
const usersCount = 10;
const accountsPerUser = 10;
const transactionsPerAccount = 500;

main().then().catch();

async function main() {
	for (let i = 0; i < usersCount; i++) {
		const userId = (i + 1).toString();
		console.log('userId', userId);
		for (let j = 0; j < accountsPerUser; j++) {
			const account = await fetch('http://localhost:3000/account', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId, name: faker.finance.accountName(), currency: faker.finance.currencyCode() }),
			}).then((data) => data.json());

			console.log('account created', account);

			let balance = 0;
			for (let k = 0; k < transactionsPerAccount; k++) {
				const type = balance < 1000 ? 'CREDIT' : 'DEBIT';
				const amount = type === 'CREDIT' ? faker.number.int({ min: 1, max: 1000 }) : faker.number.int({ min: 1000, max: 5000 });

				const transaction = { accountId: account.id, amount, currency: account.currency, description: faker.lorem.sentence(), type };
				await fetch('http://localhost:3000/transactions', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(transaction),
				});
				balance += type === 'CREDIT' ? amount : -amount;
				console.log('transaction created', transaction);
			}
		}
	}
}
