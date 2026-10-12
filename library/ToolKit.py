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
def LongestBellman(nums,durees,predecesseurs) :
    si = []
    n = len(nums)
    k=0

    for i in range (0,n) :
        si.append(float("-inf"))

    si[0] = 0

    for j in range(0,n) :
        k+=1
        changed = False

        if predecesseurs[j] == []:
            continue
        
        for predecesseur in predecesseurs[j] :
            if si[j] < si[predecesseur-1] + durees[predecesseur-1] :
                si[j] = si[predecesseur-1] + durees[predecesseur-1] 
                changed = True
        if not changed :
            return[]
    if k!= n :
        return []
    return si