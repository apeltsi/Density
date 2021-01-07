// As we're using Density 2.0 we have to import all density modules that we wish to use manually.
import Density from "./Density/Core.js";
import { Cluster } from "./Density/Clusters.js";

function Initialize() {
  window["engineCore"]["init"]();
}
Density.resize = () => {
  document.getElementById("maincanvas").width = window.innerWidth;
  document.getElementById("maincanvas").height = window.innerHeight;
  engineCore.width = canvas.width;
  engineCore.height = canvas.height;
};

console.log(Density);

function update() {}
