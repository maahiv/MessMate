# MessMate — Smart Mess Management

A React + Firebase-ready hostel mess platform focused on:
- 7-day mess menu
- student food-safety complaints with photo evidence
- complaint tracking
- student voting on meal changes
- admin menu and poll management
- student/admin role-based UI
- Redux Toolkit + Context API
- Firebase Auth / Firestore / Storage integration-ready
- Demo mode works without Firebase credentials

## Run
```bash
npm install
npm run dev
```

## Demo accounts
Student:
- Email: student@messmate.demo
- Password: student123

Admin:
- Email: admin@messmate.demo
- Password: admin123

## Firebase
Copy `.env.example` to `.env` and add your Firebase Web App values.
The app detects configured Firebase values automatically. Demo mode remains available when Firebase is not configured.

## Main structure
src/
- components/        reusable UI
- pages/auth/        login/register
- pages/student/     student screens
- pages/admin/       admin screens
- context/           AuthContext
- redux/             Redux store + slices
- firebase/          Firebase config + data helpers
- data/              demo data
- styles/            global styling

The project intentionally starts with realistic demo data so the UI is useful before Firebase setup.

### Current implementation note
Photo selection is wired into the complaint flow. For real Firebase Storage persistence, connect Storage in `firebase/data.js` after adding your Firebase project credentials.
