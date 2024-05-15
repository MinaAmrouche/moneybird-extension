## About
This is a personal work in progress project extending the features of the accounting software [Moneybird](https://www.moneybird.com/).

It is not finished yet, and therefore not fully ready for production. But feel free to try it out locally!

It connects to your Moneybird account through OAuth and can read your time entries, contacts and sales invoices.

## Features
### Time entries overview
The home page displays a time entries table with a possibility to filter by *state*, *period* and *contact*.
You get the total **time** and **amount** per page and across all filtered entries.

<img width="500" alt="image" src="https://github.com/MinaAmrouche/moneybird-extension/assets/22000270/ed20ff7d-2097-4a58-b3b8-2f497ad0676a">

### Project/Product link
You can link a project to a product, which allows you to calculate the amount you will invoice in the future and you have invoiced already.

<img width="500" alt="image" src="https://github.com/MinaAmrouche/moneybird-extension/assets/22000270/7424f853-0fd3-4a84-94db-9b7ccba32480">

### Invoice creation
As you would do on Moneybird, you can create an invoice from the opened time entries. They can be filtered by contact.
The **difference** with the native feature is in the invoice itself: the time entries are **grouped by project/product** instead of either merged into one entry or all seperated.

<img width="500" alt="image" src="https://github.com/MinaAmrouche/moneybird-extension/assets/22000270/2786bbe2-2972-4baf-adbc-02ce0808a0e6">

## Getting Started

### Environment variables

Create a `.env` file at the root of the project.

### Authentication

To allow this app to connect to the Moneybird API and use Moneybird as authentication method, follow [this doc](https://developer.moneybird.com/authentication/#registration).

From there, you will get a `CLIENT_ID` and a `CLIENT_SECRET` that you can define as environment variables:

```
OAUTH_URL=https://moneybird.com/oauth
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
```

The second step is to define a secret used by NextAuth. Follow [this doc](https://next-auth.js.org/configuration/options#secret) to generate it, and then create those environment variables:

```
NEXTAUTH_URL=http://localhost:3001/
NEXTAUTH_SECRET=
```

### Database

This project uses Prisma and a postgres database.
First, create a postgres database.

Then, define this environment variable to allow Prisma to connect with a *username*, *password* and *database-name*:
```
POSTGRES_PRISMA_URL="postgresql://username:password@localhost:5432/database-name?schema=public"
```

### Development server
Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3001) with your browser to see the result.
