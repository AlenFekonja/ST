import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Typography, Box, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { showNotification } from "../../App.tsx";
import "./taskList.css";

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
  status?: "started" | "completed";
}

interface TaskListProps {
  embedded?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ embedded = false }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "started" | "completed">("all");
  const [loadingComplete, setLoadingComplete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(response.data);
    } catch (error) {
      showNotification("Tasks Error", `Couldn't fetch tasks: ${error}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchTasks();
      showNotification("Tasks", "Task was deleted");
    } catch (error) {
      showNotification("Tasks Error", "Task was not deleted");
    }
  };

  const handleComplete = async (taskId: string) => {
    setLoadingComplete(taskId);
    try {
      const completeRes = await axios.put(
        `http://localhost:5000/tasks/${taskId}/complete`,
        {},
        { withCredentials: true }
      );

      fetchTasks();
      showNotification(
        "Tasks",
        `Task completed! +${completeRes.data.exp} EXP awarded.`
      );
    } catch (error: any) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      showNotification("Error", msg);
    } finally {
      setLoadingComplete(null);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  return (
    <div>
      {!embedded && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ fontFamily: "inherit" }}
          >
            Tasks List
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              onClick={() => navigate("/calendar")}
              sx={{ fontFamily: "inherit" }}
            >
              Calendar View
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/tasks/add")}
              sx={{ fontFamily: "inherit" }}
            >
              Add task
            </Button>
          </Box>
        </Box>
      )}

      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box display="flex" gap={1}>
          <Button
            variant={filter === "all" ? "contained" : "outlined"}
            onClick={() => setFilter("all")}
            size="small"
            sx={{ fontFamily: "inherit" }}
          >
            All
          </Button>
          <Button
            variant={filter === "started" ? "contained" : "outlined"}
            onClick={() => setFilter("started")}
            size="small"
            sx={{ fontFamily: "inherit" }}
          >
            Started
          </Button>
          <Button
            variant={filter === "completed" ? "contained" : "outlined"}
            onClick={() => setFilter("completed")}
            size="small"
            sx={{ fontFamily: "inherit" }}
          >
            Completed
          </Button>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate("/tasks/add")}
          size="small"
          sx={{ fontFamily: "inherit" }}
        >
          Add Task
        </Button>
      </Box>

      <div className="task-container">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="task-card"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                className="task-title"
                sx={{ fontFamily: "inherit" }}
              >
                {task.title}
              </Typography>
              {task.status === "completed" && (
                <CheckCircleIcon color="success" titleAccess="Completed" />
              )}
            </Box>

            <Box
              display="flex"
              gap={3}
              flexWrap="wrap"
              color="text.secondary"
              mb={2}
              sx={{ fontSize: "0.9rem" }}
            >
              <Box display="flex" alignItems="center" gap={0.4}>
                <EventIcon fontSize="small" />
                <Typography sx={{ fontFamily: "inherit" }}>
                  {new Date(task.event_date).toLocaleDateString("sl-SI", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.4}>
                <AccessTimeIcon fontSize="small" />
                <Typography sx={{ fontFamily: "inherit" }}>
                  {task.start_time} - {task.end_time}
                </Typography>
              </Box>
              <Typography
                sx={{ fontFamily: "inherit" }}
                className="task-category"
              >
                {task.category}{" "}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              className="task-description"
              sx={{ fontFamily: "inherit" }}
            >
              {task.description || "No description"}
            </Typography>

            <Box
              display="flex"
              gap={3}
              flexWrap="wrap"
              mt={3}
              mb={1}
              color="text.secondary"
            >
              <Typography variant="caption" sx={{ fontFamily: "inherit" }}>
                Reminder:{" "}
                {new Date(task.event_date).toLocaleDateString("sl-SI", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }) || "-"}
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: "inherit" }}>
                Notes: {task.notes || "-"}
              </Typography>
            </Box>

            <Box display="flex" gap={1} mt={1}>
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => navigate(`/tasks/edit/${task._id}`)}
                  disabled={task.status === "completed"}
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => handleDelete(task._id)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {task.status !== "completed" && (
                <Button
                  onClick={() => handleComplete(task._id)}
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ fontFamily: "inherit" }}
                  disabled={loadingComplete === task._id}
                >
                  {loadingComplete === task._id ? "Completing..." : "Complete"}
                </Button>
              )}
            </Box>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
