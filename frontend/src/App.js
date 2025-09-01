import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back! 👋</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        {error && <div className="error-message">{error}</div>}
        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
        </div>
      </div>
    </div>
  );
}

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${API_URL}/auth/register`, { username, email, password });
      setSuccess('Registration successful! You can now login.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Join SocialHub! 🚀</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="form-input"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Login here</Link>
        </div>
      </div>
    </div>
  );
}

function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      const res = await axios.get(`${API_URL}/posts/feed`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (err) {
      setError('Failed to load feed');
    }
  };

  useEffect(() => { fetchFeed(); /* eslint-disable-next-line */ }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('content', content);
      if (file) formData.append('media', file);
      await axios.post(`${API_URL}/posts`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setContent('');
      setFile(null);
      setMessage('Post created!');
      fetchFeed();
    } catch (err) {
      setError('Failed to create post');
    }
  };

  return (
    <div className="main-content">
      <div className="feed-container">
        <div className="create-post-card">
          <h3>Share something with your friends! ✨</h3>
          <form onSubmit={handlePost} className="post-form">
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder="What's on your mind?" 
              className="form-textarea post-textarea"
              required 
            />
            <div className="post-actions">
              <input 
                type="file" 
                accept="image/*,video/*" 
                onChange={e => setFile(e.target.files[0])} 
                className="file-input"
              />
              <button type="submit" className="btn btn-primary">Post</button>
            </div>
          </form>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="posts-container">
          {posts.length === 0 && (
            <div className="empty-state">
              <h3>No posts yet</h3>
              <p>Be the first to share something with your friends!</p>
            </div>
          )}
          {posts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <div className="post-user">
                  <div className="user-avatar">
                    {post.user?.profilePicture ? (
                      <img src={`${API_URL.replace('/api', '')}/${post.user.profilePicture}`} alt="Profile" />
                    ) : (
                      post.user?.username?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="user-info">
                    <strong>{post.user?.username || 'Unknown'}</strong>
                    <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="post-content">
                <p>{post.content}</p>
                {post.image && (
                  <div className="post-media">
                    <img src={`${API_URL.replace('/api', '')}/${post.image}`} alt="post" />
                  </div>
                )}
                {post.video && (
                  <div className="post-media">
                    <video src={`${API_URL.replace('/api', '')}/${post.video}`} controls />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        // Get user id from token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const id = payload.id;
        const res = await axios.get(`${API_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setUsername(res.data.username);
        setBio(res.data.bio || '');
        setProfilePicture(res.data.profilePicture);
      } catch (err) {
        setError('Failed to load profile');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload.id;
      const res = await axios.put(`${API_URL}/users/${id}`, { username, bio }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setMessage('Profile updated!');
    } catch (err) {
      setError('Update failed');
    }
  };

  const handlePicture = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload.id;
      const formData = new FormData();
      formData.append('profilePicture', file);
      const res = await axios.post(`${API_URL}/users/${id}/profile-picture`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setProfilePicture(res.data.profilePicture);
      setMessage('Profile picture updated!');
    } catch (err) {
      setError('Picture upload failed');
    }
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="main-content">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {profilePicture ? (
              <img src={`${API_URL.replace('/api', '')}/${profilePicture}`} alt="Profile" />
            ) : (
              user.username?.charAt(0)?.toUpperCase() || 'U'
            )}
          </div>
          <div className="profile-info">
            <h2>{user.username}</h2>
            <p className="profile-bio">{user.bio || 'No bio yet'}</p>
          </div>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h3>Update Profile</h3>
            <form onSubmit={handleUpdate} className="profile-form">
              <div className="form-group">
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  className="form-input"
                  required 
                />
              </div>
              <div className="form-group">
                <textarea 
                  value={bio} 
                  onChange={e => setBio(e.target.value)} 
                  placeholder="Tell us about yourself..." 
                  className="form-textarea"
                />
              </div>
              <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
          </div>

          <div className="profile-section">
            <h3>Profile Picture</h3>
            <form onSubmit={handlePicture} className="profile-form">
              <div className="form-group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setFile(e.target.files[0])} 
                  className="file-input"
                  required 
                />
              </div>
              <button type="submit" className="btn btn-secondary">Upload Picture</button>
            </form>
          </div>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

