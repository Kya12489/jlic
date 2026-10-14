# jlic

il est necessaire d'installer les package suivant : 
pip install fastapi[standard]

ou d'installer les requirement : 
pip install -r requirements.txt

Pour lancer l'api il faut rentrer les commande suivant : 
python3 -m venv .venv
source test-env/bin/activate
fastapi dev main.py

Format des fichier txt : 
pour le format des taches : 

numTache;Description;Durée;Predecesseur1,PredecesseurN

Format dans la classe TaskFile : 
[
    [], num 
    [], description
    [], durée
    [], predecesseur
]

exemple dans un for (a tester dans le fichier main.py) : 


#mis à jour le 14/10/2026

from classes.taskFile import TaskFile
from library import ToolKit

try:
    testFile = TaskFile("./formatTache.txt")
    testFile.AddTaskInTable(
        num=testFile.GetNbTask()+1,
        description="FIN",
        predecesseur=str(testFile.GetTaskTable()[0][-1])
    )
    nums, desc, durees, preds = testFile.GetTaskTable()
    siTot = ToolKit.LongestBellman(nums, durees, preds)
    siTard = ToolKit.LatestStart(nums,durees,preds,siTot)
    for i in range(testFile.GetNbTask()):
        
        print(f"num = {nums[i]}")
        print(f"description = {desc[i]}")
        print(f"durée = {durees[i]}")
        print(f"prédécesseur = {preds[i]}")

        print("date au plus tot = ", siTot[i])
        print("date au plus tard =", siTard[i])
        print("retard autoriser = ", siTard[i] - siTot[i])
        print("____________________________________________________________________________")

except ValueError as e:
    print(e)