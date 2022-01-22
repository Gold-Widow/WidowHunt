This is a [Blitz.js](https://github.com/blitz-js/blitz) app.

# **Widow Hunt**

Widow Hunt is a Text based progress tracker. Harness the simplicity of yaml and the power of regex to track issues or document a complex process.

Similar projects:

- https://transno.com/
  This is a mind mapping tool that converts notes taken in a bullet format into a mindmap
  It's better than Widow Hunt for purely note taking.

Widow Hunt aims to add functionality via documentation, as described below

Widow Hunt planned functionality:

- Assisted documentation.
  E.g.: Configure a regular expression to act as a count up timer to identify how long you are spending on a certain node
- Actions from note:
  E.g.: Set a reminder using a regular expression. With an integration with SMS, you can receive an alert for an upcoming TODO, etc.

## Getting Started

1. Install dependencies

`yarn dev` or `npm i`

2. Environment Variables

Ensure the `.env.local` file has required environment variables:

```
DATABASE_URL=postgresql://<YOUR_DB_USERNAME>@localhost:5432/WidowHunt
```

Ensure the `.env.test.local` file has required environment variables:

```
DATABASE_URL=postgresql://<YOUR_DB_USERNAME>@localhost:5432/WidowHunt_test
```

Run your app in development mode.

```
blitz dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Containerization

Ensure that an .env.production.local file exists in the project root. It needs the following variables:

```
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
SESSION_SECRET_KEY=<32 character secret key>
DATABASE_URL="postgresql://<YOUR_DB_USERNAME>:<YOUR_DB_PASSWORD>@<YOUR_DB_URL>:<YOUR_DB_PORT>/<YOUR_DB_NAME>
```

## Tests

Runs your tests using Jest.

```
yarn test
```

Blitz comes with a test setup using [Jest](https://jestjs.io/) and [react-testing-library](https://testing-library.com/).

## Commands

Blitz comes with a powerful CLI that is designed to make development easy and fast. You can install it with `npm i -g blitz`

```
  blitz [COMMAND]

  dev       Start a development server
  build     Create a production build
  start     Start a production server
  prisma    Run prisma commands
  generate  Generate new files for your Blitz project
  console   Run the Blitz console REPL
  help      display help for blitz
  test      Run project tests
```

You can read more about it on the [CLI Overview](https://blitzjs.com/docs/cli-overview) documentation.

## Learn more

Read the [Blitz.js Documentation](https://blitzjs.com/docs/getting-started) to learn more.

The Blitz community is warm, safe, diverse, inclusive, and fun! Feel free to reach out to us in any of our communication channels.

- [Website](https://blitzjs.com/)
- [Discord](https://discord.blitzjs.com/)
- [Report an issue](https://github.com/blitz-js/blitz/issues/new/choose)
- [Forum discussions](https://github.com/blitz-js/blitz/discussions)
- [How to Contribute](https://blitzjs.com/docs/contributing)
- [Sponsor or donate](https://github.com/blitz-js/blitz#sponsors-and-donations)

## Data migration

There may come a time when you need to move your data from one location to another. The pg_dump utility that comes with Postgres helps with this.

On Windows, its usually found in

C:\Program Files\PostgreSQL\<VERSION>\bin\pg_dump.exe, after you [install PostgreSQL](https://www.postgresql.org/download/windows/)
This usually isn't added to PATH

Use cmd.exe instead of powershell. Powershell may add special characters that corrupt the export file

1. Go to the directory containing the pg_dump file
   `cd C:\Program Files\PostgreSQL\<VERSION>\bin`

2. Export the database contents using pg_dump to a file
   `.\pg_dump.exe --host <database url/IP> --port <PORT> --username <database username> <databasename> > "C:\BackupLocation.sql"`

3. Import the database contents using psql to the new database
   `.\psql.exe -f "C:\BackupLocation.sql" --dbname ""postgresql://<YOUR_DB_USERNAME>:<YOUR_DB_PASSWORD>@<YOUR_DB_URL>:<YOUR_DB_PORT>/<YOUR_DB_NAME>"`

On Linux/Mac, these may be slightly different, but the general gist is to export using pg_dump and import using psql
