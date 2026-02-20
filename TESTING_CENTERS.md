# Testing Centers (Manual)

This document explains how to manually verify the Center APIs and the frontend Centers page.

## 1) Start backend (School)

Open a terminal and run:

```powershell
cd c:\xampp\htdocs\School
npm install
npm run dev
```

The API base is expected at `http://localhost:5002/api` (confirm `NEXT_PUBLIC_API_URL` in frontend).

## 2) Start frontend (college-penal)

In a separate terminal:

```powershell
cd c:\xampp\htdocs\college-penal
npm install
npm run dev
```

Open `http://localhost:3000` (or the port Next reports).

## 3) Test APIs directly with cURL

Replace `<TOKEN>` with a valid bearer token (use your auth flow to obtain it).

- List centers

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:5002/api/centers
```

- Create center

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"name":"Test Center","address":"123 Main","phone":"0123456789","email":"center@example.com","notes":"Created by manual test"}' http://localhost:5002/api/centers
```

- Update center

```bash
curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"name":"Updated Center"}' http://localhost:5002/api/centers/1
```

- Deactivate center

```bash
curl -X PATCH -H "Authorization: Bearer <TOKEN>" http://localhost:5002/api/centers/1/deactivate
```

## 4) Verify via UI

1. Login via the frontend (use the existing auth flow). After login the cookie `accessToken` should be set.
2. Open the sidebar and go to `Total Centers` (or visit `/apps/centers`).
3. Create a new center using the form, verify it appears in the list.
4. Edit an existing center and verify changes persisted.
5. Deactivate a center and verify `isActive` shows `false`.

## 5) Troubleshooting

- API returns 401: ensure the JWT token is valid and has appropriate permissions.
- Database errors: check `School` DB config in `src/config/DatabaseConfig.ts` and ensure migrations ran.

## 6) Optional automated checks

If you want, I can add Jest/supertest tests for the `Center` controller in the `School` project. Ask me to create `center.spec.ts` and I'll add basic e2e tests.