function Friends() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (!token) return navigate('/login');
    fetchFriends();
    fetchRequests();
    fetchAllUsers();
  }, [token, navigate]);

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${API_URL}/friends/list`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setFriends(res.data);
    } catch (err) { 
      console.error('Friends error:', err);
      setError('Failed to load friends'); 
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/friends/requests`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setRequests(res.data);
    } catch (err) { 
      console.error('Requests error:', err);
      setError('Failed to load requests'); 
    }
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users/all`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setAllUsers(res.data);
    } catch (err) { 
      console.error('Get users error:', err);
      setError('Failed to load users'); 
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (userId) => {
    setMessage('');
    setError('');
    try {
      await axios.post(`${API_URL}/friends/request/${userId}`, {}, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setMessage('Friend request sent successfully!');
      // Refresh the lists
      fetchAllUsers();
      fetchRequests();
    } catch (err) { 
      console.error('Send request error:', err);
      setError(err.response?.data?.message || 'Failed to send request'); 
    }
  };

  const acceptRequest = async (userId) => {
    setMessage('');
    setError('');
    try {
      await axios.post(`${API_URL}/friends/accept/${userId}`, {}, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setMessage('Friend request accepted!');
      fetchFriends();
      fetchRequests();
    } catch (err) { 
      console.error('Accept request error:', err);
      setError(err.response?.data?.message || 'Failed to accept request'); 
    }
  };

  return (
    <div className="main-content">
      <div className="friends-container">
        {/* All Available Users Section */}
        <div className="friends-section">
          <h3>Add Friends 👥</h3>
          {loading ? (
            <div className="loading">Loading users...</div>
          ) : allUsers.length === 0 ? (
            <div className="empty-state">No other users found</div>
          ) : (
            <div>
              <p>Click "Add Friend" next to any user you want to connect with:</p>
              <div className="users-grid">
                {allUsers.map(user => (
                  <div key={user._id} className="user-card">
                    <div className="user-avatar">
                      {user.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="user-info">
                      <strong>{user.username}</strong>
                      <span className="user-email">{user.email}</span>
                    </div>
                    <button 
                      onClick={() => sendRequest(user._id)}
                      className="btn btn-primary btn-sm"
                    >
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Friend Requests Section */}
        <div className="friends-section">
          <h3>Friend Requests ({requests.length}) 📨</h3>
          {requests.length === 0 ? (
            <div className="empty-state">No pending friend requests</div>
          ) : (
            <div className="requests-list">
              {requests.map(request => (
                <div key={request._id} className="request-card">
                  <div className="user-avatar">
                    {request.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="user-info">
                    <strong>{request.username}</strong>
                  </div>
                  <button 
                    onClick={() => acceptRequest(request._id)}
                    className="btn btn-success btn-sm"
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Friends List Section */}
        <div className="friends-section">
          <h3>Your Friends ({friends.length}) ❤️</h3>
          {friends.length === 0 ? (
            <div className="empty-state">No friends yet. Add friends from the list above!</div>
          ) : (
            <div className="friends-grid">
              {friends.map(friend => (
                <div key={friend._id} className="friend-card">
                  <div className="user-avatar">
                    {friend.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="user-info">
                    <strong>{friend.username}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

function Messages() {
  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/login');
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUserId(payload.id);
    const fetchFriends = async () => {
      try {
        const res = await axios.get(`${API_URL}/friends/list`, { headers: { Authorization: `Bearer ${token}` } });
        setFriends(res.data);
      } catch (err) { setError('Failed to load friends'); }
    };
    fetchFriends();
  }, [token, navigate]);

  const fetchMessages = async (friendId) => {
    setSelected(friendId);
    setMessages([]);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/messages/${friendId}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(res.data);
    } catch (err) { setError('Failed to load messages'); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    try {
      await axios.post(`${API_URL}/messages`, { receiver: selected, content: newMsg }, { headers: { Authorization: `Bearer ${token}` } });
      setNewMsg('');
      fetchMessages(selected);
    } catch (err) { setError('Failed to send message'); }
  };

  return (
    <div className="main-content">
      <div className="messages-container">
        <div className="messages-sidebar">
          <h3>Friends 💬</h3>
          {friends.length === 0 && <div className="empty-state">No friends</div>}
          {friends.map(f => (
            <div 
              key={f._id} 
              className={`friend-item ${selected === f._id ? 'active' : ''}`}
              onClick={() => fetchMessages(f._id)}
            >
              <div className="user-avatar">
                {f.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="user-info">
                <strong>{f.username}</strong>
              </div>
            </div>
          ))}
        </div>
        <div className="messages-main">
          {selected ? (
            <>
              <div className="messages-header">
                <h3>Chat with {friends.find(f => f._id === selected)?.username}</h3>
              </div>
              <div className="messages-list">
                {messages.length === 0 && <div className="empty-state">No messages yet</div>}
                {messages.map(m => (
                  <div key={m._id} className={`message ${m.sender === userId ? 'sent' : 'received'}`}>
                    <div className="message-content">{m.content}</div>
                    <div className="message-time">
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="message-form">
                <input 
                  type="text" 
                  value={newMsg} 
                  onChange={e => setNewMsg(e.target.value)} 
                  placeholder="Type a message..." 
                  className="message-input"
                />
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </>
          ) : (
            <div className="messages-placeholder">
              Select a friend to start chatting
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  // Always check localStorage for token on every render
  const loggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/feed" className="brand-link">
          <span className="brand-icon">📱</span>
          <span className="brand-text">SocialHub</span>
        </Link>
      </div>
      <div className="navbar-nav">
        <Link to="/feed" className={`nav-link ${location.pathname === '/feed' ? 'active' : ''}`}>
          Feed
        </Link>
        <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
          Profile
        </Link>
        <Link to="/friends" className={`nav-link ${location.pathname === '/friends' ? 'active' : ''}`}>
          Friends
        </Link>
        <Link to="/messages" className={`nav-link ${location.pathname === '/messages' ? 'active' : ''}`}>
          Messages
        </Link>
        {!loggedIn && (
          <>
            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
              Login
            </Link>
            <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>
              Register
            </Link>
          </>
        )}
        {loggedIn && (
          <button onClick={handleLogout} className="btn btn-outline btn-sm">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="app">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/" element={<Navigate to="/feed" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
