# BandUp Admin Panel

Sign in through the existing BandUp login. The site navigation and learner dashboard show **Admin Panel** for `Admin` and `SuperAdmin`. The admin layout rechecks the current cookie session through `GET /api/auth/me`. Anonymous visitors return to login with an internal return path. A learner opening an admin URL sees access denied. An Admin opening Users also sees access denied. Admin APIs independently enforce the current database role.

| Screen | API | Supported operations |
| --- | --- | --- |
| `/admin` | `/api/admin/dashboard` | Four live totals and links to management pages |
| `/admin/passages` | `/api/admin/passages` | Search, status filters, pagination, draft editing, question ordering by sort order, answer keys and variants, evidence selection, explanations, verification, publishing, revisions, archiving and draft deletion |
| `/admin/lessons` | `/api/admin/lessons` | Search, status and type filters, pagination, lessons and examples, example ordering, saved text preview, publish, archive and deletion subject to reference protection |
| `/admin/prompts` | `/api/admin/writing-prompts` | Search, status filters, pagination, Task 2 metadata and text, read-only published and archived views, publish, archive, duplicate and draft deletion |
| `/admin/mapping` | `/api/admin/lesson-mappings` | Published lesson options by question type, existing unavailable mappings, saving or clearing both defaults together |
| `/admin/users` | `/api/admin/users` | Search by name or email, role and active-state filters, pagination, credit balances, account creation with any of the three roles, role changes and deactivation |

The UI uses the backend API for these operations. The browser test suite supplies its own API fixtures. For manual testing, run the backend locally and sign in with a local test account.

## Run locally on Windows

Use PowerShell and keep the `BandUpFront` and `bandup-backend` checkouts in the same parent folder. You need Node.js 22.18 or newer, the .NET 10 SDK, and Docker Desktop in Linux container mode. Docker runs PostgreSQL, Redis, and RabbitMQ. The API runs on the host with `dotnet run`.

### 1. Start the development services

Open Docker Desktop. Check that `docker version` shows a **Server** section with `linux/amd64` before starting Compose.

From the parent folder, run:

```powershell
Set-Location .\bandup-backend
if (-not (Test-Path -LiteralPath .\infra\env\dev.env)) {
    Copy-Item -LiteralPath .\infra\env\dev.env.example -Destination .\infra\env\dev.env
}
notepad .\infra\env\dev.env
```

Set `POSTGRES_PASSWORD` and `RABBITMQ_DEFAULT_PASS` in the ignored `dev.env`. The commands below assume the default `bandup` user and database, PostgreSQL port `5432`, and RabbitMQ port `5672`. Set the following host port for Redis to avoid the `6379` bind error encountered on Windows:

```dotenv
REDIS_PORT=16379
```

Save the file, then run:

```powershell
docker compose --env-file infra/env/dev.env -f infra/docker/docker-compose.dev.yml up -d --wait
```

Wait for `db`, `redis`, and `rabbitmq` to show **Healthy**. Compose uses prebuilt images, so the warning `No services to build` is expected.

### 2. Configure and run the local API

From `bandup-backend`, run each `Read-Host` line separately. Enter the matching password from `dev.env`, then wait for the PowerShell prompt to return before pasting the next command.

```powershell
$bandupDbPassword = Read-Host 'PostgreSQL password from dev.env'
```

```powershell
$bandupRabbitPassword = Read-Host 'RabbitMQ password from dev.env'
```

```powershell
$bandupConnection = New-Object System.Data.Common.DbConnectionStringBuilder
$bandupConnection.ConnectionString = 'Host=localhost;Port=5432;Database=bandup;Username=bandup'
$bandupConnection['Password'] = $bandupDbPassword

dotnet user-secrets set 'ConnectionStrings:Default' $bandupConnection.ConnectionString --project src/BandUp.Api
dotnet user-secrets set 'Redis:ConnectionString' 'localhost:16379' --project src/BandUp.Api
dotnet user-secrets set 'RabbitMq:Host' 'localhost' --project src/BandUp.Api
dotnet user-secrets set 'RabbitMq:Port' '5672' --project src/BandUp.Api
dotnet user-secrets set 'RabbitMq:User' 'bandup' --project src/BandUp.Api
dotnet user-secrets set 'RabbitMq:Password' $bandupRabbitPassword --project src/BandUp.Api
dotnet user-secrets set 'Captcha:Provider' 'Fake' --project src/BandUp.Api
dotnet user-secrets set 'Auth:RequireSecureCookies' 'false' --project src/BandUp.Api
dotnet user-secrets set 'Swagger:Enabled' 'true' --project src/BandUp.Api
```

