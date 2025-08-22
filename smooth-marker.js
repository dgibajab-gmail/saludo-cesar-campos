/* global AFRAME, THREE */

AFRAME.registerComponent("smooth-marker", {
  init: function () {
    
    
    this.markerContent = document.getElementById("markerContent");
    console.log("INICIANDO ....");
    console.log(this.markerContent);
    this.markerContent.setAttribute("visible", "false");
    
    this.prevPosition = null; // initially there is no position or rotation
    this.prevRotation = null;
  },

  tick: function () {
    if (this.el.object3D.visible && this.markerContent) {
      this.markerContent.setAttribute("visible", "true");

      if (!this.prevPosition && !this.prevRotation) {
        // there are no values to lerp from - set the initial values
        this.markerContent.setAttribute("position", this.el.getAttribute("position"));
        this.markerContent.setAttribute("rotation", this.el.getAttribute("rotation"));
      } else {
        // use the previous values to get an approximation
        this.markerContent.object3D.position.lerp(this.prevPosition, 0.2);

        // this (below) may seem ugly, but the rotation is a euler, not a THREE.Vector3,
        // so to use the lerp function i'm doing some probably unnecessary conversions
        let rot = this.markerContent.object3D.rotation
          .toVector3()
          .lerp(this.prevRotation, 0.2);
        this.markerContent.object3D.rotation.setFromVector3(rot);
      }
      // update the values
      this.prevPosition = this.el.object3D.position;
      this.prevRotation = this.el.object3D.rotation;
    } else {
      // the marker dissapeared - reset the values
      if (this.markerContent) this.markerContent.setAttribute("visible", "false");
      this.prevPosition = null;
      this.prevRotation = null;
    }
  },
});
