import { useState } from "react";
import GanttGraphe from "./GanttGraphe";
import BellmanMpm from "./BellmanMpm";

export default function GrapheScreen({grapheType,fileInfo}) {
    console.log(grapheType)
    function renderGraphe(){
        switch (grapheType) {
            case "gantt":
                
                return <GanttGraphe fileInfo={fileInfo}></GanttGraphe>
            
            case "mpm":
                return <BellmanMpm fileInfo={fileInfo}/>
            case "graph" :
                return <></>
            default:
                return <></>;
        }
    }
    return(
        <div className="flex flex-col w-screen">
           
            {renderGraphe()}
        </div>
    );
}