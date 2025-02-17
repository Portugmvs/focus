// File: /src/components/TaskGenerator.js
import React, { useState } from "react";
import { TextField, Button, List, ListItem, Checkbox, ListItemText, Box, CircularProgress, Typography } from "@mui/material";
import { generateTasks } from "../utils/openrouterApi";

const TaskGenerator = ({ onAddTasks }) => {
  const [prompt, setPrompt] = useState("");
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    const tasks = await generateTasks(prompt);
    if (tasks.length === 0) {
      setError("Não foram geradas tarefas. Tenta novamente.");
    }
    setGeneratedTasks(tasks);
    setLoading(false);
  };

  const toggleTaskSelection = (task) => {
    if (selectedTasks.includes(task)) {
      setSelectedTasks(selectedTasks.filter(t => t !== task));
    } else {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  const handleConfirm = () => {
    onAddTasks(selectedTasks);
    // Reseta os estados
    setGeneratedTasks([]);
    setSelectedTasks([]);
    setPrompt("");
  };

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        label="Prompt para gerar tarefas"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        fullWidth
        multiline
      />
      <Button onClick={handleGenerate} variant="contained" sx={{ mt: 1 }}>
        Gerar Tarefas
      </Button>
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      {generatedTasks.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Tarefas geradas:</Typography>
          <List>
            {generatedTasks.map((task, index) => (
              <ListItem key={index} button onClick={() => toggleTaskSelection(task)}>
                <Checkbox checked={selectedTasks.includes(task)} />
                <ListItemText primary={task} />
              </ListItem>
            ))}
          </List>
          <Button onClick={handleConfirm} variant="contained" sx={{ mt: 1 }}>
            Adicionar Tarefas Selecionadas
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TaskGenerator;
