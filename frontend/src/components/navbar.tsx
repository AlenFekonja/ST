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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { MoreVertical, User, Menu as MenuIcon } from "lucide-react";
import VoiceCommand from "./voiceCommand.tsx";
import { useNavigate } from "react-router-dom";
import { getAndParseJWT } from "./jwt.tsx";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  const useLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    navigate("/");
  };

  const user = getAndParseJWT()?.payload;

  // Meni linki za desktop in mobile
  const navLinks = [
    { label: "Tasks", href: "/tasks" },
    { label: "Rewards", href: "/rewardsList" },
    { label: "Preferences", href: "/preferences" },
  ];

  return (
    <AppBar
      className="navbar"
      position="static"
      sx={{ backgroundColor: "#333" }}
    >
      <Toolbar
        sx={{
          maxWidth: { xs: "100%", sm: 1200 },
          height: { xs: "auto", sm: "80px" },
          width: "100%",
          marginX: "auto",
          justifyContent: "space-between",
          paddingX: { xs: 2, sm: 0 },
          flexWrap: "wrap",
        }}
      >
        {/* Logo + Brand */}
        <Box display="flex" alignItems="center">
          <Box
            component="img"
            src="/icons/logo.png"
            alt="logo"
            sx={{
              height: "60px",
              width: "auto",
              mr: { xs: 1, sm: 2 },
            }}
          />
          <Link
            href="/tasks"
            underline="none"
            color="inherit"
            sx={{
              fontSize: { xs: "1.3em", sm: "1.8em" },
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            HobbyHub
          </Link>
        </Box>

        {/* Desktop links */}
        {!isMobile && (
          <Stack
            direction="row"
            spacing={4}
            component="ul"
            sx={{ listStyle: "none", m: 0, p: 0 }}
          >
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  underline="none"
                  color="inherit"
                  sx={{ fontSize: "1.1em", "&:hover": { color: "#1e90ff" } }}
                >
                  {label}
                </Link>
              </li>
            ))}
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
              <IconButton
                onClick={handleMenuClick}
                sx={{ color: "inherit", p: 0 }}
                aria-controls={open ? "more-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <MoreVertical />
              </IconButton>
              <Menu
                id="more-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <VoiceCommand />
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/shortcuts");
                  }}
                >
                  Shortcuts
                </MenuItem>
                {user?.email && (
                  <MenuItem disabled>Logged in as: {user.email}</MenuItem>
                )}
                <MenuItem onClick={useLogout}>Logout</MenuItem>
                {user?.admin && (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/users");
                      }}
                    >
                      Users (admin)
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/rewards");
                      }}
                    >
                      Rewards (admin)
                    </MenuItem>
                  </>
                )}
              </Menu>
            </li>
          </Stack>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <>
            <Tooltip title="Profile">
              <IconButton
                onClick={() => navigate("/profile")}
                sx={{ color: "inherit" }}
              >
                <User />
              </IconButton>
            </Tooltip>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={toggleMobileDrawer}
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="right"
              open={mobileOpen}
              onClose={toggleMobileDrawer}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleMobileDrawer}
                onKeyDown={toggleMobileDrawer}
              >
                <List>
                  {navLinks.map(({ label, href }) => (
                    <ListItem key={label} disablePadding>
                      <ListItemButton
                        component="a"
                        href={href}
                        sx={{ textDecoration: "none" }}
                      >
                        <ListItemText primary={label} />
                      </ListItemButton>
                    </ListItem>
                  ))}

                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate("/shortcuts");
                      }}
                    >
                      <ListItemText primary="Shortcuts" />
                    </ListItemButton>
                  </ListItem>

                  {user?.email && (
                    <ListItem>
                      <ListItemText
                        primary={`Logged in as: ${user.email}`}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                  )}

                  <ListItem disablePadding>
                    <ListItemButton onClick={useLogout}>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </ListItem>

                  {user?.admin && (
                    <>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {
                            navigate("/users");
                          }}
                        >
                          <ListItemText primary="Users (admin)" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {
                            navigate("/rewards");
                          }}
                        >
                          <ListItemText primary="Rewards (admin)" />
                        </ListItemButton>
                      </ListItem>
                    </>
                  )}
                </List>
              </Box>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
