// *******************************************
// ChangeBackgroundColor Extension
// *******************************************
function ChangeBackgroundColor(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

ChangeBackgroundColor.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
ChangeBackgroundColor.prototype.constructor = ChangeBackgroundColor;

ChangeBackgroundColor.prototype.load = function () {
    this.viewer.setEnvMapBackground(false);
    this.viewer.setBackgroundColor( 2,30, 55, 2,30, 55,); 
    return true;
};


ChangeBackgroundColor.prototype.unload = function () {

    this.viewer.setBackgroundColor( 216, 230, 248, 230, 228, 220 ); 
    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('ChangeBackgroundColor', ChangeBackgroundColor);
