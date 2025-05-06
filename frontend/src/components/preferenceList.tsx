import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography, Box } from '@mui/material';
import { getAndParseJWT } from './jwt.tsx';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../App.tsx';

export interface Preference {
    _id?: string;
    user_id: string;
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
            const response = await axios.get(`http://localhost:5000/preferences/${getAndParseJWT()?.payload.id}`);
            setPreferences(response.data);
        } catch (error) {
            showNotification("Preferences Error","Couldn't fetch preferences: "+ error);
        }
    };





    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/preferences/${id}`);
            fetchPreferences();
            showNotification("Preferences","Preferences was deleted");
        } catch (error) {
            showNotification("Preferences Error","Preferences was not deleted");
        }
    };

    useEffect(() => {
        fetchPreferences();
    }, []);

    return (
        <div className="preferences" style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <div style={{ maxWidth: '800px', width: '100%' }}>
                <Typography variant="h3" mb={4}>Preferences</Typography>

  

                <Button variant="outlined" sx={{ marginTop: '10px' }} onClick={() => navigate('/preferences/add')}>
                    Add preference
                </Button>
              
           <div style={{ marginTop: '24px' }}>
           {preferences.map((preference) => (
               <Card key={preference._id} style={{ marginBottom: '16px' }}>
                   <CardContent>
                    <Typography>ID: {preference._id}</Typography>
                       <Typography>User ID: {preference.user_id}</Typography>
                       <Typography>Theme: {preference.theme}</Typography>
                       <Typography>Font: {preference.font}</Typography>
                       <Typography>Layout: {preference.layout}</Typography>
                       <Typography>Active: {preference.active ? 'Yes' : 'No'}</Typography>
                   </CardContent>

                   <Box display="flex" p={2}>
                         <Button onClick={() => navigate(`/preferences/edit/${preference._id}`)} variant="outlined">Edit</Button>
                       <Button onClick={() => handleDelete(preference._id)} variant="outlined" color="error">Delete</Button>
                   </Box>
               </Card>
           ))}
       </div>
             

            </div>
        </div>
    );
};

export default PreferencesList;
