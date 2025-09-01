# 📱 SocialHub - Complete Social Media Platform


# Demo Video: https://youtu.be/PsWJWcX6vGg

A modern, full-stack social media platform built with Node.js, React.js, and MongoDB. Features user authentication, friend connections, news feed, private messaging, and a beautiful responsive UI.

![Social Media Platform](https://img.shields.io/badge/Node.js-Express-green) ![React](https://img.shields.io/badge/React-18.0-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **User Authentication** - Register, login, and secure JWT-based authentication
- **User Profiles** - Create and update profiles with bio and profile pictures
- **Friend System** - Add friends, send/accept friend requests
- **News Feed** - Create posts with text, images, and videos
- **Private Messaging** - Send direct messages to friends
- **Modern UI** - Beautiful, responsive design with professional styling

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/sarthak20574/social-media-platform.git
cd social-media-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
MONGODB_URI=mongodb://localhost:27017/social_media
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

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

## 🎯 Key Features in Detail

### 🔐 Authentication System
- Secure user registration and login
- JWT token-based authentication
- Password hashing with bcryptjs
- Protected routes and middleware

### 👤 User Management
- Complete user profiles with bio and pictures
- Profile picture upload with Multer
- User search and discovery
- Profile customization

### 👥 Social Features
- Send and accept friend requests
- View friends list
- Manage friend connections
- Real-time friend status

### 📝 Content Sharing
- Create posts with text, images, and videos
- News feed showing friends' posts
- Media upload support
- Post timeline and history

### 💬 Messaging System
- Private messaging between friends
- Real-time chat interface
- Message history and persistence
- User-to-user communication

### 🎨 Modern UI/UX
- Responsive design for all devices
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Professional card-based layout
- Intuitive navigation

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

## 🎓 Learning Outcomes

This project demonstrates:
- **Full-Stack Development** - Complete MERN stack implementation
- **Authentication & Security** - JWT tokens, password hashing, protected routes
- **Database Design** - MongoDB schemas and relationships
- **File Upload** - Image and media handling with Multer
- **Modern React** - Hooks, state management, and component architecture
- **API Design** - RESTful endpoints and proper HTTP methods
- **UI/UX Design** - Responsive, modern interface design
- **Version Control** - Git workflow and GitHub collaboration

## 👨‍💻 Author

**Sarthak Dixit** - [@sarthak20574](https://github.com/sarthak20574)

- 🎓 Computer Science Student at IIIT Delhi
- 💻 Passionate about Full-Stack Development
- 🚀 Building innovative web applications

## 📞 Contact

- **Email**: sarthak20574@iiitd.ac.in
- **GitHub**: [sarthak20574](https://github.com/sarthak20574)
- **LinkedIn**: [Connect with me](https://linkedin.com/in/sarthak20574)

---

**🌟 Star this repository if you found it helpful!**

**Ready to connect the world! 🌍**

