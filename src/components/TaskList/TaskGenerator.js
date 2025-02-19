// File: /src/components/TaskList/TaskGenerator.js
import React, { useState } from "react";
import {
    TextField,
    Button,
    List,
    ListItem,
    Checkbox,
    ListItemText,
    Box,
    CircularProgress,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import { generateTasks } from "../../utils/openrouterApi";
import { styled } from '@mui/material/styles';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(3),
}));

const TaskGenerator = ({ onAddTasks }) => {
    const [prompt, setPrompt] = useState("");
    const [generatedTasks, setGeneratedTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setGeneratedTasks([]);
        setSelectedTasks([]);
        setPrompt("");
        setError(null);
        setOpen(false);
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const tasks = await generateTasks(prompt);
            setGeneratedTasks(tasks);
            setSelectedTasks([]); // Limpa as selecções anteriores
        } catch (err) {
            setError("Erro ao gerar tarefas. Tenta novamente.");
        }
        setLoading(false);
    };

    const toggleTaskSelection = (task) => {
        if (selectedTasks.includes(task)) {
            setSelectedTasks(selectedTasks.filter((t) => t !== task));
        } else {
            setSelectedTasks([...selectedTasks, task]);
        }
    };

    const handleSelectAll = () => {
        if (selectedTasks.length === generatedTasks.length) {
            // Se todas estiverem selecionadas, desseleciona todas
            setSelectedTasks([]);
        } else {
            // Senão, seleciona todas
            setSelectedTasks([...generatedTasks]);
        }
    };

    const handleConfirm = () => {
        onAddTasks(selectedTasks);
        handleClose();
    };

    return (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="contained" onClick={handleOpen}>
                Gerar Tarefas com AI
            </Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Gerar Tarefas com AI
                </DialogTitle>
                <StyledDialogContent>
                    <TextField
                        label="Tema das Tarefas"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />
                    <Button onClick={handleGenerate} variant="contained" disabled={!prompt.trim()}>
                        Gerar
                    </Button>

                    {loading && <CircularProgress sx={{ mt: 2 }} />}
                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

                    {generatedTasks.length > 0 && (
                        <>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, textAlign: 'center' }}>
                                {generatedTasks.length} tarefas geradas.
                            </Typography>
                            <Button
                                onClick={handleSelectAll}
                                variant="outlined"
                                sx={{ mt: 2, mb: 1 }}
                            >
                                {selectedTasks.length === generatedTasks.length ? 'Desselecionar Todas' : 'Selecionar Todas'}
                            </Button>
                            <List sx={{ mt: 1 }}>
                                {generatedTasks.map((task, index) => (
                                    <ListItem
                                        key={index}
                                        button
                                        onClick={() => toggleTaskSelection(task)}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 1,
                                            bgcolor: selectedTasks.includes(task) ? 'action.selected' : 'background.paper',
                                            transition: 'background-color 0.3s',
                                        }}
                                    >
                                        <Checkbox checked={selectedTasks.includes(task)} />
                                        <ListItemText primary={task} />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </StyledDialogContent>

                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleConfirm} variant="contained" disabled={selectedTasks.length === 0}>
                        Adicionar Tarefas Selecionadas
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TaskGenerator;