import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography, Box } from '@mui/material';
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
}

const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const navigate = useNavigate();

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/tasks');
            setTasks(response.data);
        } catch (error) {
            showNotification("Tasks Error","Couldn't fetch tasks: "+ error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/tasks/${id}`);
            fetchTasks();
            showNotification("Tasks","Task was deleted");
        } catch (error) {
            showNotification("Tasks Error","Task was not deleted");
        }
    };



    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="task" style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <div style={{ maxWidth: '800px', width: '100%' }}>

                <Typography variant="h4" mt={4}>Tasks List</Typography>

                <Button variant="outlined" sx={{ marginTop: '10px' }} onClick={() => navigate('/tasks/add')}>
                    Add task
                </Button>
                <div style={{ marginTop: '24px' }}>
                    {tasks.map((task) => (
                        <Card key={task._id} style={{ marginBottom: '16px' }}>
                            <CardContent>
                            <Typography>ID: {task._id.toString()}</Typography>
                                <Typography>Title: {task.title}</Typography>
                                <Typography>Event date: {task.event_date}</Typography>
                                <Typography>Start time: {task.start_time}</Typography>
                                <Typography>End time: {task.end_time}</Typography>
                                <Typography>Description: {task.description}</Typography>
                                <Typography>Reminder: {task.reminder}</Typography>
                                <Typography>Notes: {task.notes}</Typography>
                            </CardContent>

                            <Box display="flex" p={2}>
                            <Button onClick={() => navigate(`/tasks/edit/${task._id}`)} variant="outlined">Edit</Button>
                                <Button onClick={() => handleDelete(task._id)} variant="outlined" color="error">Delete</Button>
                            </Box>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskList;
