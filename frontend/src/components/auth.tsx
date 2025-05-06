import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { showNotification } from '../App.tsx';

const AuthComponent = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/users/login', { email, password });
            document.cookie = `token=${response.data.accessToken}; path=/; secure; samesite=None`;
            navigate('/tasks');
            showNotification("Login","You are now logged in");
        } catch (error) {
            showNotification("Login Failed","Try again");
        }
    };

    return (
        <Card style={{ maxWidth: 400, margin: 'auto', padding: '20px' }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>Authentication</Typography>
                <TextField 
                    label="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    fullWidth 
                    margin="normal" 
                />
                <TextField 
                    label="Password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    fullWidth 
                    margin="normal" 
                />
                <Link to={'/register'} style={{ marginTop: 10 }}>Register</Link>
                <Button variant="contained" color="primary" onClick={handleLogin} fullWidth style={{ marginTop: 10 }}>Login</Button>         
                {message && <Typography color="error" style={{ marginTop: 10 }}>{message}</Typography>}
            </CardContent>
        </Card>
    );
};

export default AuthComponent;