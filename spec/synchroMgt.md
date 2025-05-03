Gestion de la Synchronisation avec le serveur
=============================================

1er lancement de l'application sans avoir déjà contacté le server
-----------------------------------------------------------------

- On cherche à ouvrir un fichier local *"synchro"* <br>
Dans ce cas d'utilisation, le fichier n'existe pas ==> Il faut le gérer dans le catch de la méthode de lecture.
    1. Il faut ouvrir la base local
    2. Tenter de se connecter au server pour récupérer la date de la dernière mise à jour
        - Si la date du server est plus récente alors il faut lire la BDD du server
        - Si la date du server est plus ancienne alors il faut lire la BDD locale et faire une sauvegarde distante et mettre à jour la date de mise à jour sur le server.
        - Si la date n'a pas encore été mise en place alors il faut lire la BDD locale et faire une sauvegarde distante et mettre à jour la date de mise à jour sur le server.
