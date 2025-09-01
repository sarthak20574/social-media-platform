# 🚀 Deployment Guide

This guide will help you deploy your Social Media Platform to production for free.

## 📋 Prerequisites

1. **Git** - [Download here](https://git-scm.com/download/win)
2. **GitHub Account** - [Sign up here](https://github.com)
3. **MongoDB Atlas Account** - [Sign up here](https://mongodb.com/atlas) (Free)

## 🎯 Deployment Steps

### Step 1: Push to GitHub

1. **Install Git** (if not already installed)
2. **Open terminal in your project folder**
3. **Run these commands:**

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete social media platform"

# Go to GitHub.com and create a new repository
# Copy the repository URL and run:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Set up MongoDB Atlas (Free)

1. **Go to [MongoDB Atlas](https://mongodb.com/atlas)**
2. **Create free account**
3. **Create a new cluster** (choose free tier)
4. **Create database user:**
   - Username: `your_username`
   - Password: `your_password`
5. **Whitelist IP addresses:**
   - Add `0.0.0.0/0` (allows all IPs)
6. **Get connection string:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

### Step 3: Deploy Backend to Railway (Free)

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Create new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select "backend" folder
4. **Add environment variables:**
   - `PORT` = `5000`
   - `JWT_SECRET` = `your_super_secret_jwt_key_here`
   - `MONGODB_URI` = `mongodb+srv://username:password@cluster.mongodb.net/social_media`
5. **Deploy** - Railway will automatically deploy your backend
6. **Copy the deployment URL** (e.g., `https://your-app.railway.app`)

### Step 4: Deploy Frontend to Vercel (Free)

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Import your repository:**
   - Click "New Project"
   - Import your GitHub repository
   - Select "frontend" folder
4. **Configure build settings:**
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
5. **Add environment variable:**
   - `REACT_APP_API_URL` = `https://your-backend-url.railway.app/api`
6. **Deploy** - Vercel will automatically deploy your frontend

### Step 5: Update Backend for Production

Update your backend `index.js` to serve static files in production:

```javascript
// Add this before app.listen()
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}
```

## 🔧 Environment Variables Summary

### Backend (Railway)
```
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social_media
NODE_ENV=production
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

## 🌐 Your Live URLs

After deployment, you'll have:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app`
- **Database**: MongoDB Atlas (cloud)

## 🎉 Testing Your Deployment

1. **Visit your Vercel URL**
2. **Register a new account**
3. **Test all features:**
   - Login/Register
   - Create posts
   - Add friends
   - Send messages
   - Upload profile pictures

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Make sure your backend URL is correct in frontend environment variables

2. **Database Connection:**
   - Check MongoDB Atlas connection string
   - Ensure IP whitelist includes all IPs (0.0.0.0/0)

3. **File Uploads:**
   - Railway may not persist file uploads
   - Consider using cloud storage (AWS S3, Cloudinary) for production

4. **Environment Variables:**
   - Double-check all environment variables are set correctly
   - Restart deployments after changing environment variables

## 📈 Next Steps

1. **Custom Domain** - Add your own domain to Vercel
2. **SSL Certificate** - Automatically provided by Vercel/Railway
3. **Monitoring** - Add error tracking (Sentry)
4. **Analytics** - Add Google Analytics
5. **Performance** - Optimize images and bundle size

## 💰 Cost

- **Vercel**: Free (with limitations)
- **Railway**: Free (with limitations)
- **MongoDB Atlas**: Free (512MB storage)
- **Total**: $0/month

---

**🎊 Congratulations! Your social media platform is now live on the internet!**

