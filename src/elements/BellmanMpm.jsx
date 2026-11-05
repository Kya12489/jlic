import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Position,
  MarkerType,
  BaseEdge,
  EdgeLabelRenderer,
  useInternalNode,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "@dagrejs/dagre";

const ECART_PAIRE = 12; // demi-écart entre les deux arcs d'une paire opposée

const centre = (n) => ({
  x: n.internals.positionAbsolute.x + n.measured.width / 2,
  y: n.internals.positionAbsolute.y + n.measured.height / 2,
});

// point situé à la fraction `frac` de la longueur de la polyligne
function pointMilieu(pts, frac = 0.5) {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  let reste = lens.reduce((a, b) => a + b, 0) * frac;
  for (let i = 0; i < lens.length; i++) {
    if (reste <= lens[i]) {
      const t = lens[i] ? reste / lens[i] : 0;
      return {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * t,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * t,
      };
    }
    reste -= lens[i];
  }
  return pts[pts.length - 1];
}

// point où la demi-droite (start -> toward) sort du rectangle du noeud n
function bordDepuis(n, start, toward) {
  const c = centre(n);
  const w = n.measured.width / 2;
  const h = n.measured.height / 2;
  const dx = toward.x - start.x;
  const dy = toward.y - start.y;
  const rx = start.x - c.x;
  const ry = start.y - c.y;
  const tx = dx > 0 ? (w - rx) / dx : dx < 0 ? (-w - rx) / dx : Infinity;
  const ty = dy > 0 ? (h - ry) / dy : dy < 0 ? (-h - ry) / dy : Infinity;
  const t = Math.min(tx, ty);
  return { x: start.x + dx * t, y: start.y + dy * t };
}

function OffsetEdge({ id, source, target, markerEnd, style, label, data }) {
  const src = useInternalNode(source);
  const tgt = useInternalNode(target);
  if (!src?.measured?.width || !tgt?.measured?.width) return null;

  const cs = centre(src);
  const ct = centre(tgt);
  const paire = !!data?.paire;

  // pour une paire opposée, on décale perpendiculairement (côte à côte)
  let a = cs;
  let b = ct;
  if (paire) {
    const dx = ct.x - cs.x;
    const dy = ct.y - cs.y;
    const len = Math.hypot(dx, dy) || 1;
    const ox = (-dy / len) * ECART_PAIRE;
    const oy = (dx / len) * ECART_PAIRE;
    a = { x: cs.x + ox, y: cs.y + oy };
    b = { x: ct.x + ox, y: ct.y + oy };
  }

  // extrémités sur le bord des noeuds
  const s = bordDepuis(src, a, b);
  const t = bordDepuis(tgt, b, a);

  // pour une paire, les labels sont décalés le long de la ligne
  const lp = pointMilieu([s, t], paire ? 0.35 : 0.5);

  return (
    <>
      <BaseEdge
        id={id}
        path={`M ${s.x},${s.y} L ${t.x},${t.y}`}
        markerEnd={markerEnd}
        style={style}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan"
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${lp.x}px, ${lp.y}px)`,
            background: "white",
            padding: "1px 4px",
            borderRadius: 4,
            fontSize: 12,
            border: "1px solid #ddd",
            pointerEvents: "all",
          }}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

// IMPORTANT : défini en dehors du composant
const edgeTypes = { offset: OffsetEdge };

export default function BellmanFordGraphe({ fileInfo }) {
  // noeuds et arcs de départ, avec placement dagre (calculés une seule fois)
  const initial = useMemo(() => {
    const { nums, descriptions, durees, siTot, siTard, predecesseurs } = fileInfo;
    const contraintes = fileInfo.contraintes || []; // optionnel (absent en MPM simple)

    const estCritique = (id) => siTard[id] === siTot[id];

    const nodes = nums.map((id, i) => ({
      id: String(id),
      position: { x: 0, y: 0 },
      data: {
        label: `${id} - ${descriptions[i]} \ntôt: ${siTot[id]} | tard: ${siTard[id]}`,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        width: 150,
        whiteSpace: "pre-line",
        fontSize: 12,
        border: `2px solid ${estCritique(id) ? "Red" : "Blue"}`,
      },
    }));

    // arcs (p -> id, poids) : prédécesseurs, puis contraintes éventuelles
    const arcs = [];
    nums.forEach((id, i) => {
      predecesseurs[i].forEach((p) => arcs.push([p, id, durees[nums.indexOf(p)]]));
    });
    contraintes.forEach(([i, j, d]) => arcs.push([j, i, d]));

    // arcs qui ont un arc inverse (tracés côte à côte)
    const cles = new Set(arcs.map(([p, id]) => `${p}->${id}`));

    const edges = arcs.map(([p, id, poids], idx) => {
      const critique = estCritique(p) && estCritique(id) && siTot[p] + poids === siTot[id];

      return {
        id: `${idx}-${p}-${id}`,
        source: String(p),
        target: String(id),
        type: "offset",
        label: String(poids),
        data: { paire: cles.has(`${id}->${p}`) },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: critique ? "Red" : "Black",
          width: 25,
          height: 25,
          markerUnits: "userSpaceOnUse",
        },
        style: { stroke: critique ? "Red" : "Black", strokeWidth: critique ? 1.5 : 1 },
      };
    });

    // placement automatique de départ
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: "LR", ranksep: 120, nodesep: 50, edgesep: 30 });
    g.setDefaultEdgeLabel(() => ({}));
    nodes.forEach((n) => g.setNode(n.id, { width: 150, height: 60 }));
    edges.forEach((e) => g.setEdge(e.source, e.target));
    dagre.layout(g);
    nodes.forEach((n) => {
      n.position = { x: g.node(n.id).x - 75, y: g.node(n.id).y - 30 };
    });

    return { nodes, edges };
  }, [fileInfo]);

  // l'état des noeuds conserve les positions déplacées à la main
  const [nodes, , onNodesChange] = useNodesState(initial.nodes);
  const [edges] = useEdgesState(initial.edges);

  return (
    <div className="h-[80vh] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        edgeTypes={edgeTypes}
        fitView
        nodesConnectable={false}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}