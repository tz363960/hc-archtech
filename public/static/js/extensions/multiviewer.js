class multiviewer extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {

            var options = {
                viewports: [
                    function (id) {
                        return id === 1;
                    },
                    function (id) {
                        return id === 1;
                    },
                    function (id) {
                        return id === 1;
                    },
                    function (id) {
                        return id === 1;
                    }
                ]
            };
            
            this.viewer.loadExtension('Autodesk.SplitScreen', options);

            this.viewer.loadExtension('Autodesk.SplitScreen').then(function (res) {
                //如果想拿到扩展的句柄
                splitExt = res
            })
        console.log('multiviewers has been loaded');
        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('multiviewers has been unloaded');
        return true;
    }

    onToolbarCreated() {

         // Create a new toolbar group if it doesn't exist
         this._group = this.viewer.toolbar.getControl('CustomToolbar');
         if (!this._group) {
             this._group = new Autodesk.Viewing.UI.ControlGroup('CustomToolbar');
             this.viewer.toolbar.addControl(this._group);
         }
 
         // Add a new button to the toolbar group
         this._button = new Autodesk.Viewing.UI.Button('multiviewerButton');
         this._button.onClick = (ev) => {
             // Execute an action here
         };
         this._button.setToolTip('模型聚合');
         this._button.addClass('multiviewerButtonExtensionIcon');
         this._group.addControl(this._button);
     
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('multiviewer', multiviewer);