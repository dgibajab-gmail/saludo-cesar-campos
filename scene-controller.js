/* global AFRAME, THREE */

function performSound() {
  var soundButton = document.getElementById("soundBtn");
  soundButton.click();
}

function playButtonSound() {
  const audio = new Audio({
    volume: 1,
    src: [
      '"https://cdn.glitch.global/e105e13f-2804-4f7d-a7e4-6d7f450c5d7f/button.mp3?v=1696281502630"',
    ],
  });
  audio.loop = false;
  audio.play();

  var menu = document.getElementsByClassName("menu-intro");
  menu[0].style.display = "none";
}

function onMarkerFound(isFound) {
  console.log(isFound);
}

AFRAME.registerComponent("scene-controller", {
  init: function () {
    // wait until the model is loaded
    var markerEl = document.getElementById("marker");
    var modelEl = document.getElementById("model");
    var audioEl = document.getElementById("audio");
    var btnEl = document.getElementById("btnPlay");
    var animMixer = null;
    var firstPlay = true;

    const modelAudio = new Audio(
      "https://cdn.glitch.global/966d8b79-e7c8-4db9-88a3-44874315366d/Audio-Campos.mp3?v=1743064908695"
    );
    modelAudio.volume = 1;
    modelAudio.loop = false;
    
    btnEl.setAttribute("visible", false);

    btnEl.onclick = function (e) {
      //if(e.handled == false) return;
      //if(!firstPlay){firstPlay = true; return;}
      if (animMixer) animMixer.timeScale = 1;
      
      var delay = firstPlay ? 400:0;
      firstPlay = false;
      setTimeout(function(){ 
        modelAudio.play();
      },delay);
      
      btnEl.setAttribute("visible", false);
    };

    markerEl.addEventListener("targetFound", function () {
      var markerId = markerEl.id;

      btnEl.setAttribute("visible", true);
    });

    markerEl.addEventListener("targetLost", function () {
      var markerId = markerEl.id;

      if (animMixer)
        // if the mixer exists
        animMixer.timeScale = 0;

      modelAudio.pause();
    });

    modelEl.addEventListener("model-loaded", (evt) => {
      
      const mixer = new THREE.AnimationMixer(
        modelEl.components["gltf-model"].model
      );
      const clips = modelEl.components["gltf-model"].model.animations[0];
      var animation = mixer.clipAction(clips);
      animation.setLoop(THREE.LoopOnce);
      animation.clampWhenFinished = true;
      animation.enable = true;

      animation.play();
      mixer.timeScale = 0;

      animMixer = mixer;
      this.mixer = mixer;
      
      btnEl.setAttribute("visible", true);
    });
  },
  // on each render loop (actually before each render loop)
  tick: function (t, dt) {
    if (!this.mixer) return; // if the mixer exists
    this.mixer.update(dt / 1000); // update it with the delta time
  },
});
