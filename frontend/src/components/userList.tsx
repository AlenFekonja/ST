"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { Button, TextField, Card, CardContent, Typography, Box } from '@mui/material'; 
import { showNotification } from '../App.tsx';
import { getAndParseJWT } from './jwt.tsx';
import { useNavigate } from 'react-router-dom';

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  points: number;
  level: number;
  admin: boolean;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]); 
  const [newUser, setNewUser] = useState<User>({
    _id: '', 
    username: '',
    email: '',
    password: '',
    points: 0,
    level: 1,
    admin:false
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const navigate = useNavigate();
    if(!getAndParseJWT()?.payload.admin) {
        navigate('/');
    }

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      showNotification("Users Error","Error fetching users");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        await axios.put(`http://localhost:5000/users/${editingUser._id}`, newUser);
      } else {
        await axios.post('http://localhost:5000/users', newUser);
      }

      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error submitting user:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      showNotification("Users","User was deleted");
      fetchUsers();
    } catch (error) {
      showNotification("Users","Error deleting user: "+error);
    }
  };

  const handleAdminUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/users/admin/${id}`,{},{withCredentials: true});
      fetchUsers();
      showNotification("Users","User admin status updated ");
    } catch (error) {
      showNotification("Users Error","Error updating user admin status: "+error);
    }
  };

  const handleEdit = (user) => {
    setNewUser(user);
    setEditingUser(user);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  {{console.log(users)}}
  return (
    
      <div className="user" style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
    <div className="user">

      <Typography variant="h4" mt={4}>Users List</Typography>

      <div style={{ marginTop: '24px' }}>
        {users.map((user) => (
         
          <Card key={user._id} style={{ marginBottom: '16px' }}>
            <CardContent>
            <Typography>Id: {user._id}</Typography>
              <Typography>Username: {user.username}</Typography>
              <Typography>Email: {user.email}</Typography>
              <Typography>Points: {user.points}</Typography>
              <Typography>Level: {user.level}</Typography>
              <Typography>Admin: {user.admin ? "Yes" : "No"}</Typography>
            </CardContent>

            <Box display="flex"  p={2}>
              <Button onClick={() => handleDelete(user._id)} variant="outlined" color="error">Delete</Button>
              <Button onClick={() => handleAdminUpdate(user._id)} variant="outlined" color={user.admin ? 'error' : 'primary'}>{user.admin ? "Remove admin status" : "Give admin status"}</Button>           
            </Box>
          </Card>
        ))}
      </div>
    </div>
    </div>

    </div>
  );
};

export default UserList;
