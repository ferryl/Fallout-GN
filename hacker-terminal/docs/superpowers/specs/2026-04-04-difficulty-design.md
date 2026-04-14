# Brainstorming Design: Ajustement Difficulté (INT)

## Objectif
Ajuster la fonction de difficulté de la réplique du terminal de piratage de Fallout pour qu'elle respecte la règle : **plus la statistique INT (Intelligence) du joueur est élevée, moins le piratage est difficile**.

## Approche Choise
Nous avons opté pour l'approche 2, qui maintient une complexité visuelle élevée pour les personnages intelligents, tout en rendant le jeu trivial.

## Détails du Design

### 1. Fonction `getDifficultyParams(intLevel)`
Cette fonction dans `game.js` dictera les paramètres selon la statistique INT :

*   **INT 1-4 (Faible Intelligence) -> Piratage Difficile**
    *   Mots Courts (4 lettres) : Moins d'information par indice (nombre de correspondances).
    *   Faux Mots : 14 mots au total sur l'écran (1 vrai, 13 faux).
    *   Séquences Spéciales (Aides) : 1 seule par session.
*   **INT 5-7 (Intelligence Moyenne) -> Piratage Normal**
    *   Mots Moyens (5 lettres) : Information d'indice moyenne.
    *   Faux Mots : 10 mots au total sur l'écran (1 vrai, 9 faux).
    *   Séquences Spéciales (Aides) : 2 par session.
*   **INT 8-10 (Haute Intelligence) -> Piratage Facile**
    *   Mots Longs (7 lettres) : Aspect visuel complexe de piratage "expert".
    *   Faux Mots : 5 mots au total (1 vrai, 4 faux) ; le bon mot est facile à trouver.
    *   Séquences Spéciales (Aides) : 4 par session, supprimant presque tous les faux mots ou restaurant les essais.

### 2. Dictionnaire (`words.js`)
Puisque le mode "Difficile" (INT 1-4) requiert de générer 14 mots sur l'écran, le tableau de mots de 4 lettres doit au minimum comporter 14 entrées. Actuellement, il en a 12. Il est nécessaire d'en ajouter d'autres (au minimum 2 ou plus) pour éviter les bugs lors de la sélection aléatoire.
Exemples ajoutés : "SINK", "TANK", "BANK", etc.

### 3. Effets sur l'interface
Aucun changement majeur à l'interface n'est requis. Seules la taille des listes (`words.length`), la longueur de chaque mot sélectionné et la quantité de balises HTML à injecter pour les séquences spéciales sont affectées en arrière-plan.

## Tests
*   Changer l'attribut `gameState.intStat` dans `game.js` à 3, 6, puis 9 pour vérifier que :
    *   Le nombre de mots présents correspond au palier.
    *   Leur taille correspond.
    *   Le nombre de blocs spéciaux cachés est correct.
    *   Le jeu ne plante pas (notamment à INT=3 avec 14 mots demandés sur des listes courtes).
