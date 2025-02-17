import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  IconButton
} from '@mui/material';
import { Add, Delete, CheckCircle, Edit, Task } from '@mui/icons-material'; // Import corrigido
import TaskManagementDialog from './TaskManagementDialog'; // Caminho corrigido

const TaskList = ({ tasks, setTasks, onTaskComplete }) => {
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: uuidv4(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      }]);
      setNewTask('');
    }
  };

  const handleDeleteAll = () => {
    setTasks([]);
    setSelectedTasks([]);
    onClose();
  };

    return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Task /> {/* Agora está importado corretamente */}
        Tarefas ({tasks.filter(t => !t.completed).length} pendentes)
      </Typography>

      {/* ... (restante do JSX) */}
    </Box>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  setTasks: PropTypes.func.isRequired,
  onTaskComplete: PropTypes.func.isRequired
};

export default TaskList;