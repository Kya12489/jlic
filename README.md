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

from classes.taskFile import TaskFile

testFile =  TaskFile("./formatTache.txt")
for i in range(0,testFile.GetNbTask()) :
    print(f"num = {testFile.GetTaskTable()[0][i]}")
    print(f"description = {testFile.GetTaskTable()[1][i]}")
    print(f"durée = {testFile.GetTaskTable()[2][i]}")
    print(f"prédécesseur = {testFile.GetTaskTable()[3][i]}")
    print("____________________________________________________________________________")