
export default function GanttGraphe({ fileInfo }) {
  fileInfo = { ...fileInfo };
  const lastIndex = fileInfo["nums"].length-1
  const lastId = fileInfo["nums"][lastIndex]

  const firstId = fileInfo["nums"][0]
  if (fileInfo["durees"][lastIndex] === 0) {
    fileInfo["nums"] = fileInfo["nums"].slice(0,-1)
    fileInfo["descriptions"] = fileInfo["descriptions"].slice(0,-1)
    fileInfo["durees"] = fileInfo["durees"].slice(0,-1)
    fileInfo["predecesseurs"] = fileInfo["predecesseurs"].slice(0,-1)
  }
  
  if (fileInfo["durees"][0] === 0) {
    fileInfo["nums"] = fileInfo["nums"].slice(1)
    fileInfo["descriptions"] = fileInfo["descriptions"].slice(1)
    fileInfo["durees"] = fileInfo["durees"].slice(1)
    fileInfo["predecesseurs"] = fileInfo["predecesseurs"].slice(1)
  }

  const { nums, descriptions, durees, siTot, siTard, predecesseurs } = fileInfo;
  
  const dureeTotale = Math.max(...nums.map((id, i) => siTot[id] + durees[i]));

  return (
    <div className="gantt">
      <h2>Planning du projet</h2>
      <p>Durée totale : {dureeTotale}</p>

      <div className="gantt-ligne gantt-entete">
        <span>Jours</span>
        <div className="gantt-echelle" style={{ "--nb-jours": dureeTotale }}>
          {Array.from({ length: dureeTotale }, (_, i) => <span key={i}>{i + 1}</span>)}
        </div>
      </div>

      {nums.map((id, i) => {
        const debut = siTot[id], duree = durees[i];
        const marge = siTard[id] - debut;

        return (
          <div className="gantt-ligne" key={id}>
            <span>
              {id}. {descriptions[i]} ({duree})
              <small>
                Prédécesseurs : {predecesseurs[i].length ? 
            predecesseurs[i].join(", ") : "Aucun"}
            </small>
          </span>
            <div className="gantt-zone">
              <div
                className={`gantt-barre ${marge === 0 ? "critique" : ""}`}
                style={{ left: `${debut / dureeTotale * 100}%`, width: `${duree / dureeTotale * 100}%` }}
                title={`Début : ${debut} | Fin : ${debut + duree} | Marge : ${marge}`}
              />
            </div>
          </div>
        );
      })}

      <p>
        <span style={{ color: "#b85c5c" }}>■</span> Tâches critiques —{" "}
        <span style={{ color: "#5a5e98" }}>■</span> Tâches non critiques
      </p>
    </div>
  );
}