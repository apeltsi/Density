// DENSITY INITIALIZER IS DEPRICATED
var packages = [
    "Density/Math.js",
    "Density/Misc.js",
    "Density/Input.js",
    "Density/Physics.js",
    "Density/AssetLoader.js",
    "Density/Core.js",
    "physics.js",
    "cameraController.js",
    "networking.js",
    "game.js",
];
var initFunction = "";
jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: "script",
        success: callback,
        async: true,
    });
};
var currentItem = 0;
var textDistance = 0;
var time;
var xOffset = 5;
var startTime = new Date().getTime();
document.getElementById("maincanvas").width = window.innerWidth;
document.getElementById("maincanvas").height = window.innerHeight;
document.getElementById("maincanvas").getContext("2d").fillStyle = "black";
textDistance += 20;
document
    .getElementById("maincanvas")
    .getContext("2d")
    .fillText("(c) Copyright 2020, Amos Peltonen", xOffset, textDistance);
textDistance += 20;
document
    .getElementById("maincanvas")
    .getContext("2d")
    .fillText(
        '"Density-Initializer.js" has been enabled. Initializing will begin shortly...',
        xOffset,
        textDistance
    );
window.onresize = resize;
init();

function init() {
    textDistance += 20;
    time = new Date().getTime();
    document
        .getElementById("maincanvas")
        .getContext("2d")
        .fillText(
            'Loading "' + packages[currentItem] + '"...',
            xOffset,
            textDistance
        );
    $.loadScript("/web/game/" + packages[currentItem], done);
}

function resize() {
}

function done() {
    textDistance += 20;
    document
        .getElementById("maincanvas")
        .getContext("2d")
        .fillText(
            'Done loading "' +
                packages[currentItem] +
                '" in ' +
                (new Date().getTime() - time) +
                "ms!",
            xOffset,
            textDistance
        );
    currentItem++;
    if (currentItem < packages.length) {
        init();
    } else {
        textDistance += 20;
        document
            .getElementById("maincanvas")
            .getContext("2d")
            .fillText(
                "Done loading all packages in " +
                    (new Date().getTime() - startTime) +
                    "ms!",
                xOffset,
                textDistance
            );
        initGame();
    }
}

function initGame() {
    textDistance += 20;
    document
        .getElementById("maincanvas")
        .getContext("2d")
        .fillText(
            "Initializing game, please stand by...",
            xOffset,
            textDistance
        );
    document.getElementById("loadingText").innerText = "Loading Assets...";
    loadDefaultAssets(
        () => {
            setTimeout(window["game"]["init"], 50);
        },
        (itemname) => {
            document.getElementById("loadingText").innerText =
                "Loading " + itemname;
        }
    );
}
