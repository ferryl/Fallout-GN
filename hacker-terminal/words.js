const DICTIONARY = {
    4: ["FALL", "BALL", "CALL", "TALL", "MALL", "WALL", "HALL", "MILK", "SILK", "HUNT", "HINT", "TINT", "SINK", "TANK", "BANK", "RANK", "DARK", "MARK", "PARK", "LARK"],
    5: ["WATER", "LATER", "CATER", "HATER", "GHOST", "TOAST", "ROAST", "BOAST", "BEAST"],
    7: ["FALLING", "CALLING", "TALLING", "MALLING", "HUNTING", "HINTING", "TINTING", "TESTING", "RESTING", "WASTING"]
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