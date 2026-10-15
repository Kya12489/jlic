from classes.taskFile import TaskFile
from library import ToolKit
from fastapi import FastAPI, UploadFile, HTTPException

app = FastAPI()

actifFile = {}   # un dict, pas une liste : on indexe par nom de fichier

@app.post("/send")
async def send(file: UploadFile):
    contenu = await file.read()
    texte = contenu.decode("utf-8-sig")      # bytes → str
    try : 
        actifFile[file.filename] = TaskFile(texte)
    except :
        raise HTTPException(status_code=404, detail="Le fichier n'est pas dans le bon format")

    return {"message": "fichier reçu", "nom": file.filename}

@app.get("/fileinfo/{filename}")
def sendFileInfo(filename: str):
    taskFile = actifFile.get(filename)

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

@app.get("/remove/{filename}") 
def removeFile(filename : str) :
    taskFile = actifFile.get(filename)
    
    if taskFile is None:
        raise HTTPException(status_code=404, detail="Fichier inconnu")

    actifFile[filename] = None 

    return {"message":"success"}