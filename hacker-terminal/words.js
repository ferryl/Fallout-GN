const DICTIONARY = {
    4: ["CHAT", "PAIN", "MAIN", "PIED", "CIEL", "JEUX", "FEUX", "LAIT", "EAUX", "BOIS", "NOIR", "VERT", "BLEU", "GRIS", "VITE", "LENT", "FORT", "DOUX", "NUIT", "JOUR"],
    5: ["CHIEN", "POMME", "LIVRE", "TABLE", "ROUTE", "MONDE", "TEMPS", "COEUR", "ESPRIT", "PLUIE", "NEIGE", "FORET", "AVION", "RADIO", "PHOTO", "STYLE", "VAGUE", "LIGNE", "POULE", "SALLE", "PORTE", "VILLE"],
    7: ["BONJOUR", "VOITURE", "PLANETE", "LUMIERE", "DESSERT", "CUISINE", "FENETRE", "BUREAUX", "PARFAIT", "MUSIQUE", "TRAVAIL", "JOURNAL", "COUTEAU", "CHATEAU", "VILLAGE"]
};

const GARBAGE_CHARS = "!@#$%^&*_+-=|;':\",./<>?";

const SPECIAL_OPEN = ["(", "[", "{", "<"];
const SPECIAL_CLOSE = [")", "]", "}", ">"];

function generateSpecialSequence() {
    const openIdx = Math.floor(Math.random() * SPECIAL_OPEN.length);
    const closeIdx = openIdx;
    const open = SPECIAL_OPEN[openIdx];
    const close = SPECIAL_CLOSE[closeIdx];
    
    const innerLength = 2 + Math.floor(Math.random() * 4);
    let inner = "";
    for (let i = 0; i < innerLength; i++) {
        inner += GARBAGE_CHARS.charAt(Math.floor(Math.random() * GARBAGE_CHARS.length));
    }
    
    return open + inner + close;
}