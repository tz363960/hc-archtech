var roomcolors = [];
var toumingdu = 0.9;
roomcolors.push(new THREE.Vector4(1, 0, 0, toumingdu));
roomcolors.push(new THREE.Vector4(1, 1, 0, toumingdu));
roomcolors.push(new THREE.Vector4(0, 0, 1, toumingdu));
roomcolors.push(new THREE.Vector4(0, 1, 0, toumingdu));

class HeatmapExtension extends Autodesk.Viewing.Extension {
    load() {
        this._enabled = false;

        if (this.viewer.toolbar) {
            this._createUI();
        } else {
            const onToolbarCreated = () => {
                this._createUI();
                this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
            };
            this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
        }
        return true;
    }

    unload() {
        this.viewer.toolbar.removeControl(this.toolbar);
    }

    _createUI() {
        const viewer = this.viewer;
        
        var instanceTree = viewer.model.getData().instanceTree;
        var rootid = instanceTree.getRootId();  
        var room_dbid = [];
        instanceTree.enumNodeChildren(rootid, function (childid) {  
            var childName = instanceTree.getNodeName(childid);
            if (childName == '房间' || childName == 'room') {  
                room_dbid.push(childid);
            }
        }, true);


        this.button = new Autodesk.Viewing.UI.Button('HeatmapButton');
        this.button.onClick = () => {
            this._enabled = !this._enabled;
            if (this._enabled) {
                this._applyColors(room_dbid);
                this.button.setState(0);
            } else {
                this._removeColors();
                this.button.setState(1);
            }
            viewer.impl.invalidate(true, true, true);
        };
        const icon = this.button.container.children[0];
        icon.classList.add('fa', 'fa-fire');    
        this.button.setToolTip('Heatmaps');
        this.toolbar = viewer.toolbar.getControl('CustomToolbar') || new Autodesk.Viewing.UI.ControlGroup('CustomToolbar');
        this.toolbar.addControl(this.button);
        viewer.toolbar.addControl(this.toolbar);
    }

    _applyColors(dbids) {
        const viewer = this.viewer;
        var shiti = []; 
        var fjst = /房间.+/;
        var instanceTree = viewer.model.getData().instanceTree;
        instanceTree.enumNodeChildren(dbids[0], function (childid) {  
            var childName = instanceTree.getNodeName(childid);
            viewer.setThemingColor(childid, roomcolors[(Math.floor(Math.random() * 4))]);
            if (fjst.test(childName)) {  
                shiti.push(childid);
            }
        }, true);
        var panel = new heatRoomPanel(viewer, viewer.container);
        panel.setVisible(true);
    }

    _removeColors() {
        const viewer = this.viewer;
        viewer.clearThemingColors();
        var allPanel = $('.docking-panel');
        var panelLength = allPanel.length;
        for (var i = 0; i < panelLength; i++) {
            allPanel[i].remove();
        }
    }
}

class heatRoomPanel extends Autodesk.Viewing.UI.DockingPanel {
    
    constructor(viewer, container) {    
        super(container, 'heatRoomPanel', '图例');  

        this.viewer = viewer;
        this.table = document.createElement('table');
        var content = '<div align = "center"><img src=/static/images/heatRoomMap.png width="60px" height="400px" style = "center"></img></div>';
        this.table.innerHTML = content;
        this.table.className = 'adsk-lmv-tftable';
        this.tbody = document.createElement('tbody');   
        this.table.appendChild(this.tbody);

        
        
        this.createScrollContainer({ heightAdjustment: 10 });
        this.scrollContainer.appendChild(this.table);
        this.container.style.width = '120px';   
        this.container.style.top = '10px'; 
        this.container.style.left = '10px'; 
        this.container.style.height = '470px';  
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('HeatmapExtension', HeatmapExtension);