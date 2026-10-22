import { useState } from "react";
import GanttGraphe from "./GanttGraphe";

export default function GrapheScreen({grapheType,fileInfo}) {
    console.log(grapheType)
    function renderGraphe(){
        switch (grapheType) {
            case "gantt":
                
                return <GanttGraphe fileInfo={fileInfo}></GanttGraphe>
            
            case "graphe":
                return <></>
            case "mpm" :
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