import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Trophy, Edit2, Trash2 } from 'lucide-react';
import { showNotification } from '../App.tsx';

export interface Reward {
  _id: string;
  level_required: number;
  name: string;
  description?: string;
  condition_required?: string;
}

type AchievementType = 'level' | 'tasks';

const RewardList: React.FC = () => {
  const [rewards, setRewards]               = useState<Reward[]>([]);
  const [open, setOpen]                     = useState(false);
  const [editingId, setEditingId]           = useState<string | null>(null);
  const [type, setType]                     = useState<AchievementType>('level');
  const [threshold, setThreshold]           = useState<number>(1);
  const [form, setForm]                     = useState<{ name: string; description: string }>({
    name: '',
    description: '',
  });

  const fetchRewards = async () => {
    try {
      const res = await axios.get<Reward[]>('http://localhost:5000/rewards', { withCredentials: true });
      setRewards(res.data);
    } catch {
      showNotification('Rewards Error', "Couldn't fetch definitions");
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleOpen = (r?: Reward) => {
    if (r) {
      const cond = r.condition_required || '';
      if (cond.startsWith('level_')) {
        setType('level');
        setThreshold(parseInt(cond.replace('level_', ''), 10));
      } else if (cond.startsWith('tasks_completed_')) {
        setType('tasks');
        setThreshold(parseInt(cond.replace('tasks_completed_', ''), 10));
      }
      setEditingId(r._id);
      setForm({ name: r.name, description: r.description || '' });
    } else {
      setEditingId(null);
      setType('level');
      setThreshold(1);
      setForm({ name: '', description: '' });
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const buildPayload = () => {
    const condition =
      type === 'level'
        ? `level_${threshold}`
        : `tasks_completed_${threshold}`;
    const level_required = type === 'level' ? threshold : 0;
    return {
      name: form.name,
      description: form.description,
      level_required,
      condition_required: condition,
    };
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      showNotification('Rewards Error', 'Name is required');
      return;
    }
    try {
      const payload = buildPayload();
      if (editingId) {
        await axios.put(
          `http://localhost:5000/rewards/${editingId}`,
          payload,
          { withCredentials: true }
        );
        showNotification('Rewards', 'Updated successfully');
      } else {
        await axios.post(
          'http://localhost:5000/rewards',
          payload,
          { withCredentials: true }
        );
        showNotification('Rewards', 'Created successfully');
      }
      handleClose();
      fetchRewards();
    } catch {
      showNotification('Rewards Error', 'Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `http://localhost:5000/rewards/${id}`,
        { withCredentials: true }
      );
      showNotification('Rewards', 'Deleted');
      fetchRewards();
    } catch {
      showNotification('Rewards Error', 'Delete failed');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 960, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        All Achievement Definitions
      </Typography>

      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Achievement
        </Button>
      </Box>

      <Grid container spacing={3}>
        {rewards.map(r => (
          <Grid item xs={12} sm={6} md={4} key={r._id}>
            <Card
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg,#fafafa 0%,#f0f0f0 100%)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Trophy size={28} color="#f5a623" />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {r.name}
                  </Typography>
                </Box>

                {r.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {r.description}
                  </Typography>
                )}

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip label={`Level ${r.level_required}`} size="small" />
                  <Chip
                    label={r.condition_required || 'No condition'}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton
                    onClick={() => handleOpen(r)}
                    size="small"
                    color="primary"
                  >
                    <Edit2 size={16} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(r._id)}
                    size="small"
                    color="error"
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingId ? 'Edit Achievement' : 'Add Achievement'}
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              label="Type"
              onChange={e => setType(e.target.value as AchievementType)}
            >
              <MenuItem value="level">Level Achievement</MenuItem>
              <MenuItem value="tasks">Task Count Achievement</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label={type === 'level' ? 'Level Number' : 'Tasks Count'}
            type="number"
            value={threshold}
            onChange={e => setThreshold(+e.target.value)}
            fullWidth
          />

          <TextField
            label="Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            fullWidth
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RewardList;