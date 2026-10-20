
import { useState } from 'react'
import './App.css'
import GrapheScreen from './elements/grapheScreen'
import FileForm from './elements/openfileForm'

async function GetFileInfo(file, addEndedTask) {
  if (!file) {
    throw new Error("Aucun fichier sélectionné");
  }

  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("addEndedTask", String(addEndedTask));

  const response = await fetch("https://jlic.onrender.com/fileinfo", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail
        ? JSON.stringify(data.detail)
        : `Erreur HTTP ${response.status}`
    );
  }

  return data.content;
}

function App() {
  const [activeGraphe, setGraphe] = useState(null);

  async function handleSubmit(file, addEndedTask) {
    if (!file) {
      console.error("Aucun fichier sélectionné");
      return;
    }

    try {
      const graphe = await GetFileInfo(file, addEndedTask);
      console.log(graphe);
      setGraphe(graphe);
    } catch (error) {
      console.error("Erreur :", error.message);
    }
  }

  return (
    <>
      <header className="border-b-2 bg-gray-200 border-b-gray-300 flex justify-start gap-0.5">
        <button className="btn bg-gray-400 hover:bg-gray-500">
          open file
        </button>
        <button className="btn bg-gray-400 hover:bg-gray-500">
          save file
        </button>
      </header>

      <div className="flex justify-center items-center h-screen">
        {activeGraphe === null ? (
          <FileForm onSubmit={handleSubmit} />
        ) : (
          <GrapheScreen fileInfo={activeGraphe} />
        )}
      </div>
    </>
  );
}

export default App;
