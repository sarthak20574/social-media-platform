# 📱 SocialHub - Social Media Platform

A complete, full-stack social media platform built with Node.js, React.js, and MongoDB.

## ✨ Features

- **User Authentication** - Register, login, and secure JWT-based authentication
- **User Profiles** - Create and update profiles with bio and profile pictures
- **Friend System** - Add friends, send/accept friend requests
- **News Feed** - Create posts with text, images, and videos
- **Private Messaging** - Send direct messages to friends
- **Modern UI** - Beautiful, responsive design with professional styling

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel](https://your-app.vercel.app)
- **Backend API**: [Deployed on Railway](https://your-api.railway.app)

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Modern CSS with gradients and animations

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
JWT_SECRET=your_secret_key_here
MONGODB_URI=mongodb://localhost:27017/social_media
```

### Frontend
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/profile-picture` - Upload profile picture
- `GET /api/users/all` - Get all users

### Posts
- `POST /api/posts` - Create new post
- `GET /api/posts/feed` - Get news feed
- `GET /api/posts/user/:id` - Get user's posts

### Friends
- `POST /api/friends/request/:id` - Send friend request
- `POST /api/friends/accept/:id` - Accept friend request
- `GET /api/friends/list` - Get friends list
- `GET /api/friends/requests` - Get friend requests

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:userId` - Get chat history

## 🎨 UI Features

- **Modern Design** - Gradient backgrounds and card-based layout
- **Responsive** - Works on desktop, tablet, and mobile
- **Professional Styling** - Clean, modern interface
- **Smooth Animations** - Hover effects and transitions
- **User-Friendly** - Intuitive navigation and interactions

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Add environment variable: `REACT_APP_API_URL`

### Backend (Railway)
1. Connect GitHub repository to Railway
2. Select backend folder
3. Add environment variables
4. Deploy automatically

### Database (MongoDB Atlas)
1. Create free cluster on MongoDB Atlas
2. Get connection string
3. Update backend environment variables

## 📁 Project Structure

```
social-media-platform/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── uploads/         # File uploads
│   └── index.js         # Server entry point
├── frontend/
│   ├── src/
│   │   ├── App.js       # Main React component
│   │   ├── App.css      # Styling
│   │   └── index.js     # React entry point
│   └── public/          # Static files
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built with ❤️ by [Your Name]

---

**Ready to connect the world! 🌍**

