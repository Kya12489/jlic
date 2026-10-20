import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["TXT"];

export default function FileForm({ onSubmit }) {
  const [file, setFile] = useState(null);
  const [addEndedTask, setAddEndedTask] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(file, addEndedTask);
      }}
    >
      <label>
        <input
          type="checkbox"
          name="addEndedTask"
          checked={addEndedTask}
          onChange={(e) => setAddEndedTask(e.target.checked)}
        />
        Add a fictive end task
      </label>

      <FileUploader
        classesName="h-1"
        handleChange={setFile}
        uploadedLabel="uploaded"
        name="file"
        types={fileTypes}
      />

      {file != null && <p>{file.name}</p>}

      <button
        className="bg-green-400 hover:bg-green-500"
        type="submit"
      >
        Envoyer
      </button>
    </form>
  );
}