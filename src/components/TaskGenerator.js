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
import { generateTasks } from "../utils/openrouterApi";

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
    setOpen(false);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const tasks = await generateTasks(prompt);
      setGeneratedTasks(tasks);
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

  const handleConfirm = () => {
    onAddTasks(selectedTasks);
    handleClose();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button variant="contained" onClick={handleOpen}>
        Gerar Tarefas com AI
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Gerar Tarefas com AI</DialogTitle>
        <DialogContent>
          <TextField
            label="Tema das Tarefas"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            multiline
          />
          <Button onClick={handleGenerate} variant="contained" sx={{ mt: 2 }} disabled={!prompt.trim()}>
            Gerar
          </Button>

          {loading && <CircularProgress sx={{ mt: 2 }} />}
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

          {generatedTasks.length > 0 && (
            <List sx={{ mt: 2 }}>
              {generatedTasks.map((task, index) => (
                <ListItem key={index} button onClick={() => toggleTaskSelection(task)}>
                  <Checkbox checked={selectedTasks.includes(task)} />
                  <ListItemText primary={task} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>

        <DialogActions>
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
