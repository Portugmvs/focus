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
import { useTheme } from '@mui/material/styles'; // Import useTheme
import { Add, CheckCircle, Edit, Task } from '@mui/icons-material';
import TaskManagementDialog from './TaskManagementDialog.js';

const TaskList = ({ tasks, setTasks, onTaskComplete }) => {
    const [newTask, setNewTask] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false); // Estado para o diálogo de gestão
    const theme = useTheme(); // Use useTheme hook

    // --- Handlers para Tarefas ---
    const handleAddTask = () => {
        if (newTask.trim()) {
            setTasks([
                ...tasks,
                {
                    id: uuidv4(),
                    text: newTask.trim(),
                    completed: false,
                    createdAt: new Date().toISOString(),
                    priority: 'low' // Prioridade padrão: baixa
                }
            ]);
            setNewTask('');
        }
    };

    // Só marca como concluída se ainda não estiver concluída
    // Não permite reverter de concluída para não concluída
    const toggleTask = (taskId) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                // Se a tarefa não estiver concluída, marca como concluída e dá XP
                if (!task.completed) {
                    onTaskComplete();
                    return { ...task, completed: true };
                }
                // Se já estiver concluída, não faz nada
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

    // --- Handlers para Dialogo de Gestão ---
    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => setDialogOpen(false);

    const handleDeleteAllTasks = () => {
        setTasks([]);
        handleCloseDialog();
    };

    return (
        <Box >
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
                    aria-label="Adicionar tarefa"
                >
                    <Add />
                </IconButton>
            </Box>

            <List sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                {tasks.map((task) => (
                    <Slide key={task.id} direction="right" in mountOnEnter unmountOnExit>
                        <ListItem
                            sx={{
                                bgcolor: task.completed ? theme.palette.action.selected : theme.palette.background.paper, // Use theme here
                                mb: 1,
                                borderRadius: 2,
                                boxShadow: 1
                            }}
                            //onClick={() => toggleTask(task.id)} // Clique na ListItem para marcar como completo (opcional)
                        >
                            <Checkbox
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                icon={<CheckCircle color="disabled" />}
                                checkedIcon={<CheckCircle color="success" />}
                                // Desactiva o checkbox se a tarefa já estiver concluída
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

                            {/* Só exibe o ícone de edição se a tarefa não estiver concluída */}
                            {!task.completed && (
                                <IconButton onClick={() => startEditing(task)} aria-label="Editar tarefa">
                                    <Edit fontSize="small" />
                                </IconButton>
                            )}
                        </ListItem>
                    </Slide>
                ))}
                {tasks.length === 0 && (
                    <Typography variant="subtitle1" sx={{ fontStyle: 'italic', color: 'text.secondary', mt: 2, textAlign: 'center' }}>
                        Nenhuma tarefa por agora. Adicione tarefas para começar!
                    </Typography>
                )}
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