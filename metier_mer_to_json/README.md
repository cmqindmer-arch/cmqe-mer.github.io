# Générateur de fichier json pour les métiers de la mer

Projet visant à convertir un tableur Microsft Excel en fichier json pour  [l'application web des métiers de la mer.](https://cmqe-mer.github.io)


## Utilisation

### Démarrage rapide

Un exécutable est founi pour les systèmes Windows, ces appareils peuvent utiliser le programme directement après l'avoir téléchargé.

Pour générer les fichiers :

1. Placer le fichier excel ayant le format correct dans le répertoire `"xlsx"`

2. Double cliquer dans l'explorateur de ficher sur `main.exe`.

3. Après une courte durée, les fichiers générés se trouveront dans le dossier `json`

4. Remplacer les anciens fichiers par les nouveaux


### A partir du code source

1. Téléchargez [la toolchain Dart.](https://dart.dev/get-dart)

2. Placer le fichier excel ayant le format correct dans le répertoire `"xlsx"

3. Se placer à la racine du projet dans un terminal et lancer la commande.
    ```console
    dart run  ./bin/main.dart
    ```
    en remplaçant le chemin du fichier par son équivalent pour le système d'exploitation utilisé.

4. Après une courte durée, les fichiers générés se trouveront dans le dossier `json`.

5. Remplacer les anciens fichiers par les nouveaux.


