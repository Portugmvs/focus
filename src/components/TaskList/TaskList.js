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
// Importe componentes do react-beautiful-dnd (se escolher usar esta biblioteca)
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

    // Função para lidar com o fim do drag (para Drag and Drop - INCOMPLETO)
    // const handleOnDragEnd = (result) => {
    //     if (!result.destination) return; // Se largou fora da lista, não faz nada

    //     const items = Array.from(tasks);
    //     const [reorderedItem] = items.splice(result.source.index, 1); // Remove do índice original
    //     items.splice(result.destination.index, 0, reorderedItem); // Insere no novo índice

    //     setTasks(items); // Atualiza o estado com a nova ordem
    // };


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
                    aria-label="Adicionar tarefa"
                >
                    <Add />
                </IconButton>
            </Box>

            <List sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                {/*  Estrutura DragDropContext e Droppable (para Drag and Drop - INCOMPLETO)
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="tasks-list">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {tasks.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <ListItem
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                sx={{
                                                    bgcolor: task.completed ? 'action.selected' : 'background.paper',
                                                    mb: 1,
                                                    borderRadius: 2,
                                                    boxShadow: 1,
                                                    '&:hover .edit-icon': { // Aplica estilo ao 'edit-icon' no hover do ListItem
                                                        visibility: 'visible'
                                                    }
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

                                                {/* Ícone de edição - Adicione a classe 'edit-icon'
                                                {!task.completed && (
                                                    <IconButton className="edit-icon" onClick={() => startEditing(task)} aria-label="Editar tarefa" sx={{ visibility: 'hidden' }}>
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </ListItem>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                */}
                {/* Renderização da lista SEM Drag and Drop (código original com Hover Actions para o ícone de Editar) */}
                {tasks.map((task) => (
                    <Slide key={task.id} direction="right" in mountOnEnter unmountOnExit>
                        <ListItem
                            sx={{
                                bgcolor: task.completed ? 'action.selected' : 'background.paper',
                                mb: 1,
                                borderRadius: 2,
                                boxShadow: 1,
                                '&:hover .edit-icon': { // Aplica estilo ao 'edit-icon' no hover do ListItem
                                    visibility: 'visible'
                                }
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

                            {/* Ícone de edição - Adicione a classe 'edit-icon' */}
                            {!task.completed && (
                                <IconButton className="edit-icon" onClick={() => startEditing(task)} aria-label="Editar tarefa" sx={{ visibility: 'hidden' }}>
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