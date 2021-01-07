// Density Asset Loader
var assets = {};

function loadDefaultAssets(done, itemload) {
    var assetContainer = document.createElement("DIV");
    assetContainer.style.display = "none";
    $.getJSON("/web/game/assets/assets.json", async (assetsData) => {
        for (let i = 0; i < assetsData.length; i++) {
            const element = assetsData[i];
            const imgElement = document.createElement("IMG");
            itemload(element);
            imgElement.src = "/web/game/assets/" + element;
            assetContainer.append(imgElement);
            await waitForImageLoad(imgElement);
            assets[element.split(".")[0]] = imgElement;
        }
        done();
    });
}

async function loadAssets(assetsData, done, itemload) {
    var assetContainer = document.createElement("DIV");
    assetContainer.style.display = "none";
    for (let i = 0; i < assetsData.length; i++) {
        const element = assetsData[i];
        const imgElement = document.createElement("IMG");
        itemload(element);
        imgElement.src = "/web/game/assets/" + element;
        assetContainer.append(imgElement);
        await waitForImageLoad(imgElement);
        assets[element] = imgElement;
    }
    done();
}

async function waitForImageLoad(img) {
    return new Promise((resolve, reject) => {
        img.onload = resolve;
    });
}
