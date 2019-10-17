// *******************************************
// Handle Selection Extension
// *******************************************

//indicate that it is an extension of viewer
function HandleSelectionExtension(viewer, options) {
    /////
    this.panel = null; 
    /////
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

//prototype is one of pointer identification, parallel to this, callee and constructor
//every constructor has an attribute named prototype, which is used to declare variables or functions for a certain class
HandleSelectionExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
HandleSelectionExtension.prototype.constructor = HandleSelectionExtension;

//create the UI and bind the UI with Toolbars that has already been created
//Note: 
HandleSelectionExtension.prototype.load = function () {
    if (this.viewer.toolbar) {
        // Toolbar is already available, create the UI
        this.createUI();
    } else {
        // Toolbar hasn't been created yet, wait until we get notification of its creation
        this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
        // Listening to the new UI event
        this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    }
    return true;
};

HandleSelectionExtension.prototype.onToolbarCreated = function () {
    this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
};

HandleSelectionExtension.prototype.createUI = function () {
    var _this = this;

    // prepare to execute the button action
    var handleSelectionToolbarButton = new Autodesk.Viewing.UI.Button('handleSelectionButton');
    handleSelectionToolbarButton.onClick = function (e) {
        ///////////


        //////////
        /// get current selection
        var selection = _this.viewer.getSelection();
        _this.viewer.clearSelection();
        // anything selected?
        if (selection.length > 0) {
            // create an array to store dbIds to isolate
            var dbIdsToChange = [];

            // iterate through the list of selected dbIds
            selection.forEach(function (dbId) {
                // get properties of each dbId
                _this.viewer.getProperties(dbId, function (props) {
                    // output on console, for fun...
                    console.log(props);

                    // ask if want to isolate
                    if (confirm('Confirm ' + props.name + ' (' + props.externalId + ')?')) {
                        dbIdsToChange.push(dbId);

                        // at this point we know which elements to isolate
                        if (dbIdsToChange.length > 0) {
                            // isolate selected (and confirmed) dbIds
                            _this.viewer.isolate(dbIdsToChange);

                            //除了隔离，还要添加弹窗功能
                            if (_this.panel == null) {
                                _this.panel = new ModelSummaryPanel(_this.viewer, _this.viewer.container, 'modelInformationPanel', '施工工艺');
                            }
                            // show/hide docking panel
                            _this.panel.setVisible(!_this.panel.isVisible());

                            // if panel is NOT visible, exit the function
                            if (!_this.panel.isVisible()) return;
                            // ok, it's visible, let's get the summary!
                        }
                    }
                })
            })
        }
        else {
            // if nothing selected, restore
            _this.viewer.isolate(0);
        }

    };
    // handleSelectionToolbarButton CSS class should be defined on your .css file
    // you may include icons, below is a sample class:
    handleSelectionToolbarButton.addClass('handleSelectionToolbarButton');
    handleSelectionToolbarButton.setToolTip('构建隔离');

    // SubToolbar
    this.subToolbar = (this.viewer.toolbar.getControl("MyAppToolbar") ?
        this.viewer.toolbar.getControl("MyAppToolbar") :
        new Autodesk.Viewing.UI.ControlGroup('MyAppToolbar'));
    this.subToolbar.addControl(handleSelectionToolbarButton);

    this.viewer.toolbar.addControl(this.subToolbar);
};

HandleSelectionExtension.prototype.unload = function () {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('HandleSelectionExtension', HandleSelectionExtension);