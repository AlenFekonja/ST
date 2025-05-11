import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../App.tsx';

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

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'started' | 'completed'>('all');
  const [loadingComplete, setLoadingComplete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      showNotification('Tasks Error', `Couldn't fetch tasks: ${error}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchTasks();
      showNotification('Tasks', 'Task was deleted');
    } catch (error) {
      showNotification('Tasks Error', 'Task was not deleted');
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
        'Tasks',
        `Task completed! +${completeRes.data.exp} EXP awarded.`
      );
    } catch (error: any) {
      console.error('handleComplete error:', error.response || error.message);
      const msg = error.response?.data?.error || error.response?.data?.message || error.message;
      showNotification('Error', msg);
    } finally {
      setLoadingComplete(null);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div className="task" style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <Typography variant="h4" mt={4}>
          Tasks List
        </Typography>

        <Button variant="outlined" sx={{ marginTop: '10px' }} onClick={() => navigate('/tasks/add')}>
          Add task
        </Button>
        <Box display="flex" gap={2} my={3}>
          <Button variant={filter === 'all' ? 'contained' : 'outlined'} onClick={() => setFilter('all')}>
            All
          </Button>
          <Button variant={filter === 'started' ? 'contained' : 'outlined'} onClick={() => setFilter('started')}>
            Started
          </Button>
          <Button variant={filter === 'completed' ? 'contained' : 'outlined'} onClick={() => setFilter('completed')}>
            Completed
          </Button>
        </Box>

        <div style={{ marginTop: '24px' }}>
          {filteredTasks.map((task) => (
            <Card key={task._id} style={{ marginBottom: '16px' }}>
              <CardContent>
                <Typography>ID: {task._id}</Typography>
                <Typography>Title: {task.title}</Typography>
                <Typography>Event date: {task.event_date}</Typography>
                <Typography>Start time: {task.start_time}</Typography>
                <Typography>End time: {task.end_time}</Typography>
                <Typography>Description: {task.description}</Typography>
                <Typography>Reminder: {task.reminder}</Typography>
                <Typography>Notes: {task.notes}</Typography>
                <Typography>Status: {task.status}</Typography>
              </CardContent>
              <Box display="flex" p={2} gap={2}>
                <Button onClick={() => navigate(`/tasks/edit/${task._id}`)} variant="outlined" disabled={task.status === 'completed'}>
                  Edit
                </Button>
                <Button onClick={() => handleDelete(task._id)} variant="outlined" color="error">
                  Delete
                </Button>
                {task.status !== 'completed' && (
                  <Button
                    onClick={() => handleComplete(task._id)}
                    variant="contained"
                    color="primary"
                    disabled={loadingComplete === task._id}
                  >
                    {loadingComplete === task._id ? 'Completing...' : 'Complete'}
                  </Button>
                )}
              </Box>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;