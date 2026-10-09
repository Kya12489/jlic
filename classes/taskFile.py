import re


class TaskFile:
    def __init__(self, path):
        self._filePath = path
        fileOpened = open(self._filePath, encoding="utf-8")
        self._content = fileOpened.read()
        fileOpened.close()

        self._firstDelimiteur = ";"   # délimiteur principal (ex : 1;murs;3;2,4)
        self._secondDelimiteur = ","  # délimiteur secondaire (ex : 3,4)
        
        
        self._taskTable = [
            [],  # numéro de la tâche
            [],  # description de la tâche
            [],  # durée de la tâche
            [],  # prédécesseurs
        ]

        if not self.FormatVerif():
            raise ValueError("Fichier incompatible.")

        self._GenerateTable()

    def FormatVerif(self):
        for numero, line in enumerate(self.GetContent().splitlines(), 1):
            if not line.strip():
                continue

            columns = line.split(self._firstDelimiteur)

            if len(columns) != 4:
                print(f"Erreur ligne {numero} : "f"{len(columns)} colonnes au lieu de 4.")
                return False

        return True

    def _GenerateTable(self):
        for line in self.GetContent().splitlines():
            if not line.strip():
                continue

            columns = line.split(self._firstDelimiteur)
            
            self.AddTaskInTable(
                num=int(columns[0]),
                description=columns[1],
                duree=int(columns[2]),
                predecesseur=columns[3],
            )

   
    def isMatriceFile() : 
        pass

    def AddTaskInTable(self, num, description="", duree=0, predecesseur=""):
        self._taskTable[0].append(num)
        self._taskTable[1].append(description)
        self._taskTable[2].append(duree)
        if predecesseur == "/" :
            predecesseur = ""


        self._taskTable[3].append(predecesseur)

    # retourne le contenu du fichier
    def GetContent(self):
        return self._content

    # donne la table des tâches
    def GetTaskTable(self):
        return self._taskTable

    # retourne uniquement les numéros et les durées
    def GetSommetAndEdge(self):
        return [self._taskTable[0], self._taskTable[2]]

    def GetNbTask(self):
        return len(self.GetTaskTable()[0])