// File: /src/components/TaskList/TaskList.js
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
  IconButton,
  Slide
} from '@mui/material';
import { Add, CheckCircle, Edit, Task } from '@mui/icons-material';
import TaskManagementDialog from './TaskManagementDialog.js';

const TaskList = ({ tasks, setTasks, onTaskComplete }) => {
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: uuidv4(),
          text: newTask.trim(),
          completed: false,
          createdAt: new Date().toISOString()
        }
      ]);
      setNewTask('');
    }
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        if (!task.completed) {
          onTaskComplete();
          return { ...task, completed: true };
        }
        return task;
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    setTasks(
      tasks.map((task) =>
        task.id === editingId ? { ...task, text: editText } : task
      )
    );
    setEditingId(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Task />
        Tarefas ({tasks.filter((t) => !t.completed).length} pendentes)
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Nova tarefa"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <IconButton
          onClick={handleAddTask}
          disabled={!newTask.trim()}
        >
          <Add />
        </IconButton>
      </Box>

      <List sx={{ maxHeight: '60vh', overflow: 'auto' }}>
        {tasks.map((task) => (
          <Slide key={task.id} direction="right" in mountOnEnter unmountOnExit>
            <ListItem
              sx={{
                bgcolor: task.completed ? 'action.selected' : 'background.paper',
                mb: 1,
                borderRadius: 2,
                boxShadow: 1
              }}
            >
              <Checkbox
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                icon={<CheckCircle color="disabled" />}
                checkedIcon={<CheckCircle color="success" />}
                disabled={task.completed}
              />

              {editingId === task.id ? (
                <TextField
                  fullWidth
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={saveEdit}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                  autoFocus
                />
              ) : (
                <ListItemText
                  primary={task.text}
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.7 : 1
                  }}
                />
              )}

              {!task.completed && (
                <IconButton onClick={() => startEditing(task)}>
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </ListItem>
          </Slide>
        ))}
      </List>

      <TaskManagementDialog tasks={tasks} setTasks={setTasks} />
    </Box>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  setTasks: PropTypes.func.isRequired,
  onTaskComplete: PropTypes.func.isRequired
};

export default TaskList;