import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
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
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required /><br />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      {success && <p style={{color:'green'}}>{success}</p>}
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
    <div>
      <h2>News Feed</h2>
      <form onSubmit={handlePost}>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?" required /><br />
        <input type="file" accept="image/*,video/*" onChange={e => setFile(e.target.files[0])} />
        <button type="submit">Post</button>
      </form>
      {message && <p style={{color:'green'}}>{message}</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      <hr />
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map(post => (
        <div key={post._id} style={{border:'1px solid #ccc', margin:'10px 0', padding:10}}>
          <b>{post.user?.username || 'Unknown'}</b><br />
          <span>{new Date(post.createdAt).toLocaleString()}</span>
          <p>{post.content}</p>
          {post.image && <img src={`http://localhost:5000/${post.image}`} alt="post" width={200} />}
          {post.video && <video src={`http://localhost:5000/${post.video}`} controls width={200} />}
        </div>
      ))}
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

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleUpdate}>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required /><br />
        <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Bio" /><br />
        <button type="submit">Update Profile</button>
      </form>
      <br />
      <form onSubmit={handlePicture}>
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} required />
        <button type="submit">Upload Picture</button>
      </form>
      {profilePicture && <div><img src={`http://localhost:5000/${profilePicture}`} alt="Profile" width={100} /></div>}
      {message && <p style={{color:'green'}}>{message}</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
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
    <div>
      <h2>Friends</h2>
      
      {/* All Available Users Section */}
      <div style={{marginBottom: 20}}>
        <h3>Add Friends</h3>
        {loading ? (
          <p>Loading users...</p>
        ) : allUsers.length === 0 ? (
          <p>No other users found</p>
        ) : (
          <div>
            <p>Click "Add Friend" next to any user you want to connect with:</p>
            {allUsers.map(user => (
              <div key={user._id} style={{padding: 8, border: '1px solid #ddd', margin: 5, borderRadius: 4}}>
                <strong>{user.username}</strong> ({user.email})
                <button 
                  onClick={() => sendRequest(user._id)}
                  style={{marginLeft: 10, padding: '4px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer'}}
                >
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr />

      {/* Friend Requests Section */}
      <div style={{marginBottom: 20}}>
        <h3>Friend Requests ({requests.length})</h3>
        {requests.length === 0 ? (
          <p>No pending friend requests</p>
        ) : (
          requests.map(request => (
            <div key={request._id} style={{padding: 8, border: '1px solid #ddd', margin: 5, borderRadius: 4}}>
              <strong>{request.username}</strong>
              <button 
                onClick={() => acceptRequest(request._id)}
                style={{marginLeft: 10, padding: '4px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer'}}
              >
                Accept
              </button>
            </div>
          ))
        )}
      </div>

      <hr />

      {/* Friends List Section */}
      <div>
        <h3>Your Friends ({friends.length})</h3>
        {friends.length === 0 ? (
          <p>No friends yet. Add friends from the list above!</p>
        ) : (
          friends.map(friend => (
            <div key={friend._id} style={{padding: 8, border: '1px solid #ddd', margin: 5, borderRadius: 4}}>
              <strong>{friend.username}</strong>
            </div>
          ))
        )}
      </div>

      {/* Messages */}
      {message && <p style={{color:'green', marginTop: 10}}>{message}</p>}
      {error && <p style={{color:'red', marginTop: 10}}>{error}</p>}
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
    <div style={{ display: 'flex', minHeight: 300 }}>
      <div style={{ width: 200, borderRight: '1px solid #ccc', padding: 10 }}>
        <b>Friends</b>
        {friends.length === 0 && <div>No friends</div>}
        {friends.map(f => (
          <div key={f._id} style={{ cursor: 'pointer', background: selected === f._id ? '#eee' : '' }} onClick={() => fetchMessages(f._id)}>
            {f.username}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 10 }}>
        {selected ? (
          <>
            <div style={{ minHeight: 200, maxHeight: 300, overflowY: 'auto', border: '1px solid #ccc', marginBottom: 10, padding: 5 }}>
              {messages.length === 0 && <div>No messages yet</div>}
              {messages.map(m => (
                <div key={m._id} style={{ textAlign: m.sender === userId ? 'right' : 'left' }}>
                  <span style={{ background: m.sender === userId ? '#dcf8c6' : '#eee', padding: 4, borderRadius: 4, display: 'inline-block', margin: 2 }}>
                    {m.content}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage}>
              <input type="text" value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Type a message..." style={{ width: '80%' }} />
              <button type="submit">Send</button>
            </form>
          </>
        ) : <div>Select a friend to chat</div>}
        {error && <p style={{color:'red'}}>{error}</p>}
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
    <nav style={{ marginBottom: 20 }}>
      <Link to="/feed">Feed</Link> |{' '}
      <Link to="/profile">Profile</Link> |{' '}
      <Link to="/friends">Friends</Link> |{' '}
      <Link to="/messages">Messages</Link> |{' '}
      <Link to="/login">Login</Link> |{' '}
      <Link to="/register">Register</Link>
      {loggedIn && (
        <>
          {' '}|{' '}
          <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button>
        </>
      )}
    </nav>
  );
}

function App() {
  return (
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
  );
}

export default App;
