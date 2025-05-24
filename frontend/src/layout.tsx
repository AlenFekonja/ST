import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/navbar.tsx";
import { Box, Typography, Stack } from "@mui/material";
import { getAndParseJWT } from "./components/jwt.tsx";
import { usePreferences } from "./components/PreferencesContext.tsx";
const Footer = () => {
  const { preference } = usePreferences();

  return (
    <Box
      component="footer"
      className="footer"
      sx={{
        py: 6,
        px: 4,
        backgroundColor: "#222",
        color: "white",
        mt: "auto",
      }}
    >
      <Box sx={{ maxWidth: 950, margin: "0 auto", textAlign: "left" }}>
        <Typography variant="h6" align="left" sx={{ mb: 2 }}>
          HobbyHub
        </Typography>

        {preference && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="flex-start"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="caption">
              Theme: <strong>{preference.theme}</strong>
            </Typography>
            <Typography variant="caption">
              Font: <strong>{preference.font}</strong>
            </Typography>
            <Typography variant="caption">
              Layout: <strong>{preference.layout}</strong>
            </Typography>
          </Stack>
        )}

        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          © 2025 HobbyHub. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = getAndParseJWT();
    if (!jwt) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: 0,
      }}
    >
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          padding: { xs: 1, sm: 2 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1000,
            padding: 2,
            borderRadius: 1,
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
