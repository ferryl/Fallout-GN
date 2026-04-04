# Design Spécification: Écran de Fin de Piratage (Glitch & Typewriter)

## Contexte
L'objectif est de fournir un retour visuel immersif et gratifiant (ou punitif) lorsque le joueur réussit ou échoue le mini-jeu de piratage "Hacker Terminal". L'écran actuel reste figé sur le dernier état sans transition forte.

## Objectif
Implémenter une séquence de fin de partie combinant des effets visuels (glitch, CRT) et une animation de texte classique (machine à écrire) pour annoncer le résultat du piratage et permettre de rejouer.

## Fonctionnement Détaillé

### 1. Déclenchement (Le Glitch)
Lorsqu'une condition de fin de partie est atteinte (bon mot de passe trouvé ou 0 tentative restante), la séquence commence.
*   **Action :** L'interface actuelle (la grille de mots, l'historique, l'en-tête) subit un effet visuel de type "Glitch CRT" (aberration chromatique, décalage horizontal, tremblement) pendant une courte durée (environ 0.5 seconde).

### 2. Transition (Le Vide)
*   **Action :** Le conteneur principal (le texte du jeu) disparaît instantanément.
*   **Rendu visuel :** L'écran devient noir. Seules les lueurs de fond (`body` background) et l'animation de la scanline continuent de fonctionner.

### 3. Affichage du Résultat (Typewriter & Focus)
Un nouveau conteneur de résultat apparaît, centré et occupant tout l'écran.

**Séquence de SUCCÈS :**
1.  **En haut à gauche :** Affichage progressif (effet machine à écrire) de la ligne : `> MOT DE PASSE ACCEPTÉ...`
2.  **Au centre (Immédiat après) :** Un texte imposant, avec une taille de police plus grande, apparaît d'un coup et clignote lentement : `ACCÈS AUTORISÉ`.

**Séquence d'ÉCHEC :**
1.  **En haut à gauche :** Affichage progressif (effet machine à écrire) de la ligne : `> TENTATIVES ÉPUISÉES...`
2.  **Au centre (Immédiat après) :** Un texte imposant, avec une taille de police plus grande, apparaît d'un coup et clignote lentement : `VERROUILLAGE DU SYSTÈME`.

### 4. Relance (Restart)
*   **Action :** Environ 2 secondes après l'affichage du texte central, une petite ligne interactive apparaît en bas (ou sous le texte central), clignotante : `> CLIQUEZ POUR REDÉMARRER_`
*   **Interaction :** Un clic n'importe où sur l'écran (ou spécifiquement sur cette ligne) réinitialise l'état du jeu (`initGame()`), vide l'écran de fin et restaure l'interface de jeu.

## Composants à Modifier

*   **`index.html` :** Ajout d'une structure cachée (`div` de résultat) pour afficher le message de fin, indépendante de la grille de jeu.
*   **`styles.css` :** 
    *   Création des classes d'animation pour le "Glitch" sur le conteneur principal.
    *   Styles pour l'écran de résultat (centrage absolu, grandes polices, clignotement lent).
    *   Styles pour l'effet typewriter (qui existe peut-être déjà en partie).
*   **`game.js` :** 
    *   Modification de la logique de fin (`gameState.isLocked = true`) pour déclencher la séquence.
    *   Gestion des délais (setTimeout) pour ordonner le glitch, l'effacement, l'effet typewriter, l'affichage central et le bouton de relance.
    *   Logique de réinitialisation de l'affichage lors du clic de redémarrage.

## Revue de Spécification (Self-Review)
*   [x] TBD / TODO retirés : Oui, le flux est complet.
*   [x] Cohérence interne : La transition entre le glitch, le vide, l'effet typewriter et la relance est chronologiquement logique.
*   [x] Portée : Modérée. Implique CSS et JS principalement. Parfaitement faisable en une itération.
*   [x] Ambiguïté : Les textes exacts et la séquence temporelle sont définis (0.5s glitch, 2s relance).
