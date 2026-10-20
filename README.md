# Employee Leave Management System (PS4)

MERN project where employees apply for leave and a manager/admin approves or rejects it.

## How to run

Backend:
```
cd backend
npm install
cp .env.example .env   # then put your MONGO_URI and JWT_SECRET
npm run dev
```

Frontend:
```
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5001/api
npm run dev
```

Open http://localhost:5173

## API

| Method | URL | Who |
| --- | --- | --- |
| POST | /api/auth/register | anyone |
| POST | /api/auth/login | anyone |
| GET | /api/leave-types | logged in |
| GET | /api/leave-types/:id | logged in |
| POST | /api/leave-types | admin |
| PUT | /api/leave-types/:id | admin |
| DELETE | /api/leave-types/:id | admin |
| POST | /api/leaves | employee |
| GET | /api/leaves/my | employee |
| GET | /api/leaves/balance | employee |
| GET | /api/leaves/:id | owner or admin |
| PATCH | /api/leaves/:id/cancel | employee (only pending) |
| GET | /api/leaves | admin |
| PATCH | /api/leaves/:id/status | admin |
| GET | /api/dashboard | admin |
# assignment-6
