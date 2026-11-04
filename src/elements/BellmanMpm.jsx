import { ReactFlow, Background, Controls, Position, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "@dagrejs/dagre";

export default function BellmanFordGraphe({ fileInfo }) {
  const { nums, descriptions, durees, siTot, siTard, predecesseurs } = fileInfo;
  const contraintes = fileInfo.contraintes || []; 

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

  
  const edges = [];
  const ajouterArc = (p, id, poids) => {
    const critique = estCritique(p) && estCritique(id) && siTot[p] + poids === siTot[id];
    edges.push({
      id: `${edges.length}-${p}-${id}`,
      source: String(p),
      target: String(id),
      type: "straight",
      label: String(poids),
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: critique ? "Red" : "Black",
        width: 20,
        height: 20,
        markerUnits: "userSpaceOnUse",
      },
      style: { stroke: critique ? "Red" : "Black", strokeWidth: critique ? 3 : 1 },
    });
  };

  nums.forEach((id, i) => {
    predecesseurs[i].forEach((p) => ajouterArc(p, id, durees[nums.indexOf(p)]));
  });
  
  contraintes.forEach(([i, j, d]) => ajouterArc(j, i, d));

  //placement auto
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", ranksep: 80 });
  g.setDefaultEdgeLabel(() => ({}));
  nodes.forEach((n) => g.setNode(n.id, { width: 150, height: 60 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  nodes.forEach((n) => {
    n.position = { x: g.node(n.id).x - 75, y: g.node(n.id).y - 30 };
  });

  return (
    <div className="h-[80vh] w-full">
      <ReactFlow nodes={nodes} edges={edges} fitView nodesConnectable={false} nodesDraggable>
      </ReactFlow>
    </div>
  );
}
