// Density Asset Loader
var assets = {};
assets.isDone = false;
loadDefaultAssets();
function loadDefaultAssets(
  done = (e) => {},
  itemload = (e) => {
    console.log("Loading asset: " + e);
  }
) {
  var assetContainer = document.createElement("DIV");
  assetContainer.style.display = "none";
  $.getJSON("./assets/assets.json", async (assetsData) => {
    for (let i = 0; i < assetsData.length; i++) {
      const element = assetsData[i];
      const imgElement = document.createElement("IMG");
      itemload(element);
      imgElement.src = "./assets/" + element;
      assetContainer.append(imgElement);
      await waitForImageLoad(imgElement);
      assets[element.split(".")[0]] = imgElement;
    }
    done();
    assets.isDone = true;
  });
}

async function loadAssets(assetsData, done, itemload) {
  var assetContainer = document.createElement("DIV");
  assetContainer.style.display = "none";
  for (let i = 0; i < assetsData.length; i++) {
    const element = assetsData[i];
    const imgElement = document.createElement("IMG");
    itemload(element);
    imgElement.src = "../assets/" + element;
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

export default assets;
