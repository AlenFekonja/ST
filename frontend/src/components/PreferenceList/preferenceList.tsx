import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Stack,
  Card,
  CardContent,
  Button,
  IconButton,
} from "@mui/material";

import { getAndParseJWT } from "../jwt.tsx";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../../App.tsx";

// Ikone za preference:
import PaletteIcon from "@mui/icons-material/Palette";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export interface Preference {
  _id?: string;
  user_id?: string;
  theme: string;
  font: string;
  layout: string;
  active: boolean;
}

const PreferencesList = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<Preference[]>([]);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/${getAndParseJWT()?.payload.id}`
      );
      setPreferences(response.data);
    } catch (error) {
      showNotification(
        "Preferences Error",
        "Couldn't fetch preferences: " + error
      );
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(`http://localhost:5000/preferences/${id}`);
      fetchPreferences();
      showNotification("Preferences", "Preference was deleted");
    } catch (error) {
      showNotification("Preferences Error", "Preference was not deleted");
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      paddingTop={5}
      alignItems="center"
      mb={3}
    >
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4, // margin bottom za razmik spodaj
            flexWrap: "wrap", // omogoči prelom, če ni prostora
          }}
        >
          <Typography variant="h4" sx={{ fontFamily: "inherit" }}>
            Preferences
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/preferences/add")}
            sx={{ fontFamily: "inherit" }}
          >
            Add preference
          </Button>
        </Box>

        {preferences.length === 0 && (
          <Typography>No preferences found.</Typography>
        )}

        <Stack spacing={2}>
          {preferences.map((preference) => (
            <Card
              key={preference._id}
              sx={{
                transition: "all 0.2s ease",
                borderRadius: "8px",
                boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.15)",
                position: "relative",
                userSelect: "none",
                border: "1px solid rgb(205, 205, 205)",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                  zIndex: 10,
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                    flexGrow: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PaletteIcon color="primary" />
                    <Typography variant="body1" sx={{ fontFamily: "inherit" }}>
                      {preference.theme}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <FontDownloadIcon color="secondary" />
                    <Typography variant="body1" sx={{ fontFamily: "inherit" }}>
                      {preference.font}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ViewQuiltIcon color="action" />
                    <Typography variant="body1" sx={{ fontFamily: "inherit" }}>
                      {preference.layout}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {preference.active ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                    <Typography variant="body1" sx={{ fontFamily: "inherit" }}>
                      {preference.active ? "Active" : "Inactive"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    onClick={() =>
                      navigate(`/preferences/edit/${preference._id}`)
                    }
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => handleDelete(preference._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default PreferencesList;
