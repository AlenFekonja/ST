import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "../App.tsx";
import { getAndParseJWT } from "./jwt.tsx";

export interface Task {
  _id: string;
  user_id: string | { _id: string };
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  description: string;
  category: string;
  reminder: string;
  notes: string;
  status?: 'started' | 'completed';
}

const TaskForm = () => {
  const { id } = useParams();
  const [newTask, setNewTask] = useState({
    user_id: "",
    title: "",
    event_date: "",
    start_time: "",
    end_time: "",
    description: "",
    category: "",
    reminder: "",
    notes: "",
    status: "started", // 👈 default to 'started'
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const formatDateTimeLocal = (isoString: string) => {
      if (!isoString) return '';
      const date = new Date(isoString);
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - offset * 60000);
      return localDate.toISOString().slice(0, 16);
    };

    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tasks/${id}`);
        const task = response.data;
        const userId =
          typeof task.user_id === "object" && task.user_id !== null
            ? task.user_id._id
            : task.user_id?.toString() || "";

        setNewTask({
          user_id: userId,
          title: task.title || "",
          event_date: task.event_date?.slice(0, 10) || "",
          start_time: task.start_time?.slice(0, 5) || "",
          end_time: task.end_time?.slice(0, 5) || "",
          description: task.description || "",
          category: task.category || "",
          reminder: formatDateTimeLocal(task.reminder || ''),
          notes: task.notes || "",
          status: task.status || "started",
        });

        setEditingTask(task);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    newTask.user_id = getAndParseJWT()?.payload.id;
    try {
      if (editingTask) {
        await axios.put(
          `http://localhost:5000/tasks/${editingTask._id}`,
          newTask
        );
        showNotification("Tasks", "Task was edited");
        navigate('/tasks');
      } else {
        await axios.post("http://localhost:5000/tasks", newTask);
        showNotification("Tasks", "Task was added");
      }

      setNewTask({
        user_id: "",
        title: "",
        event_date: "",
        start_time: "",
        end_time: "",
        description: "",
        category: "",
        reminder: "",
        notes: "",
        status: "started",
      });

      setEditingTask(null);
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  return (
    <Box display="flex" justifyContent="center" padding="20px">
      <Box maxWidth="800px" width="100%">
        <Typography variant="h3" mb={4}>
          Task
        </Typography>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <TextField
                  label="Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  required
                  fullWidth
                />
              </Box>

              <Box mb={2}>
                <TextField
                  label="Event Date"
                  type="date"
                  value={newTask.event_date}
                  onChange={(e) =>
                    setNewTask({ ...newTask, event_date: e.target.value })
                  }
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Box mb={2}>
                <TextField
                  label="Start Time"
                  type="time"
                  value={newTask.start_time}
                  onChange={(e) =>
                    setNewTask({ ...newTask, start_time: e.target.value })
                  }
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Box mb={2}>
                <TextField
                  label="End Time"
                  type="time"
                  value={newTask.end_time}
                  onChange={(e) =>
                    setNewTask({ ...newTask, end_time: e.target.value })
                  }
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Box mb={2}>
                <TextField
                  label="Description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  fullWidth
                />
              </Box>

              <Box mb={2}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newTask.category}
                    onChange={(e) =>
                      setNewTask({ ...newTask, category: e.target.value })
                    }
                    label="Category"
                  >
                    {["work", "school", "sport", "hobby", "personal"].map(
                      (option) => (
                        <MenuItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Box>

              <Box mb={2}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newTask.status}
                    onChange={(e) =>
                      setNewTask({ ...newTask, status: e.target.value })
                    }
                    label="Status"
                  >
                    <MenuItem value="started">Started</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box mb={2}>
                <TextField
                  label="Reminder"
                  type="datetime-local"
                  value={newTask.reminder}
                  onChange={(e) =>
                    setNewTask({ ...newTask, reminder: e.target.value })
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Box mb={2}>
                <TextField
                  label="Notes"
                  value={newTask.notes}
                  onChange={(e) =>
                    setNewTask({ ...newTask, notes: e.target.value })
                  }
                  fullWidth
                />
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained">
                  {editingTask ? "Update Task" : "Create Task"}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default TaskForm;
