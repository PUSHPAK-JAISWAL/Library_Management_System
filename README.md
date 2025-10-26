# Library Management System

A modern, full-featured library management system built with Next.js and React. Manage books, track issues/returns, handle student bookings, calculate fines, and send email notifications — all with a dark-themed interface.

## 🌟 Features

### For Students
- User Registration with auto-generated unique student IDs
- Browse and search books (with images)
- Book reservation with a 6-hour pickup window
- View issued books and due dates
- Track fines (₹10/day after a 7-day grace period)
- Request reissue (extend return date)
- Receive email notifications for bookings, issues, returns, and due reminders

### For Librarians
- Add, edit, and delete books (with internet images)
- Issue and return books with quick search by student name, email, or ID
- Approve and manage student bookings
- Set custom due dates (1–7 days) when issuing
- Handle reissues and extend due dates
- Generate and export overdue reports
- View email log for scheduled and sent emails

### For Admin
- Add and remove librarian accounts
- View circulation statistics and system analytics
- Generate and print monthly reports
- Delete old transaction records
- Track totals: books, issues, returns, and fines

## 🛠️ Tech Stack

- Frontend: Next.js 16, React 19, TypeScript
- Styling: Tailwind CSS v4, shadcn/ui components
- State Management: Zustand
- Email Service: Nodemailer with Gmail SMTP
- Storage: Browser localStorage (client-side, no backend required)
- Deployment: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Gmail account with App Password enabled (for SMTP)
- Vercel account (optional, for deployment)

## 🚀 Installation

1. Clone the repository
```bash
git clone https://github.com/PUSHPAK-JAISWAL/Library_Management_System.git
cd Library_Management_System
```

2. Install dependencies
```bash
npm install
```

3. Create environment file `.env.local` in project root and add:
```env
# Gmail SMTP Configuration
GMAIL_SENDER_EMAIL=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

How to get a Gmail App Password:
1. Go to Google Account > Security
2. Enable 2-Step Verification
3. Create an App Password for "Mail"
4. Use the generated 16-character password as `GMAIL_APP_PASSWORD`

4. Run development server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📖 Usage

### Default Admin Account
- Email: admin@lib.com
- Password: password

Recommended first steps:
1. Log in as admin.
2. Create librarian accounts.
3. Add books to the catalogue.
4. Share student signup link with students.
5. Students register and start booking books.

Workflows:
- Students sign up → browse books → book → receive booking email → librarian issues book → student tracks dues and returns/reissues as needed.
- Librarians manage books, bookings, issues/returns, and generate reports.
- Admin manages librarians, views statistics, and cleans old data.

## 📁 Project Structure (high level)

```
library-management-system/
├── app/
│   ├── api/
│   │   └── send-email/route.ts
│   ├── actions/
│   │   └── email-config.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   ├── auth/
│   ├── librarian/
│   ├── student/
│   ├── notifications/
│   └── ui/
├── hooks/
│   └── use-email-notifications.ts
├── lib/
│   ├── store.ts
│   └── email-scheduler.ts
└── package.json
```

## 🔐 Security & Data Notes

- Role-based access: separate permissions for students, librarians, and admins
- Unique student IDs are auto-generated
- All application data persists in the browser's localStorage (client-side only)
- Email sending uses Gmail SMTP with App Passwords — keep credentials secure
- Passwords used in the app are stored locally — for production or multi-user setups, add a backend and secure storage

## 📧 Email Notifications

The app sends automatic emails for:
- Booking confirmations
- Book issue notifications
- Return confirmations
- Reissue notifications
- Due reminders (development default: short/demo intervals; adjust for production)

## 💾 Data Storage

Data stored in localStorage includes:
- Books and inventory
- Student accounts and bookings
- Issue/return history and transactions
- Fine calculations and email logs

Note: localStorage persists per browser and device. Back up/export data if needed.

## 🚀 Deployment (Vercel)

1. Push your code to GitHub.
2. Go to https://vercel.com and import the repository.
3. Add environment variables in Vercel:
   - GMAIL_SENDER_EMAIL
   - GMAIL_APP_PASSWORD
   - NEXT_PUBLIC_APP_URL
4. Deploy via Vercel UI or CLI:
```bash
npm install -g vercel
vercel
```

## 🐛 Troubleshooting

Emails not sending:
- Verify Gmail App Password and 2-Step Verification are enabled
- Ensure `GMAIL_SENDER_EMAIL` matches the Gmail account
- Check browser console / server logs for errors

Data not persisting:
- Ensure localStorage is enabled in the browser
- Clear cache or try incognito to check different results

Students cannot sign up:
- Ensure signup route/page is accessible
- Verify email format and uniqueness logic
- Check console for runtime errors

## 📊 Future Enhancements

- Backend database integration (Postgres/MongoDB)
- Centralized authentication and secure password storage
- Advanced search and filtering
- Book recommendations and analytics
- SMS notifications and push notifications
- Mobile app and QR code scanning
- Multi-library / multi-branch support

## 📝 License

This project is open source under the MIT License. See LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Suggested workflow:
1. Fork the repository
2. Create a feature branch: git checkout -b feat/your-feature
3. Implement changes and add tests where applicable
4. Commit, push, and open a Pull Request describing the changes

Please follow the existing coding style and include tests for new features or bug fixes.

## 📞 Support

For issues and questions, please open an issue on GitHub with:
- Steps to reproduce
- Expected vs actual behavior
- Error messages / stack traces
- Environment (OS, Node.js version, browser)

## 🔗 Links
- Repository: https://github.com/PUSHPAK-JAISWAL/Library_Management_System

---
