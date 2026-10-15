from classes.taskFile import TaskFile
from library import ToolKit
from fastapi import FastAPI, UploadFile, HTTPException

app = FastAPI()

@app.post("/fileinfo")
async def sendFileInfo(file: UploadFile):
    contenu = await file.read()
    texte = contenu.decode("utf-8-sig") 
    taskFile
    try : 
        taskFile = TaskFile(texte)
    except :
        raise HTTPException(status_code=404, detail="Le fichier n'est pas dans le bon format")
    if taskFile is None:
        raise HTTPException(status_code=404, detail="Fichier inconnu")

    nums, descriptions, durees, predecesseurs = taskFile.GetTaskTable()
    siTot = ToolKit.LongestBellman(nums,durees,predecesseurs)
    siTard = ToolKit.LatestStart(nums,durees,predecesseurs,siTot)
    info= {
        "nums": nums,
        "descriptions": descriptions,
        "durees": durees,
        "predecesseurs": predecesseurs,
        "siTot": siTot,
        "siTard": siTard
    }
    return {"message":"success", "content": info}

