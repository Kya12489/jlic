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
for i in range(0,testFile.getNbTask()) :
    print(f"num = {testFile.getTaskTable()[0][i]}")
    print(f"description = {testFile.getTaskTable()[1][i]}")
    print(f"durée = {testFile.getTaskTable()[2][i]}")
    print(f"prédécesseur = {testFile.getTaskTable()[3][i]}")
    print("____________________________________________________________________________")