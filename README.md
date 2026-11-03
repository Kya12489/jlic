# JLIC

JLIC est un projet réalisé dans le cadre d'une licence professionnelle à l'Université d'Angers.

Il s'agit d'un projet réalisé en équipe de quatre personnes, ayant pour but d'analyser un projet à l'aide de l'algorithme de [Bellman-Ford](https://fr.wikipedia.org/wiki/Algorithme_de_Bellman-Ford).

## Client

Le client est développé avec React.js (une bibliothèque JavaScript), afin de découvrir son fonctionnement et d'apprendre à utiliser une nouvelle technologie.

Le client utilise le package [React Flow](https://reactflow.dev/) afin d'afficher le graphe MPM.

Le client est mis en ligne avec [Netlify](https://app.netlify.com/).

## Serveur

Le serveur est développé en Python et utilise le framework [FastAPI](https://fastapi.tiangolo.com/) afin de transmettre les informations au client.

Le serveur est hébergé sur [Render](https://render.com/). L'offre gratuite entraîne une mise en veille après une période d'inactivité de 15 minutes. Le serveur redémarre automatiquement lorsqu'une nouvelle requête est effectuée.

Vous pouvez consulter la [documentation de l'API](https://jlic.onrender.com/docs) afin de découvrir les informations qu'elle renvoie ainsi que les différentes routes disponibles.

## Mise en ligne

Le projet est terminé et mis en ligne.

- **Lien du client :** [https://jlic.netlify.app/](https://jlic.netlify.app/)
- **Lien du serveur :** [https://jlic.onrender.com/](https://jlic.onrender.com/)

## Format du fichier

Afin que le programme fonctionne correctement, il faut envoyer un fichier `.txt` respectant le format suivant :

- **Sommet :** `numTache;descriptionTache;dureeTache;predecesseursTache`
- **Contrainte :** `c;origine;predecesseur;poids`

### Exemple de fichier

```txt
1;Murs;7;/
2;Charpente;3;1
3;Toiture;1;2
4;Plomberie;8;1
5;Electricité;2;3,4
6;Fenêtres;1;3,4
7;Jardin;1;3,4
8;Peintures;3;6
9;Cuisine;2;8
10;Installation;1;5,7,9
c;3;6;-3
```