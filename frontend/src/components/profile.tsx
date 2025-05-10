import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Button,
  Avatar,
  Divider,
  Stack,
  LinearProgress,
} from "@mui/material";
import axios from "axios";
import { getAndParseJWT } from "./jwt.tsx";

interface UserProfile {
  _id: string;
  email: string;
  admin: boolean;
  points: number;
  level: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const jwtData = getAndParseJWT()?.payload;
  const userId = jwtData?.id;

  // State and effects must be at top level
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    axios
      .get<UserProfile>(`http://localhost:5000/users/${userId}`, {
        withCredentials: true,
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error fetching profile:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  // Redirect if not logged in
  if (!jwtData) {
    navigate("/");
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  // No profile found
  if (!profile) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>Profile not found.</Typography>
      </Box>
    );
  }

  const getInitials = (email: string) =>
    email.charAt(0)?.toUpperCase() || "U";

  const LEVEL_THRESHOLD = 100;
  const currentExp = profile.points % LEVEL_THRESHOLD;
  const progressPercent = Math.min((currentExp / LEVEL_THRESHOLD) * 100, 100);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="90vh"
      sx={{ backgroundColor: "#eef2f5", padding: 4 }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          paddingY: 4,
          paddingX: 3,
          boxShadow: 5,
          borderRadius: 4,
          backgroundColor: "#ffffff",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar
            sx={{
              bgcolor: "#1e90ff",
              width: 80,
              height: 80,
              fontSize: 32,
              marginBottom: 1,
            }}
          >
            {getInitials(profile.email)}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {profile.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.admin ? "Administrator" : "Standard User"}
          </Typography>
        </Box>

        <Divider sx={{ marginY: 2 }} />

        <Stack spacing={1} mb={3}>
          <ProfileItem label="User ID" value={profile._id} />
          <ProfileItem label="Level" value={profile.level} />
          <Box>
            <Typography color="text.secondary">EXP</Typography>
            <Typography fontWeight="medium" mb={0.5}>
              {currentExp} / {LEVEL_THRESHOLD} ({Math.round(progressPercent)}%)
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </Button>
        </Stack>
      </Card>

      <Button
        variant="text"
        sx={{ marginTop: 2, color: "#555", textTransform: "none" }}
        onClick={() => navigate(-1)}
      >
        ← Go Back
      </Button>
    </Box>
  );
};

const ProfileItem = ({ label, value }: { label: string; value: any }) => (
  <Box display="flex" justifyContent="space-between">
    <Typography color="text.secondary">{label}</Typography>
    <Typography fontWeight="medium">{value}</Typography>
  </Box>
);

export default Profile;
