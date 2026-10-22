
import { useState } from 'react'
import './App.css'
import GrapheScreen from './elements/GrapheScreen'
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
  const [grapheType,setGrapheType] = useState("gantt")

  const [activeGraphe, setActiveGrapheState] = useState(() => {
    const savedGraphe = localStorage.getItem("activeGraphe");
    return savedGraphe ? JSON.parse(savedGraphe) : null;
  });

  function setGraphe(graphe) {
    setActiveGrapheState(graphe);
    localStorage.setItem("activeGraphe", JSON.stringify(graphe));
  }

  async function handleSubmit(file, addEndedTask) {
    if (!file) {
      alert("Sélectionne un fichier TXT !");
      return;
    }

    try {
      console.log("Envoi du fichier :", file.name);

      const graphe = await GetFileInfo(file, addEndedTask);

      console.log("Réponse du serveur :", graphe);
      setGraphe(graphe);
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de l'envoi : " + error.message);
    }
  }

  function closeFile() {
    setGraphe(null)
  }

  return (
    <>
      <header className="border-b-2 bg-gray-200 border-b-gray-300 flex justify-start gap-5">
        {/* <button className="btn bg-gray-400 hover:bg-gray-500">
          open file
        </button> */}
        <button className="btn bg-gray-400 hover:bg-gray-500" onClick={closeFile}>
          close file
        </button>
        <section className="flex gap-2">
                    <p>vue : </p>
                    <button className="btn bg-gray-400 hover:bg-gray-500" onClick={()=>setGrapheType("gantt")}>Gantt</button>
                    <button className="btn bg-gray-400 hover:bg-gray-500" onClick={()=>setGrapheType("graphe")}>Graphe</button>
                    <button className="btn bg-gray-400 hover:bg-gray-500" onClick={()=>setGrapheType("mpm")}>MPM</button>
                </section>
      </header>

      <div className="flex justify-center items-center h-screen ">
        {activeGraphe === null ? (
          <FileForm onSubmit={handleSubmit} />
        ) : (
          <GrapheScreen grapheType={grapheType} fileInfo={activeGraphe} />
        )}
      </div>
    </>
  );
}

export default App;