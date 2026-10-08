import re


class TaskFile:
    def __init__(self, path):
        self._filePath = path
        with open(self._filePath, encoding="utf-8") as f:
            self._content = f.read()

        self._firstDelimiteur = ";"   # délimiteur principal (ex : 1;murs;3;2,4)
        self._secondDelimiteur = ","  # délimiteur secondaire (ex : 3,4)
        
        self._taskTable = [
            [],  # numéro de la tâche
            [],  # description de la tâche
            [],  # durée de la tâche
            [],  # prédécesseurs
        ]

        self._generateTable()

    def _generateTable(self):
        for line in self.getContent().splitlines():
            if not line.strip():
                continue

            columns = line.split(self._firstDelimiteur)
            
            self.addTaskInTable(
                num=int(columns[0]),
                description=columns[1],
                duree=int(columns[2]),
                predecesseur=columns[3],
            )

   

    def addTaskInTable(self, num, description="", duree=0, predecesseur=[]):
        self._taskTable[0].append(num)
        self._taskTable[1].append(description)
        self._taskTable[2].append(duree)
        if predecesseur == "/" :
            predecesseur = []

        self._taskTable[3].append(predecesseur)

    # retourne le contenu du fichier
    def getContent(self):
        return self._content

    # donne la table des tâches
    def getTaskTable(self):
        return self._taskTable

    # retourne uniquement les numéros et les durées
    def getSommetAndEdge(self):
        return [self._taskTable[0], self._taskTable[2]]

    def getNbTask(self):
        return len(self.getTaskTable()[0])