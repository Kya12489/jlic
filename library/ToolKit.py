#nums : array
#duree : array
#predecesseurs : array
#retourne [] si invalide, [si1,si2,si3,siN] si valide
def ShortestBellman(nums,durees,predecesseurs) :
    si = []
    n = len(nums)
    k=0

    for i in range (0,n) :
        si.append(float("inf"))

    si[0] = 0

    for j in range(0,n) :
        k+=1
        changed = False

        if predecesseurs[j] == []:
            continue
        
        for predecesseur in predecesseurs[j] :
            if si[j] > si[predecesseur-1] + durees[predecesseur-1] :
                si[j] = si[predecesseur-1] + durees[predecesseur-1] 
                changed = True
        if not changed :
            return[]
    if k!= n :
        return []
    return si

#sommet : array
#edge : array
#retourne [] si invalide, [si1,si2,si3,siN] si valide
def LongestBellman(arcs,siSource=0,source=1) :
    si = {}

    sommet = set()
    for destinataire, origine, _ in arcs:
        sommet.add(destinataire)
        sommet.add(origine)
    sommet = sorted(sommet)

    n = len(sommet)
    k=0

    for i in sommet :
        si[i] = float("-inf")

    si[source] = siSource

    for passe in range(0,n) : 
        changed = False
        k+=1
        for j,i,poids in arcs :
            if si[j]<=si[i]+poids :
                si[j]=si[i]+poids
                changed = True
        if not changed :
            return []

    if k!=n : 
        return []

    return si

    # for j in range(0,n) :
    #     k+=1
    #     changed = False

    #     if predecesseurs[j] == []:
    #         continue
        
    #     for predecesseur in predecesseurs[j] :
    #         if si[j] < si[predecesseur-1] + durees[predecesseur-1] :
    #             si[j] = si[predecesseur-1] + durees[predecesseur-1] 
    #             changed = True
    #     if not changed :
    #         return[]
    # if k!= n :
    #     return []
    # return si

#calcul date au plus tard
#ti = plus tard
#j = predecesseur
def LatestStart(nums, durees, predecesseurs, si) :
    n = len(nums)
    ti = [si[n-1]] * n                      
 
    for i in range(n-2, -1, -1) :           
        for j in range(n) :
            if nums[i] in predecesseurs[j] :               
                ti[i] = min(ti[i], ti[j] - durees[i])       #On calcule a quelle date i doit commencer au plus tard pour être finie quand j commence
    return ti