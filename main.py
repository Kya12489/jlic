from classes.taskFile import TaskFile
from library import ToolKit
from fastapi import FastAPI, UploadFile, HTTPException

app = FastAPI()

@app.post("/fileinfo")
async def sendFileInfo(file: UploadFile):
    contenu = await file.read()
    texte = contenu.decode("utf-8-sig") 
    try : 
        taskFile = TaskFile(texte)
    except :
        raise HTTPException(status_code=404, detail="Le fichier n'est pas dans le bon format")
    

    nums, descriptions, durees, predecesseurs = taskFile.GetTaskTable()
    siTot = ToolKit.LongestBellman(taskFile.GetArcs(True))

    if siTot == [] : 
        raise HTTPException(status_code=405, detail="Le projet n'est pas eligible")

    fin = max(siTot)                                  
    dateFin = siTot[fin]    
    mins = ToolKit.ShortestBellman(taskFile.GetReversedArcs(), 0, fin)
    siTard = ToolKit.dateAuPlusTard(mins, dateFin)
    info= {
        "nums": nums,
        "descriptions": descriptions,
        "durees": durees,
        "predecesseurs": predecesseurs,
        "siTot": siTot,
        "siTard": siTard
    }
    return {"message":"success", "content": info}



