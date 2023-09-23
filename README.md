# Bank Account with Surreal DB
This project aims to demonstrate the practical application of [Surreal DB](https://surrealdb.com/).

Surreal DB, launched in September 2023, introduces a groundbreaking database paradigm that seamlessly combines the strengths of both SQL and NoSQL databases. It offers a unique approach by facilitating graph-based relationships among various tables and providing a host of additional features.

# Structure of the project

Embracing the principles of [Hexagonal architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)), our project is structured as follows:

-   **Domain**: Within this realm, we define two distinct domains, namely the Account domain and the Transaction domain. These domains are closely intertwined with the core functionality they represent.

-   **Application**: This layer is dedicated to encapsulating the various use cases that a bank application can encompass. These use cases might include operations such as creating a new account, generating a transaction, and more.

-   **Infrastructure**: In this section, we delve into the nitty-gritty details of our implementation, covering aspects like the repository, which is intricately linked with SurrealDB, and the controllers, which serve as the entry points for our application's functionality. This layer handles the practical implementation and integration aspects of our architecture.

![Original clean architecture](https://imgs.search.brave.com/EpHglmwnle7o1cA5pvE6j5vidtOJ38ySu3p3p87CWgk/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9ibG9n/LmNvZGVtYWdpYy5p/by9tYWluX2NsZWFu/X2FyY2hpdGVjdHVy/ZV81Njk5Mzk1MTM4/NTgzOTc4MzlfaHU1/N2Q4NzYwNzRhNzhi/NTA2NTNkY2UzYTMy/NzkzNmU1Zl8wXzEy/ODB4MTgwMF9maXRf/bGluZWFyXzMucG5n)
