import os

class TaskFile:
    def __init__(self, path):
        self._filePath = path
        with open(self._filePath, encoding="utf-8") as fileOpened:
            self._content = fileOpened.read()

        self._firstDelimiteur = ";"   
        self._secondDelimiteur = ","  
        
        self._taskTable = [
            [],  # 0 : numéro de la tâche
            [],  # 1 : description de la tâche
            [],  # 2 : durée de la tâche
            [],  # 3 : prédécesseurs
        ]
        self._GenerateTable()

    def _GenerateTable(self):
        for line in self.GetContent().splitlines():
            if not line.strip() or line.strip().startswith("#"):  
                continue
            columns = line.split(self._firstDelimiteur)
            pred_str = columns[3].strip()
            if pred_str == "/" or pred_str == "" or pred_str.lower() == "aucune":
                preds = []
            else:
                preds = [int(x.strip()) for x in pred_str.split(self._secondDelimiteur)]
            
            self.AddTaskInTable(
                num=int(columns[0]),
                description=columns[1],
                duree=int(columns[2]),
                predecesseur=preds,
            )

    def AddTaskInTable(self, num, description="", duree=0, predecesseur=None):
        self._taskTable[0].append(num)
        self._taskTable[1].append(description)
        self._taskTable[2].append(duree)
        self._taskTable[3].append(predecesseur if predecesseur else [])

    def GetContent(self): return self._content
    def GetTaskTable(self): return self._taskTable
    def GetNbTask(self): return len(self.GetTaskTable()[0])
    
    def GetEdgesForBellman(self):
        """DIAGRAMME DU DIAPO : On connecte directement les tâches entre elles.

        Pas de tâche 0 fictive au départ [pdf_0.1.20].
        """
        edges = []
        for i in range(self.GetNbTask()):
            task_id = self._taskTable[0][i]
            preds = self._taskTable[3][i]
            if preds:
                for p in preds:
                    index_p = self._taskTable[0].index(p)
                    duree_p = self._taskTable[2][index_p]
                    edges.append((p, task_id, duree_p))  # Arc : Prédécesseur -> Tâche actuelle
        return edges  


# --- 1. L'ALLER : ALGORITHME DU DIAPO (Slide 11) ---
def bellman_plus_longs_aller(V, E, sigma):
    # s_i <- 0 (ou -inf) [pdf_0.1.27]
    s = {i: float('-inf') for i in V}          
    s[sigma] = 0  # s_sigma <- 0 [pdf_0.1.27]
    n = len(V)
    k = 0
    while True:                  
        k = k + 1
        c = False
        for (i, j, q) in E:       
            # Condition du diapo : si s_j < s_i + q_ij [pdf_0.1.27]
            if s[j] < s[i] + q:
                s[j] = s[i] + q
                c = True
        # Jusque c = Faux ou k = n [pdf_0.1.27]
        if c == False or k == n:   
            break
    return (c == False), s


# --- 2. LE RETOUR : ALGORITHME DU DIAPO INVERSÉ POUR LE PLUS TARD ---
def bellman_plus_tard_retour(V, E, tau, date_fin_projet):
    # Rétropropagation à l'envers : on initialise à +infini
    s_tard = {i: float('inf') for i in V}          
    s_tard[tau] = date_fin_projet  # Le nœud final tau est bloqué à la date F [pdf_0.1.18]
    n = len(V)
    k = 0
    while True:                  
        k = k + 1
        c = False
        for (i, j, q) in E:       
            # Formule inverse pour remonter le temps : s_tard_i <- min(s_tard_i, s_tard_j - q) [pdf_0.1.18]
            if s_tard[i] > s_tard[j] - q:
                s_tard[i] = s_tard[j] - q
                c = True
        if c == False or k == n:   
            break
    return s_tard


if __name__ == "__main__":
    nom_fichier = "formatTache.txt" 

    if not os.path.exists(nom_fichier):
        print(f"Le fichier '{nom_fichier}' n'existe pas.")
    else:
        tf = TaskFile(nom_fichier)
        liste_aretes = tf.GetEdgesForBellman()

        # DIAGRAMME DU DIAPO (Page 5 & 13) : 
        # Les sommets sont les Tâches de 1 à 10 + le nœud final fictif 11 (𝜏) [pdf_0.1.21, pdf_0.1.29]
        sommets = list(range(1, tf.GetNbTask() + 2))
        noeud_fin = sommets[-1]  # Le nœud 11 représente tau (𝜏) [pdf_0.1.21]

        # Ajout de l'arc final vers 11 (𝜏) depuis la tâche 10 avec son poids (durée de 10 = 1) [pdf_0.1.21, pdf_0.1.29]
        index_10 = tf.GetTaskTable()[0].index(10)
        duree_10 = tf.GetTaskTable()[2][index_10]
        liste_aretes.append((10, noeud_fin, duree_10))

        # 1. Calcul des dates au plus tôt (Aller, Racine sigma = 1) [pdf_0.1.27]
        realisable, dates_tot = bellman_plus_longs_aller(sommets, liste_aretes, sigma=1)

        if not realisable:
            print("❌ Le graphe n'est pas réalisable (cycle détecté).")
        else:
            date_fin = dates_tot[noeud_fin]

            # 2. Calcul des dates au plus tard (Retour, depuis tau = 11) [pdf_0.1.18]
            dates_tard = bellman_plus_tard_retour(sommets, liste_aretes, tau=noeud_fin, date_fin_projet=date_fin)

            # 3. Affichage visuel complet avec les marges
            print("✅ Analyse d'ordonnancement du projet P1 effectuée.\n")
            print(f"⏱️ Fin du projet au plus tôt (Nœud 𝜏) : {date_fin} jours.\n")
            
            print(f"{'N°':<4} | {'Description':<12} | {'Au plus tôt':<11} | {'Au plus tard':<12} | {'Marge':<6} | Statut")
            print("-" * 65)
            
            table = tf.GetTaskTable()
            taches_critiques = []
            
            for i in range(tf.GetNbTask()):
                tache_id = table[0][i]
                nom = table[1][i]
                tot = dates_tot[tache_id]
                tard = dates_tard[tache_id]
                
                # Calcul de la marge : plus tard - plus tôt [pdf_0.1.18]
                marge = tard - tot
                
                statut = "CRITIQUE 🚨" if marge == 0 else "Flexible"
                if marge == 0:
                    taches_critiques.append(tache_id)
                    
                print(f"{tache_id:<4} | {nom:<12} | {tot:<11} | {tard:<12} | {marge:<6} | {statut}")

            print("\n" + "="*42)
            print(f"📌 Chemin critique officiel obtenu par les marges : {taches_critiques}")
