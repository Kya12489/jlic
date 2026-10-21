
export default function GrapheScreen({ fileInfo }) {
  const entries = Object.entries(fileInfo).filter(
    ([key, value]) => Array.isArray(value)
  );
  
  //affiche le graphe correspondant au fichier
  return (
    <>
    
    </>
  );
}
