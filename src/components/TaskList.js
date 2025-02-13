import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Checkbox, 
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useEffect } from 'react';


const TaskList = ({ tasks, setTasks, xp, setXP }) => {
  const [newTask, setNewTask] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDeleteAllDialog, setOpenDeleteAllDialog] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState([]);

  const addTask = () => {
    const trimmedTask = newTask.trim();
    if (trimmedTask) {
      const newTasks = [...tasks, { 
        id: Date.now(), 
        text: trimmedTask, 
        completed: false 
      }];
      setTasks(newTasks);
      localStorage.setItem('tasks', JSON.stringify(newTasks)); // Persistir tarefas
      setNewTask('');
    }
  };

useEffect(() => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    setTasks(JSON.parse(savedTasks));
  }

  const savedXP = localStorage.getItem('xp');
  if (savedXP) {
    setXP(parseInt(savedXP, 10));
  }
}, [setTasks, setXP]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    if (!tasks.find(t => t.id === taskId).completed) {
      setXP(xp + 100);
    }
    
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleDeleteSelection = (taskId) => {
    setSelectedToDelete(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId) 
        : [...prev, taskId]
    );
  };

  const confirmDelete = () => {
    const updatedTasks = tasks.filter(task => !selectedToDelete.includes(task.id));
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Atualizar storage
    setSelectedToDelete([]);
    setOpenDeleteDialog(false);
  };

  const deleteAllTasks = () => {
    setTasks([]);
    localStorage.removeItem('tasks');
    setOpenDeleteAllDialog(false);
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    localStorage.setItem('xp', xp);
  }, [xp]);
  

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Checklist de Tarefas
        <Chip 
          label={`${tasks.length} tarefas`} 
          size="small" 
          sx={{ ml: 1, verticalAlign: 'middle' }}
        />
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="Nova Tarefa"
          variant="outlined"
          fullWidth
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escreva e pressione Enter..."
        />
        <Button variant="contained" onClick={addTask}>
          <AddIcon />
        </Button>
      </Box>

      <List sx={{ maxHeight: 400, overflow: 'auto' }}>
        {tasks.map(task => (
          <ListItem 
            key={task.id}
            sx={{ 
              bgcolor: task.completed ? 'action.selected' : 'inherit',
              opacity: task.completed ? 0.7 : 1
            }}
          >
            <Checkbox
              checked={task.completed}
              onChange={() => !task.completed && toggleTask(task.id)}
              icon={<CheckCircleIcon color="disabled" />}
              checkedIcon={<CheckCircleIcon color="success" />}
              disabled={task.completed}
            />
            <ListItemText 
              primary={task.text} 
              sx={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                mr: 2
              }} 
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>

        <Button
          variant="outlined"
          startIcon={<DeleteOutlineIcon />}
          onClick={() => setOpenDeleteDialog(true)}
        >
          Gerir Tarefas
        </Button>
      </Box>

      {/* Diálogo de Gestão */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DeleteOutlineIcon fontSize="medium" />
            Gestão Avançada de Tarefas
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Tarefas existentes ({tasks.length})
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2
            }}>
              <Button
                size="small"
                onClick={() => setSelectedToDelete(
                  selectedToDelete.length === tasks.length 
                    ? [] 
                    : tasks.map(t => t.id)
                )}
              >
                {selectedToDelete.length === tasks.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
              </Button>
              
              <Chip 
                label={`${selectedToDelete.length} selecionadas`}
                color="primary"
                variant="outlined"
              />
            </Box>

            <List dense sx={{ 
              border: '1px solid rgba(0, 0, 0, 0.12)', 
              borderRadius: 1,
              maxHeight: 300,
              overflow: 'auto'
            }}>
              {tasks.map(task => (
                <ListItem 
                  key={task.id}
                  sx={{
                    bgcolor: selectedToDelete.includes(task.id) ? 'action.hover' : 'inherit',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                    '&:last-child': { borderBottom: 0 }
                  }}
                >
                  <Checkbox
                    checked={selectedToDelete.includes(task.id)}
                    onChange={() => handleDeleteSelection(task.id)}
                    color="primary"
                  />
                  
                  <ListItemText
                    primary={task.text}
                    secondary={task.completed ? 'Concluída' : 'Pendente'}
                    sx={{ 
                      textDecoration: task.completed ? 'line-through' : 'none',
                      '& .MuiListItemText-secondary': {
                        color: task.completed ? 'success.main' : 'text.secondary',
                        fontStyle: 'italic'
                      }
                    }}
                  />
                  
                  {task.completed && (
                    <CheckCircleIcon 
                      fontSize="small" 
                      color="success" 
                      sx={{ ml: 1 }} 
                    />
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          p: 2,
          gap: 2
        }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
          >
            Cancelar
          </Button>
          
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                if (tasks.length > 0) setOpenDeleteAllDialog(true);
              }}
              disabled={tasks.length === 0}
            >
              Remover Todas
            </Button>
            
            <Button 
              variant="contained"
              onClick={confirmDelete} 
              disabled={selectedToDelete.length === 0}
              sx={{ minWidth: 180 }}
            >
              Remover Selecionadas
              <Chip 
                label={selectedToDelete.length} 
                size="small"
                sx={{ ml: 1, color: 'white', bgcolor: 'rgba(0,0,0,0.2)' }}
              />
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmação para Remover Todas */}
      <Dialog
        open={openDeleteAllDialog}
        onClose={() => setOpenDeleteAllDialog(false)}
      >
        <DialogTitle>Confirmar Remoção Total</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja remover TODAS as tarefas?
            <br />
            <strong>Esta ação não pode ser desfeita!</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteAllDialog(false)}>Cancelar</Button>
          <Button onClick={deleteAllTasks} color="error" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList;