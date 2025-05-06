import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../App.tsx';
import { getAndParseJWT } from './jwt.tsx';

interface Reward {
    _id: string;
    level_required: string;
    name: string;
    description: string;
    condition_required: string;
  }

const RewardList = () => {

    const [rewards, setRewards] = useState<Reward[]>([]);
    const navigate = useNavigate();

    if(!getAndParseJWT()?.payload.admin) {
        navigate('/');
    }

    const fetchRewards = async () => {
        try {
            const response = await axios.get('http://localhost:5000/rewards');
            setRewards(response.data);
        } catch (error) {
            showNotification("Rewards Error","Couldn't fetch rewards");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/rewards/${id}`);
            fetchRewards();
            showNotification("Rewards","Reward was deleted");
        } catch (error) {
            showNotification("Rewards Error","Couldn't delete reward");
        }
    };

    useEffect(() => {
        fetchRewards();
    }, []);

    return (
        <div className="reward" style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <div style={{ maxWidth: '800px', width: '100%' }}>
                <Typography variant="h3" mb={4}>All Rewards List</Typography>

                <Button variant="outlined" sx={{ marginTop: '10px' }} onClick={() => navigate('/rewards/add')}>
                    Add Reward
                </Button>
                <div style={{ marginTop: '24px' }}>
                    {rewards.map((reward) => (
                        <Card key={reward._id} style={{ marginBottom: '16px' }}>
                            <CardContent>
                            <Typography>ID: {reward._id}</Typography>
                            <Typography>Condition required: {reward.condition_required}</Typography>              
                                <Typography >Name: {reward.name}</Typography>
                                <Typography>Description: {reward.description}</Typography>
                                <Typography>Level Required: {reward.level_required}</Typography>
                            </CardContent>

                            <Box display="flex" p={2}>
                                <Button onClick={() => navigate(`/rewards/edit/${reward._id}`)} variant="outlined">Edit</Button>
                                <Button onClick={() => handleDelete(reward._id)} variant="outlined" color="error">Delete</Button>
                            </Box>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RewardList;
