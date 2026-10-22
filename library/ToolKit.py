#arcs : array
#siSource : int
#source : int
#retourne {} si invalide et {si1,si2,siN} si valide
def ShortestBellman(arcs, siSource=0, source=1):
    sommet = set()
    for destinataire, origine, _ in arcs:
        sommet.add(destinataire)
        sommet.add(origine)
    sommet = sorted(sommet)
    n=len(sommet)

    si = {}
    for s in sommet:
        si[s] = float("inf")
    si[source] = siSource

    
    for _ in range(n):
        changed = False
        for j, i, poids in arcs:
            if si[j] > si[i] + poids:
                si[j] = si[i] + poids
                changed = True
        if not changed:
            return si 
    return {}         

#arcs : array
#siSource : int
#source : int
#retourne {} si invalide et {si1,si2,siN} si valide
def LongestBellman(arcs, siSource=0, source=1):
    sommet = set()
    for destinataire, origine, _ in arcs:
        sommet.add(destinataire)
        sommet.add(origine)
    sommet = sorted(sommet)
    n = len(sommet)

    si = {s: float("-inf") for s in sommet}
    si[source] = siSource

    for _ in range(n):
        changed = False
        for j, i, poids in arcs:
            if si[j] < si[i] + poids:
                si[j] = si[i] + poids
                changed = True
        if not changed:
            return si
    return {}



#bellman : array
#dateFin : int
def dateAuPlusTard(bellman,dateFin) :
    tard = {}
    for date in bellman :
        tard[date] = dateFin+bellman[date]

    return tard