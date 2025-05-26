import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Link,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { MoreVertical, User } from "lucide-react";
import VoiceCommand from "./voiceCommand.tsx";
import { useNavigate } from "react-router-dom";
import { getAndParseJWT } from "./jwt.tsx";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const useLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    navigate("/");
  };

  const user = getAndParseJWT()?.payload;

  return (
    <AppBar
      className="navbar"
      position="static"
      sx={{ backgroundColor: "#333" }}
    >
      <Toolbar
        sx={{
          maxWidth: 1200,
          height: "80px",
          width: "100%",
          marginX: "auto",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center">
          <Box
            component="img"
            src="/icons/logo.png"
            alt="logo"
            sx={{ height: "60px", width: "auto", marginRight: 2 }}
          />
          <Link
            href="/tasks"
            underline="none"
            color="inherit"
            sx={{ fontSize: "1.8em", fontWeight: "bold" }}
          >
            HobbyHub
          </Link>
        </Box>

        <Stack
          direction="row"
          spacing={4}
          component="ul"
          sx={{ listStyle: "none", m: 0, p: 0 }}
        >
          <li>
            <Link
              href="/tasks"
              underline="none"
              color="inherit"
              sx={{ fontSize: "1.1em", "&:hover": { color: "#1e90ff" } }}
            >
              Tasks
            </Link>
          </li>
          <li>
            <Link
              href="/preferences"
              underline="none"
              color="inherit"
              sx={{ fontSize: "1.1em", "&:hover": { color: "#1e90ff" } }}
            >
              Preferences
            </Link>
          </li>
          <li>
            <Tooltip title="Profile">
              <IconButton
                onClick={() => navigate("/profile")}
                sx={{ color: "inherit", p: 0 }}
              >
                <User />
              </IconButton>
            </Tooltip>
          </li>
          <li>
            <IconButton onClick={handleClick} sx={{ color: "inherit", p: 0 }}>
              <MoreVertical />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {user?.email && (
                <MenuItem disabled>Logged in as: {user.email}</MenuItem>
              )}
              <MenuItem onClick={handleClose}>
                <VoiceCommand />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/shortcuts");
                }}
              >
                Shortcuts
              </MenuItem>
              {user?.admin && (
                <>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/users");
                    }}
                  >
                    Users (admin)
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/rewards");
                    }}
                  >
                    Rewards (admin)
                  </MenuItem>
                </>
              )}
              <MenuItem onClick={useLogout}>Logout</MenuItem>
            </Menu>
          </li>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
