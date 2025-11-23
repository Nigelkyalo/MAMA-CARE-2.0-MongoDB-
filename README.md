# MamaCare - Pregnancy Care Application

A comprehensive pregnancy care application built with React, TypeScript, and MongoDB Atlas. MamaCare helps expecting mothers track their pregnancy journey, manage appointments, receive health tips, and stay connected with healthcare providers.

**Live Application**: [https://mama-care-2-0-mongo-db.vercel.app/](https://mama-care-2-0-mongo-db.vercel.app/)

## Features

- 📅 **Pregnancy Tracking**: Track your pregnancy progress with personalized timelines
- 🔔 **Smart Reminders**: Never miss appointments, medications, or important health tips
- 🏥 **Healthcare Management**: Connect with your preferred hospitals and clinics
- 💬 **Multi-language Support**: Available in English, Swahili, Kikuyu, and Luo
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 💾 **Local Storage**: All data stored securely in your browser for privacy

## Technologies

This project is built with modern web technologies:

- **Frontend**:
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - shadcn/ui components
  - React Router DOM
  - React Query (TanStack Query)

- **Data Storage**:
  - Browser localStorage for client-side data persistence
  - All data stored locally in the user's browser

## Project Structure

```
expecting-ease-care/
├── backend/          # Express.js backend API
├── src/             # React frontend application
│   ├── components/  # Reusable UI components
│   ├── pages/       # Page components
│   ├── context/     # React context providers
│   └── lib/         # Utility functions and database connections
├── public/          # Static assets
└── supabase/        # Supabase configuration (legacy - removed)
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/Nigelkyalo/MAMA-CARE-2.0-MongoDB-.git
   cd MAMA-CARE-2.0-MongoDB-
   ```

2. **Install frontend dependencies**
```sh
   npm install
   ```

3. **Start the development server**

   ```sh
npm run dev
```
   The application will be available at `http://localhost:8080` (or another port if 8080 is in use)

   **Note**: No backend server or database setup is required. The app runs entirely in the browser using localStorage for data storage.

## Data Storage

The application uses browser localStorage for all data storage:

- **User Authentication**: Stored locally in browser
- **Pregnancy Profiles**: Saved to browser localStorage
- **Privacy**: All data remains on the user's device
- **No Backend Required**: Works completely offline

### Frontend Routes

- `/login` - User login page (stores data locally)
- `/get-started` - Multi-step pregnancy profile setup form
- `/dashboard` - Personalized dashboard showing all entered details

## Deployment

The application is deployed on Vercel:

- **Production URL**: [https://mama-care-2-0-mongo-db.vercel.app/](https://mama-care-2-0-mongo-db.vercel.app/)

### Deploying to Vercel

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set build commands:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy!

### Environment Variables for Production

**Note**: No environment variables are required as the app uses browser localStorage for all data storage.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Nigel Kyalo**
- GitHub: [@Nigelkyalo](https://github.com/Nigelkyalo)
- Project Repository: [MAMA-CARE-2.0-MongoDB-](https://github.com/Nigelkyalo/MAMA-CARE-2.0-MongoDB-)

## Support

For support, please open an issue in the GitHub repository or contact the project maintainers.

---

**Note**: This application is designed to support expecting mothers throughout their pregnancy journey. Always consult with healthcare professionals for medical advice.
