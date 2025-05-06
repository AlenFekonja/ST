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
} from "@mui/material";
import { MoreVertical } from "lucide-react";
import VoiceCommand from "./voiceCommand.tsx";
import { useNavigate } from "react-router-dom";
import { getAndParseJWT } from "./jwt.tsx";
const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const useLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#333" }}>
      <Toolbar
        sx={{
          maxWidth: 1200,
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
          sx={{ listStyle: "none", margin: 0, padding: 0 }}
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
              href="/myRewards"
              underline="none"
              color="inherit"
              sx={{ fontSize: "1.1em", "&:hover": { color: "#1e90ff" } }}
            >
              My Rewards
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
            <IconButton
              onClick={handleClick}
              sx={{ color: "inherit", padding: 0 }}
            >
              <MoreVertical />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleClose}>
                <VoiceCommand />
              </MenuItem>
              <MenuItem onClick={() => navigate("/shortcuts")}>
                Shortcuts
              </MenuItem>
              <MenuItem onClick={useLogout}>Logout</MenuItem>
              {getAndParseJWT()?.payload?.admin && (
                <div>
                  <MenuItem onClick={() => navigate("/users")}>
                    Users - admin view
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/rewards")}>
                    Rewards - admin view
                  </MenuItem>
                </div>
              )}
            </Menu>
          </li>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
