const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY; // Corrige o erro

const prompt = "Gera uma lista de tarefas produtivas para estudar matemática durante 2 horas. As tarefas devem ser detalhadas e incluir tempos estimados.";

export async function generateTasks(prompt) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Pomodoro App",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
        messages: [{ role: "user", content: prompt }]
      })
    });
  
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
  
    const data = await response.json();
    console.log("Resposta da API:", data);
  
    // Extrai as tarefas do content
    const tarefasTexto = data.choices[0]?.message?.content || "Nenhuma tarefa gerada.";
    console.log("Tarefas geradas:", tarefasTexto);
  
    return tarefasTexto;
  }
  