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
    throw new Error(data.detail
      ? JSON.stringify(data.detail)
      : `Erreur HTTP ${response.status}`);
  }

  return data.content;
}
function App() {
  const [activeGraphe, addGraphe] = useState([])

  async function handleSubmit(file, addEndedTask) {
    if (!file) {
      console.error("Aucun fichier sélectionné");
      return;
    }

    const graphe = await GetFileInfo(file, addEndedTask);
    addGraphe(graphe);
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
        {activeGraphe.length === 0 ? (
          <FileForm onSubmit={handleSubmit} />
        ) : (
          <GrapheScreen />
        )}
      </div>
    </>
  )
}

export default App