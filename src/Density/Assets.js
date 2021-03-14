// Density Asset Loader
var assets = {};
assets.isDone = false;
loadDefaultAssets();
function loadDefaultAssets(done = (e) => {}, itemload = (e) => {}) {
  var assetContainer = document.createElement("DIV");
  assetContainer.style.display = "none";
  var http = new XMLHttpRequest();
  http.onload = async () => {
    var assetsData = http.response;
    for (let i = 0; i < assetsData.length; i++) {
      const element = assetsData[i];
      if (element.type == undefined) {
        const imgElement = document.createElement("IMG");
        itemload(element);
        imgElement.src = "./assets/" + element;
        assetContainer.append(imgElement);
        await waitForImageLoad(imgElement);
        assets[element.split(".")[0].replace(/\//g, "_")] = imgElement;
      } else if (element.type == "animation") {
        const arr = [];
        for (let item = 1; item < element.itemcount; item++) {
          const imgElement = document.createElement("IMG");
          itemload(element);
          imgElement.src = "./assets/" + element.path + item + ".png";
          assetContainer.append(imgElement);
          await waitForImageLoad(imgElement);
          arr.push(imgElement);
        }
        assets[element.path.split(".")[0].replace(/\//g, "_")] = arr;
      }
    }
    done();
    assets.isDone = true;
  };
  http.responseType = "json";
  http.open("GET", "./assets/assets.json");
  http.send();
}

async function loadAssets(assetsData, done, itemload) {
  var assetContainer = document.createElement("DIV");
  assetContainer.style.display = "none";
  for (let i = 0; i < assetsData.length; i++) {
    const element = assetsData[i];
    const imgElement = document.createElement("IMG");
    itemload(element);
    imgElement.src = "./assets/" + element;
    assetContainer.append(imgElement);
    await waitForImageLoad(imgElement);
    assets[element.replace(/\//g, "_")] = imgElement;
  }
  done();
}

async function waitForImageLoad(img) {
  return new Promise((resolve, reject) => {
    img.onload = resolve;
  });
}

export default assets;
