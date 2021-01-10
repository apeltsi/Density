document.addEventListener('keydown', logKey);
document.addEventListener('keyup', logKeyUp);
var keysDown = [];

function logKey(e) {
    for (var i = 0; i < keysDown.length; i++) {
        if (keysDown[i].key == e.code) {
            keysDown[i] = new KeyDown(e.code, new Date().getTime(), false);
            return;
        }
    }
    keysDown[keysDown.length] = new KeyDown(e.code, new Date().getTime(), true);
}

function logKeyUp(e) {
    for (var i = 0; i < keysDown.length; i++) {
        if (keysDown[i].key == e.code) {
            keysDown.splice(i, 1);
            return;
        }
    }
}

function getKey(key) {
    var key2 = "Key" + key.toLowerCase();
    var newKeys = [];
    for (var i = 0; i < keysDown.length; i++) {
        if (new Date().getTime() - keysDown[i].timeondown < 1500) {
            newKeys.push(keysDown[i]);
        }
    }
    keysDown = newKeys;
    for (var i = 0; i < keysDown.length; i++) {
        if (keysDown[i].key == "Key" + key || keysDown[i].key == key2 || keysDown[i].key == key) {
            return true;
        }
    }
    return false;
}

function getKeyOnce(key) { // Only returns true once. (Doesn't return on hold)
    var key2 = "Key" + key.toLowerCase();
    var newKeys = [];
    var returnVal = false;
    for (var i = 0; i < keysDown.length; i++) {
        if (new Date().getTime() - keysDown[i].timeondown < 500 && keysDown[i].key != "Key" + key && keysDown[i].key != key2 && keysDown[i].key != key) {
            newKeys.push(keysDown[i]);
        } else if (new Date().getTime() - keysDown[i].timeondown < 500) {
            returnVal = true;
        }
    }
    keysDown = newKeys;
    return returnVal;
}

function getAllKeys() {
    return keysDown;
}

function getAllKeysOnce() {
    var returnVal = keysDown;
    keysDown = [];
    return returnVal;
}


function KeyDown(key, timeondown, downFrame) {
    this.key = key;
    this.timeondown = timeondown;
    this.downFrame = downFrame;
}