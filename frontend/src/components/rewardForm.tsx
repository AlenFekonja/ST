import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "../App.tsx";
import { getAndParseJWT } from "./jwt.tsx";

interface Reward {
  _id?: string;
  level_required: number;
  name: string;
  description: string;
  condition_required: string;
}

const RewardForm = () => {
  const { id } = useParams<{ id?: string }>();

  const [newReward, setNewReward] = useState<Reward>({
    level_required: 0,
    name: "",
    description: "",
    condition_required: "",
  });

  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

    if(!getAndParseJWT()?.payload.admin) {
        navigate('/');
    }

  useEffect(() => {
    const fetchReward = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/rewards/${id}`);
        const reward: Reward = response.data;
        setNewReward({
          level_required: reward.level_required || 0,
          name: reward.name || "",
          description: reward.description || "",
          condition_required: reward.condition_required || "",
        });
        setEditing(true);
      } catch (error) {
        showNotification("Rewards Error","Error fetching reward: "+error);
      }
    };

    if (id) {
      fetchReward();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editing && id) {
        await axios.put(`http://localhost:5000/rewards/${id}`, newReward);
        showNotification("Rewards","Reward was edited");
        navigate('/rewards');
      } else {
        await axios.post("http://localhost:5000/rewards", newReward);
        showNotification("Rewards","Reward was added");
      }

      setNewReward({
        level_required: 0,
        name: "",
        description: "",
        condition_required: "",
      });
      setEditing(false);
    } catch (error) {
        showNotification("Rewards Error","Error submitting reward:"+ error);
    }
  };

  return (
    <div
      className="reward"
      style={{ display: "flex", justifyContent: "center", padding: "20px" }}
    >
      <div style={{ maxWidth: "800px", width: "100%" }}>
        <Typography variant="h3" mb={4}>
          {editing ? "Edit Reward" : "Create Reward"}
        </Typography>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <TextField
                  label="Reward Name"
                  value={newReward.name}
                  onChange={(e) =>
                    setNewReward({ ...newReward, name: e.target.value })
                  }
                  required
                  fullWidth
                />
              </Box>

              <Box mb={2}>
                <TextField
                  label="Level Required"
                  type="number"
                  value={newReward.level_required}
                  onChange={(e) =>
                    setNewReward({
                      ...newReward,
                      level_required: Number(e.target.value),
                    })
                  }
                  required
                  fullWidth
                />
              </Box>

              <Box mb={2}>
                <TextField
                  label="Description"
                  value={newReward.description}
                  onChange={(e) =>
                    setNewReward({ ...newReward, description: e.target.value })
                  }
                  fullWidth
                />
              </Box>

              <Box mb={2}>
                <TextField
                  label="Condition Required"
                  value={newReward.condition_required}
                  onChange={(e) =>
                    setNewReward({
                      ...newReward,
                      condition_required: e.target.value,
                    })
                  }
                  fullWidth
                />
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained">
                  {editing ? "Update Reward" : "Create Reward"}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RewardForm;
