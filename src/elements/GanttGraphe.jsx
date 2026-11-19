import { useRef, useState, useLayoutEffect } from "react";

export default function GanttGraphe({ fileInfo }) {
  fileInfo = { ...fileInfo };
  const lastIndex = fileInfo["nums"].length - 1;

  if (fileInfo["durees"][lastIndex] === 0) {
    fileInfo["nums"] = fileInfo["nums"].slice(0, -1);
    fileInfo["descriptions"] = fileInfo["descriptions"].slice(0, -1);
    fileInfo["durees"] = fileInfo["durees"].slice(0, -1);
    fileInfo["predecesseurs"] = fileInfo["predecesseurs"].slice(0, -1);
  }
  if (fileInfo["durees"][0] === 0) {
    fileInfo["nums"] = fileInfo["nums"].slice(1);
    fileInfo["descriptions"] = fileInfo["descriptions"].slice(1);
    fileInfo["durees"] = fileInfo["durees"].slice(1);
    fileInfo["predecesseurs"] = fileInfo["predecesseurs"].slice(1);
  }

  const { nums, descriptions, durees, siTot, siTard, predecesseurs } = fileInfo;
  const dureeTotale = Math.max(...nums.map((id, i) => siTot[id] + durees[i]));

  const conteneurRef = useRef(null);
  const barresRef = useRef({});
  const [fleches, setFleches] = useState([]);

  // clé stable pour recalculer les flèches quand les données changent
  const cle = JSON.stringify([nums, durees, predecesseurs, siTot]);

  useLayoutEffect(() => {
    const calculer = () => {
      const conteneur = conteneurRef.current;
      if (!conteneur) return;
      const c = conteneur.getBoundingClientRect();
      const res = [];

      nums.forEach((id, i) => {
        predecesseurs[i].forEach((p) => {
          const a = barresRef.current[p];
          const b = barresRef.current[id];
          if (!a || !b) return; // prédécesseur masqué (début/fin à durée 0)
          const ra = a.getBoundingClientRect();
          const rb = b.getBoundingClientRect();
          const x1 = ra.right - c.left;
          const y1 = ra.top + ra.height / 2 - c.top;
          const x2 = rb.left - c.left;
          const y2 = rb.top + rb.height / 2 - c.top;

          let d;
          if (x2 >= x1 + 16) {
            // assez de place : coude simple dans l'espace libre
            const xm = x1 + 8;
            d = `M ${x1},${y1} H ${xm} V ${y2} H ${x2}`;
          } else {
            // pas la place : on longe la barre avec de l'espace pour ne pas la toucher
            const versBas = y2 >= y1;
            const yBord = (versBas ? ra.bottom : ra.top) - c.top + (versBas ? 7 : -7);
            const xDescente = x2 - 16;
            d = `M ${x1},${y1} H ${x1 + 10} V ${yBord} H ${xDescente} V ${y2} H ${x2}`;
          }
          res.push({ key: `${p}-${id}`, d });
        });
      });
      setFleches(res);
    };

    calculer();
    const obs = new ResizeObserver(calculer);
    obs.observe(conteneurRef.current);
    return () => obs.disconnect();
  }, [cle]);

  return (
    <div className="gantt" ref={conteneurRef} style={{ position: "relative" }}>
      <h2>Planning du projet</h2>
      <p>Durée totale : {dureeTotale}</p>

      <div className="gantt-ligne gantt-entete">
        <span>Jours</span>
        <div className="gantt-echelle" style={{ "--nb-jours": dureeTotale }}>
          {Array.from({ length: dureeTotale }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
      </div>

      {nums.map((id, i) => {
        const debut = siTot[id],
          duree = durees[i];
        const marge = siTard[id] - debut;

        return (
          <div className="gantt-ligne" key={id}>
            <span>
              {id}. {descriptions[i]} ({duree})
              <small>
                Prédécesseurs :{" "}
                {predecesseurs[i].length ? predecesseurs[i].join(", ") : "Aucun"}
              </small>
            </span>
            <div className="gantt-zone">
              <div
                ref={(el) => {
                  barresRef.current[id] = el;
                }}
                className={`gantt-barre ${marge === 0 ? "critique" : ""}`}
                style={{
                  left: `${(debut / dureeTotale) * 100}%`,
                  width: `${(duree / dureeTotale) * 100}%`,
                }}
                title={`Début : ${debut} | Fin : ${debut + duree} | Marge : ${marge}`}
              />
            </div>
          </div>
        );
      })}

      {/* calque de flèches par-dessus le diagramme */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        <defs>
          <marker
            id="gantt-fleche"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#555" />
          </marker>
        </defs>
        {fleches.map((f) => (
          <path
            key={f.key}
            d={f.d}
            fill="none"
            stroke="#555"
            strokeWidth="1.2"
            markerEnd="url(#gantt-fleche)"
          />
        ))}
      </svg>

      <p>
        <span style={{ color: "#b85c5c" }}>■</span> Tâches critiques —{" "}
        <span style={{ color: "#5a5e98" }}>■</span> Tâches non critiques
      </p>
    </div>
  );
}