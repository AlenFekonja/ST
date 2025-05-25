"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";
import { showNotification } from "../App.tsx";
import { getAndParseJWT } from "./jwt.tsx";
import { useNavigate } from "react-router-dom";

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
    _id: "",
    username: "",
    email: "",
    password: "",
    points: 0,
    level: 1,
    admin: false,
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userPayload = getAndParseJWT()?.payload;
    if (!userPayload?.admin) {
      navigate("/");
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users", {
          withCredentials: true,
        });
      setUsers(response.data);
    } catch (error) {
      showNotification("Users Error", "Error fetching users");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (editingUser) {
        await axios.put(
          `http://localhost:5000/users/${editingUser._id}`,
          newUser, {
          withCredentials: true,
        });
        showNotification("Users", "User was updated");
      } else {
        await axios.post("http://localhost:5000/users", newUser, {
          withCredentials: true,
        });
        showNotification("Users", "User was added");
      }
      setEditingUser(null);
      setNewUser({
        _id: "",
        username: "",
        email: "",
        password: "",
        points: 0,
        level: 1,
        admin: false,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error submitting user:", error);
      showNotification("Users Error", "Error submitting user");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`, {
          withCredentials: true,
        });
      showNotification("Users", "User was deleted");
      fetchUsers();
    } catch (error: any) {
      showNotification(
        "Users Error",
        "Error deleting user: " + error.message || error
      );
    }
  };

  const handleAdminUpdate = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:5000/users/admin/${id}`,
        {},
        { withCredentials: true }
      );
      fetchUsers();
      showNotification("Users", "User admin status updated");
    } catch (error: any) {
      showNotification(
        "Users Error",
        "Error updating user admin status: " + error.message || error
      );
    }
  };

  const handleEdit = (user: User) => {
    setNewUser(user);
    setEditingUser(user);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box display="flex" justifyContent="center" padding="30px">
      <Box maxWidth="800px" width="100%">
        <Typography variant="h4" mb={3}>
          Users List
        </Typography>

        {users.map((user) => (
          <Card key={user._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography>Id: {user._id}</Typography>
              <Typography>Username: {user.username}</Typography>
              <Typography>Email: {user.email}</Typography>
              <Typography>Points: {user.points}</Typography>
              <Typography>Level: {user.level}</Typography>
              <Typography>Admin: {user.admin ? "Yes" : "No"}</Typography>
            </CardContent>

            <Box display="flex" gap={2} p={2}>
              <Button
                onClick={() => handleDelete(user._id)}
                variant="outlined"
                color="error"
              >
                Delete
              </Button>
              <Button
                onClick={() => handleAdminUpdate(user._id)}
                variant="outlined"
                color={user.admin ? "error" : "primary"}
              >
                {user.admin ? "Remove admin status" : "Give admin status"}
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default UserList;
