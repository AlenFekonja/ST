import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { showNotification } from "../App.tsx";
import { usePreferences } from "./PreferencesContext.tsx"; // PRAVILEN import hooka

const AuthComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message] = useState("");
  const navigate = useNavigate();

  const { preference } = usePreferences(); // PRIDOBI preference
  const theme = preference?.theme ?? "light";
  const font = preference?.font ?? "sans-serif";

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });
      document.cookie = `token=${response.data.accessToken}; path=/; secure; samesite=None`;
      navigate("/tasks");
      showNotification("Login", "You are now logged in");
    } catch (error) {
      showNotification("Login Failed", "Try again");
    }
  };

  return (
    <Card
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: "20px",
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
        fontFamily: font,
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom style={{ fontFamily: font }}>
          Authentication
        </Typography>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            style: { color: theme === "dark" ? "#ccc" : "#000" },
          }}
          InputProps={{
            style: {
              color: theme === "dark" ? "#fff" : "#000",
              fontFamily: font,
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            style: { color: theme === "dark" ? "#ccc" : "#000" },
          }}
          InputProps={{
            style: {
              color: theme === "dark" ? "#fff" : "#000",
              fontFamily: font,
            },
          }}
        />
        <div style={{ marginTop: 10 }}>
          <Link
            to="/register"
            style={{
              color: theme === "dark" ? "#90caf9" : "#1976d2",
              fontFamily: font,
            }}
          >
            Register
          </Link>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          fullWidth
          style={{ marginTop: 10, fontFamily: font }}
        >
          Login
        </Button>
        {message && (
          <Typography color="error" style={{ marginTop: 10 }}>
            {message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthComponent;
