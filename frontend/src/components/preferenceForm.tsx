import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getAndParseJWT } from "./jwt.tsx";
import { showNotification } from "../App.tsx";

export interface Preference {
  _id?: string;
  user_id: string;
  theme: string;
  font: string;
  layout: string;
  active: boolean;
}

const PreferenceForm = () => {
  const { id } = useParams<{ id?: string }>();
  const [preference, setPreference] = useState<Preference>({
    user_id: "",
    theme: "",
    font: "",
    layout: "",
    active: true,
  });

  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPreference = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/preferences/single/${id}`
        );
        const data: Preference = response.data;
        setPreference({
          user_id: data.user_id || "",
          theme: data.theme || "",
          font: data.font || "",
          layout: data.layout || "",
          active: data.active ?? true,
        });
        setEditing(true);
        
      } catch (error) {
        showNotification("Preferences Error","Couldn't fetch preference");
      }
    };

    if (id) {
      fetchPreference();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    preference.user_id = getAndParseJWT()?.payload.id;
    try {
      if (editing && id) {
        await axios.put(`http://localhost:5000/preferences/${id}`, preference);
        showNotification("Preferences","Preferences was edited");
        navigate('/preferences');
      } else {
        await axios.post("http://localhost:5000/preferences", preference);
        showNotification("Preferences","Preferences was added");
      }

      setPreference({
        user_id: "",
        theme: "",
        font: "",
        layout: "",
        active: true,
      });
      setEditing(false);
    } catch (error) {
        showNotification("Preferences Error","Preferences submit failed: "+error);
    }
  };

  return (
    <div
      className="preferences"
      style={{ display: "flex", justifyContent: "center", padding: "20px" }}
    >
      <div style={{ maxWidth: "800px", width: "100%" }}>
        <Typography variant="h3" mb={4}>
          {editing ? "Edit Preferences" : "Create Preferences"}
        </Typography>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <FormControl fullWidth>
                  <InputLabel id="theme-label">Theme</InputLabel>
                  <Select
                    labelId="theme-label"
                    value={preference.theme}
                    label="Theme"
                    onChange={(e) =>
                      setPreference({ ...preference, theme: e.target.value })
                    }
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box mb={2}>
                <FormControl fullWidth>
                  <InputLabel id="font-label">Font</InputLabel>
                  <Select
                    labelId="font-label"
                    value={preference.font}
                    label="Font"
                    onChange={(e) =>
                      setPreference({ ...preference, font: e.target.value })
                    }
                  >
                    <MenuItem value="sans-serif">Open sans</MenuItem>
                    <MenuItem value="serif">Serif</MenuItem>
                    <MenuItem value="monospace">Monospace</MenuItem>
                    <MenuItem value="monospace">Arial</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box mb={2}>
                <FormControl fullWidth>
                  <InputLabel id="layout-label">Layout</InputLabel>
                  <Select
                    labelId="layout-label"
                    value={preference.layout}
                    label="Layout"
                    onChange={(e) =>
                      setPreference({ ...preference, layout: e.target.value })
                    }
                  >
                    <MenuItem value="grid">Grid</MenuItem>
                    <MenuItem value="list">List</MenuItem>
                    <MenuItem value="compact">Compact</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box mb={2}>
                <FormControl fullWidth>
                  <InputLabel id="active-label">Active</InputLabel>
                  <Select
                    labelId="active-label"
                    value={preference.active ? "true" : "false"}
                    label="Active"
                    onChange={(e) =>
                      setPreference({
                        ...preference,
                        active: e.target.value === "true",
                      })
                    }
                  >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained">
                  {editing ? "Update Preferences" : "Create Preferences"}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreferenceForm;