On the first setup, generate two independent local keys. Keep existing keys on subsequent runs. The instance method below works in Windows PowerShell and PowerShell 7.

```powershell
$bandupRng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try {
    $bandupKeyBytes = New-Object byte[] 32

    $bandupRng.GetBytes($bandupKeyBytes)
    dotnet user-secrets set 'Auth:SigningKey' ([Convert]::ToBase64String($bandupKeyBytes)) --project src/BandUp.Api

    $bandupRng.GetBytes($bandupKeyBytes)
    dotnet user-secrets set 'PasswordReset:CodeProtectionKey' ([Convert]::ToBase64String($bandupKeyBytes)) --project src/BandUp.Api
}
finally {
    $bandupRng.Dispose()
}
```

If this is a fresh, disposable local database, apply the backend migrations once:

```powershell
dotnet run --project src/BandUp.Api --launch-profile http -- --migrate
```

Start the API and leave that terminal open:

```powershell
dotnet run --project src/BandUp.Api --launch-profile http
```

Open [the readiness endpoint](http://localhost:8080/ready). Expect HTTP `200` and `Healthy` for PostgreSQL, Redis, RabbitMQ, and migrations. The Worker is optional for this walkthrough.

### 3. Start the frontend

In a second PowerShell, from `BandUpFront`, install dependencies with `npm.cmd ci` if needed. Stop any earlier frontend instance before changing its environment. Run:

```powershell
$env:NEXT_PUBLIC_API_URL = 'http://localhost:8080'
$env:NEXT_PUBLIC_USE_MOCK_API = 'false'
$env:NEXT_PUBLIC_MOCK_OTP = 'false'
$env:NEXT_PUBLIC_LOCAL_FAKE_CAPTCHA = 'true'
npm.cmd run dev
```

Open [the frontend at localhost:3000](http://localhost:3000). Use `localhost` consistently for the frontend, API, and Swagger. The frontend's **Verify for local testing** checkbox is available in Next.js development mode when both origins use loopback and the local CAPTCHA flag is enabled.

### 4. Register and bootstrap the first SuperAdmin

If the local database already has a SuperAdmin, sign in with that account or use its **Users → Change role** action to grant the desired role. For a fresh local database, open [Swagger at localhost:8080](http://localhost:8080/swagger), select `POST /api/auth/register`, and click **Try it out**. Submit a unique test address and your own local password:

```json
{
  "email": "panel-tester@example.test",
  "displayName": "Panel Tester",
  "password": "<your local test password>",
  "captchaToken": "fake-captcha-token"
}
```

Expect HTTP `201`. Registration creates a `User`. From a separate terminal in `bandup-backend`, connect to the development PostgreSQL container:

```powershell
docker compose --env-file infra/env/dev.env -f infra/docker/docker-compose.dev.yml exec db psql -U bandup -d bandup
```

At the `bandup=#` prompt, replace the example email with the address you registered and paste this transaction. It promotes the matching active account only when the local database has no active SuperAdmin.

```sql
BEGIN;

SELECT pg_advisory_xact_lock(42411, 1);

UPDATE identity.users
SET role = 'SuperAdmin'
WHERE email = 'panel-tester@example.test'
  AND is_active
  AND NOT EXISTS (
    SELECT 1 FROM identity.users
    WHERE role = 'SuperAdmin' AND is_active
  )
RETURNING email, role;

COMMIT;
```

Expect `UPDATE 1` and `SuperAdmin` in the returned row. If you get `UPDATE 0`, check the email and whether an active SuperAdmin already exists. Enter `\q` to exit.

### 5. Sign in and test the panel manually

On [the login page](http://localhost:3000/login/), use password sign-in. Enter the local account credentials, select **Verify for local testing**, and click **Sign in**. The learner dashboard should show **Admin Panel**. The [direct panel link](http://localhost:3000/admin/) also works for permitted roles. You can verify the current role with `GET /api/auth/me` in Swagger from the same browser.

| Check | Expected result |
| --- | --- |
| Sign in as `SuperAdmin` and open **Users → New user** | You can create separate local test accounts with the `Admin` and `User` roles, change roles, and deactivate accounts. |
| Sign in as `Admin` | **Admin Panel** opens. Opening `/admin/users/` by URL shows access denied. |
| Sign in as `User` | The admin link is hidden. Opening `/admin/` by URL shows access denied. |
| Edit a draft Passage as an admin | Readiness lists the required changes. When all answers are verified, publication still requires the final review checkbox. |
| Resize the browser to a mobile viewport | The admin navigation opens from the menu, and forms and user rows fit the viewport. |

### Troubleshooting

| Symptom | What to check |
| --- | --- |
| Docker cannot find `dockerDesktopLinuxEngine` | Open Docker Desktop and check that `docker version` shows the Linux server. If `wsl --status` reports a virtualization problem, enable the Windows Virtual Machine Platform and check virtualization in BIOS/UEFI, then restart. |
| Docker Hub returns `403` for `pgvector/pgvector:pg17` | Test with `docker pull pgvector/pgvector:pg17`. Check Docker Desktop's proxy settings or try a connection that can access Docker Hub. The approved images can also be transferred with `docker image save` and `docker image load`, then started with `docker compose up --pull never` using the same Compose options above. |
| Redis cannot bind to `127.0.0.1:6379` | Save `REDIS_PORT=16379` in `infra/env/dev.env`, rerun Compose, and set the API's `Redis:ConnectionString` to `localhost:16379`. |
| PostgreSQL rejects the password | Re-enter `POSTGRES_PASSWORD` at the `Read-Host` prompt and update `ConnectionStrings:Default`. Existing Docker volumes retain the database credentials they were initialized with. |
| Login says `CAPTCHA is not configured` | Start the frontend with the development command above, check both addresses use loopback, and select **Verify for local testing**. For the local Fake provider, you can also use Swagger's `POST /api/auth/login` with `captchaToken: "fake-captcha-token"`, then open the frontend in the same browser after HTTP `200`. |
| Login works but the admin button is missing | Check the role returned by `GET /api/auth/me`. After a role change, reload the frontend or sign out and sign in again. |

## Contract differences from the designs and functional spec

- The dashboard API has no activity feed. Admin home uses the space for quick actions.
- The manual credit adjustment endpoint is proposed in the backend documentation and absent from the implemented API. Balances are view-only. The Users DTO supplies email and has no phone field. Deactivation retains account history. The API has no reactivation or hard-delete operation.
- Passages use the existing 20-minute Reading rule. The admin API has no editable time limit, per-question word limit, separate paraphrase pairs or per-question lesson selector. Publication follows the readiness response and final confirmation, using the server's rules for question count, evidence and verification. The API returns the verifier ID and timestamp, with no display name.
- Lessons use the backend's evidence/paraphrase examples and saved text preview. The contract has no summary, reading duration or separate exercises. A published lesson remains editable, while an archived lesson is read-only.
- Lesson mapping stores one default published lesson per supported Reading question type. The mockup's example question numbers are presentation copy.
- Writing Prompts are Task 2 only, with a free-text essay type and configurable word range. Published and archived prompts can be duplicated into independent drafts.
- The existing password login and registration API paths are mapped. Email-code login and registration routes used by the existing optional OTP UI are absent from this backend checkout.

## Verification

Run `npm run build`, `npm run lint` and `npm test` from the frontend directory. The test command uses Node.js with TypeScript type stripping (Node 22.18+).

The browser suite uses Playwright from the local Node installation or the path provided in `BANDUP_TEST_PLAYWRIGHT`. Set `BANDUP_TEST_CHROME` to a local Chromium executable if Playwright's bundled browser is unavailable. Build the frontend with the loopback fixture origin, then run `npm run test:admin`. The suite starts Next.js on loopback and intercepts browser API calls. It requires no backend or database.

```powershell
$env:NEXT_PUBLIC_API_URL = 'http://127.0.0.1:3410'
$env:NEXT_PUBLIC_USE_MOCK_API = 'false'
npm run build
npm run test:admin
```
