export async function generateTasks(userPrompt) {
  const prompt = `
  Cria exatamente 10 tarefas detalhadas para estudar sobre o seguinte tema: "${userPrompt}".
  As tarefas devem ser numeradas de 1 a 10, focadas e específicas.
  Não deves incluir texto extra, apenas as 10 tarefas numeradas.

  Exemplo:
  1. Resolver 10 exercícios a tal materia
  2. Estudar 30 minutos sobre funções exponenciais
  APENAS ESCREVE AS TAREFAS E NADA ALEM DISSO
  ...
  `;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
          "Authorization": `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Pomodoro App",
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          model: "google/gemini-2.0-pro-exp-02-05:free",
          messages: [{ role: "user", content: prompt }]
      })
  });

  if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
  }

  const data = await response.json();
  console.log("Resposta da API:", data);

  const tarefasTexto = data.choices[0]?.message?.content || "Nenhuma tarefa gerada.";

  // Converte a resposta num array
  const generatedTasks = tarefasTexto
      .split("\n")
      .map((t) => t.replace(/^\d+\.\s*/, "").trim()) // Remove numeração automática
      .filter((t) => t !== "");

  return generatedTasks;
}