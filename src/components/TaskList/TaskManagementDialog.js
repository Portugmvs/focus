// File: /src/components/TaskList/TaskManagementDialog.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Typography
} from '@mui/material';
import { Delete, Close } from '@mui/icons-material';

const TaskManagementDialog = ({ tasks, setTasks }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeleteAll = () => {
    setTasks([]);
    handleClose();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button variant="outlined" onClick={handleOpen}>
        Gerir Tarefas
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Gestão de Tarefas</DialogTitle>
        <DialogContent>
          {tasks.length === 0 ? (
            <Typography variant="body1">Sem tarefas para gerir.</Typography>
          ) : (
            <List>
              {tasks.map((task) => (
                <ListItem key={task.id} divider>
                  <Checkbox checked={task.completed} disabled />
                  <ListItemText primary={task.text} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAll} color="error" startIcon={<Delete />}>
            Eliminar Todas
          </Button>
          <Button onClick={handleClose} startIcon={<Close />}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

TaskManagementDialog.propTypes = {
  tasks: PropTypes.array.isRequired,
  setTasks: PropTypes.func.isRequired,
};

export default TaskManagementDialog;
