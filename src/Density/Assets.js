import { sleep } from "./Core.js";

// Density Asset Loader
var assets = {};
assets.isDone = false;
loadDefaultAssets();
function loadDefaultAssets(
  done = (e) => {
    console.log("Assets Loaded!");
  }
) {
  var assetContainer = document.createElement("DIV");
  assetContainer.style.display = "none";
  var http = new XMLHttpRequest();
  http.onload = async () => {
    var assetsLoaded = 0;
    var totalAssets = 0;
    var assetsData = http.response;
    for (let i = 0; i < assetsData.length; i++) {
      const element = assetsData[i];
      if (element.type == undefined) {
        totalAssets++;
        const imgElement = document.createElement("IMG");
        imgElement.src = "./assets/" + element;
        assetContainer.append(imgElement);
        imgElement.onload = () => {
          assetsLoaded++;
        };
        assets[element.split(".")[0].replace(/\//g, "_")] = imgElement;
      } else if (element.type == "animation") {
        const arr = [];
        for (let item = 1; item < element.itemcount; item++) {
          totalAssets++;
          const imgElement = document.createElement("IMG");
          imgElement.src = "./assets/" + element.path + item + ".png";
          assetContainer.append(imgElement);
          imgElement.onload = () => {
            assetsLoaded++;
          };
          arr.push(imgElement);
        }
        assets[element.path.split(".")[0].replace(/\//g, "_")] = arr;
      }
    }
    while (assetsLoaded != totalAssets) {
      await sleep(500);
    }
    done();
    assets.isDone = true;
  };
  http.responseType = "json";
  http.open("GET", "./assets/assets.json");
  http.send();
}

export default assets;
