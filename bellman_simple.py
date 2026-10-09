# --- Lecture du fichier (meme format que p1_simple.txt) ---
with open("p1_simple.txt") as f:
    lignes = f.read().split("\n")

n = int(lignes[0])
duree = {}
arcs = []   # (i, j, poids) : j commence au plus tot poids jours apres le debut de i

for ligne in lignes[1:]:
    if ligne.strip() == "":
        continue
    nombres = [int(x) for x in ligne.split()]
    num, d, nb = nombres[0], nombres[1], nombres[2]
    duree[num] = d
    for p in nombres[3:3 + nb]:
        arcs.append((p, num, None))      # le poids = duree[p], connu plus tard

arcs = [(i, j, duree[i]) for (i, j, _) in arcs]

# --- Bellman (plus long chemin) ---
tot = {i: 0 for i in duree}              # tout le monde peut commencer a 0

realisable = True
for tour in range(n + 1):
    change = False
    for (i, j, w) in arcs:
        if tot[i] + w > tot[j]:
            tot[j] = tot[i] + w
            change = True
    if not change:
        break
    if tour == n:                        # encore des changements apres n tours
        realisable = False               # => circuit de poids positif

# --- Resultats ---
if not realisable:
    print("Projet NON realisable (circuit de poids positif)")
else:
    print("Projet realisable")
    for i in sorted(tot):
        print("Tache", i, ": debut au + tot =", tot[i])
    print("Duree minimale F =", max(tot[i] + duree[i] for i in tot))
