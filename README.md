# jlic

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


#mis à jour le 12/10/2026

from classes.taskFile import TaskFile
from library import ToolKit

try:
    testFile = TaskFile("./formatTache.txt")
    testFile.AddTaskInTable(
        num=testFile.GetNbTask()+1,
        description="FIN",
        predecesseur=str(testFile.GetTaskTable()[0][-1])
    )

    for i in range(testFile.GetNbTask()):
        print(f"num = {testFile.GetTaskTable()[0][i]}")
        print(f"description = {testFile.GetTaskTable()[1][i]}")
        print(f"durée = {testFile.GetTaskTable()[2][i]}")
        print(f"prédécesseur = {testFile.GetTaskTable()[3][i]}")
        print("____________________________________________________________________________")

    print("si plus court : ", ToolKit.ShortestBellman(testFile.GetTaskTable()[0] , testFile.GetTaskTable()[2], testFile.GetTaskTable()[3]))
    print("si plus long : ", ToolKit.LongestBellman(testFile.GetTaskTable()[0] , testFile.GetTaskTable()[2], testFile.GetTaskTable()[3]))


except ValueError as e:
    print(e)