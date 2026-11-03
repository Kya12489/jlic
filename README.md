# jlic

JLIC est un projet réalisé en license proffesionel a l'université d'angers.
Il s'agit d'un projet fait en equipe de 4 ayant pour but d'analyser un projet avec l'algorithme de [Bellman](https://fr.wikipedia.org/wiki/Algorithme_de_Bellman-Ford).

Le client est en react.js ( un framework de js ) afin de decouvrir son fonctionnement et de découvrir un nouveau framework.
Le client utilise le package [reactflow](https://reactflow.dev/) afin d'afficher le graphe MPM
Le client est mis en ligne avec [netlify](https://app.netlify.com/)

Le serveur est en python et utilise le package [fastAPI](https://fastapi.tiangolo.com/) afin de délivrer les informations au client
Le serveur est héberger sur [Render](https://render.com) qui est gratuit mais s'etein au bout de 15 minute et redemarre automatiquement.

Vous pouvez allez voir la documentation de l'api afin de voir ce qu'elle renvoi et les different route de l'api : https://jlic.onrender.com/docs

Le projet est finit et mis en ligne.
Lien du client : https://jlic.netlify.app/
Lien du serveur : https://jlic.onrender.com/

Afin que le programme fonctionne correctement il faut envoyer un fichier.txt dans le format suivant : 
Sommet  : numTache;descriptionTache;duréeTache;predecesseurTache
Contrainte : c;origin;predecesseur;poids

exemple de fichier : 
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
