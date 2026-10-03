# GrainMate

Offline-first app for a grain shop. The phone saves data locally, then syncs to the server when the internet is available.

## Folders

- `apps/mobile` — phone app (Expo, TypeScript)
- `apps/server` — API (Express, TypeScript, PostgreSQL)
- `packages/shared` — rules and types used by both apps

## Requirements

- Node.js 22.13 or newer (`nvm use` reads `.nvmrc`)
- Docker, for local PostgreSQL
- Android Studio, for the phone app

`JAVA_HOME` and `ANDROID_HOME` were not set on this machine. Point them at Android Studio’s JDK and the Android SDK before building:

```
JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
ANDROID_HOME=C:\Users\ciman\AppData\Local\Android\Sdk
```

## Check the setup

1. Start PostgreSQL. On this machine ports 5432 and 5433 are already used by other projects, so GrainMate is published on port 5434:

```
docker compose up -d
```

2. Start the server and open [http://localhost:3000/health](http://localhost:3000/health). You should see `{ "ok": true }`.

```
npm run dev:server
```

3. Build and open the Android app (emulator or USB phone):

```
npm run android -w @grainmate/mobile
```

For later sessions, start Metro with `npm run dev:mobile`, then open the GrainMate app on the device.

4. Run tests:

```
npm test
```

Generate the Prisma client after install (no tables yet):

```
npm run db:generate -w @grainmate/server
```

Copy `apps/server/.env.example` to `apps/server/.env` for local development. Do not commit `.env`.
