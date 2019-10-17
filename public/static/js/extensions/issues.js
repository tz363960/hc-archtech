class IssuesExtension extends Autodesk.Viewing.Extension {
    load() {
        this._enabled = false;
        if (this.viewer.toolbar) {
            this._createUI()
        } else {
            const onToolbarCreated = () => {
                this._createUI();
                this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated)
            };
            this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated)
        }
        return true
    }
    unload() {
        this.viewer.toolbar.removeControl(this.toolbar)
    }
    _createUI() {
        const viewer = this.viewer;
        var _this = this;
        this.button = new Autodesk.Viewing.UI.Button('IssuesButton');
        this.button.onClick = () => {
            this._enabled = !this._enabled;
            var dbidBox = this._getChildNode(9010);
            dbidBox = [9026, 9030, 9036, 9253, 9256];
            this._createSphereAll(this._enabled, dbidBox);
            if (this._enabled) {
                $.get('/datas/bimid.json', function(data) {
                    _this._mousePanel(viewer, data);
                }) 
                this.button.setState(0);
            } else {
                this._removePanel();
                this.button.setState(1);
            }
            viewer.impl.invalidate(true, true, true);
        };
        const icon = this.button.container.children[0];
        icon.classList.add('fa', 'fa-flag');
        this.button.setToolTip('动画交底');
        this.toolbar = viewer.toolbar.getControl('CustomToolbar') || new Autodesk.Viewing.UI.ControlGroup('CustomToolbar');
        this.toolbar.addControl(this.button);
        viewer.toolbar.addControl(this.toolbar)
    }
    _createSphereAll(buttonEnable, dbidBox) {
        if (buttonEnable) {
            var geometry = new THREE.SphereGeometry(0.5, 100, 100);
            var material = new THREE.MeshBasicMaterial({
                color: 0x00ff00
            });
            var instanceTree = NOP_VIEWER.impl.model.getData().instanceTree;
            var scenes = NOP_VIEWER.impl.scene;
            var tmpBox = new Float32Array(6);
            for (var i = 0; i < dbidBox.length; i++) {
                var dbid = dbidBox[i];
                var sphere = new THREE.Mesh(geometry, material);
                instanceTree.getNodeBox(dbid, tmpBox);
                var thisx = parseInt((tmpBox[0] + tmpBox[3]) / 2);
                var thisy = parseInt((tmpBox[1] + tmpBox[4]) / 2);
                var thisz = parseInt((tmpBox[2] + tmpBox[5]) / 2);
                scenes.add(sphere);
                sphere.position.x = thisx;
                sphere.position.y = thisy;
                sphere.position.z = thisz
            }
            NOP_VIEWER.fitToView([3517, 9036, 9253, 9256])
        } else if (!buttonEnable) {
            var scenes = NOP_VIEWER.impl.scene;
            var spheres = scenes.children;
            var sphereLength = spheres.length;
            for (var i = 0; i < sphereLength; i++) {
                scenes.remove(spheres[0])
            }
        }
    }
    _createSphereByClick() {
        var selection = NOP_VIEWER.getSelection();
        var messagedbid = selection[0];
        NOP_VIEWER.fitToView([messagedbid]);
        var instanceTree = NOP_VIEWER.impl.model.getData().instanceTree;
        var tmpBox = new Float32Array(6);
        instanceTree.getNodeBox(messagedbid, tmpBox);
        var thisx = parseInt((tmpBox[0] + tmpBox[3]) / 2);
        var thisy = parseInt((tmpBox[1] + tmpBox[4]) / 2);
        var thisz = parseInt((tmpBox[2] + tmpBox[5]) / 2);
        var geometry = new THREE.SphereGeometry(5, 200, 200);
        var material = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        var sphere = new THREE.Mesh(geometry, material);
        NOP_VIEWER.impl.scene.add(sphere);
        sphere.position.x = thisx;
        sphere.position.y = thisy;
        sphere.position.z = thisz
    }
    _removePanel() {
        var allPanel = $('.docking-panel');
        var panelLength = allPanel.length;
        for (var i = 0; i < panelLength; i++) {
            allPanel[i].remove()
        }
    }
    _mousePanel(upviewer, bimids) {
        window.onclick = () => {
            var picName = "/static/images/animation/jd" + (Math.floor(Math.random() * 1) + 1) + ".gif";
            var selection = NOP_VIEWER.getSelection();
            var messagedbid = selection[0];
            var camera = NOP_VIEWER.getCamera();
            var domElement = NOP_VIEWER.impl.canvas;
            var pointerVector = new THREE.Vector3();
            var pointerDir = new THREE.Vector3();
            var rect = domElement.getBoundingClientRect();
            var x = ((window.event.clientX - rect.left) / rect.width) * 2 - 1;
            var y = -((window.event.clientY - rect.top) / rect.height) * 2 + 1;
            if (camera.isPerspective) {
                pointerVector.set(x, y, 0.5);
                pointerVector.unproject(camera);
                var raycaster = new THREE.Raycaster(camera.position, pointerVector.sub(camera.position).normalize())
            } else {
                pointerVector.set(x, y, -1);
                pointerVector.unproject(camera);
                pointerDir.set(0, 0, -1);
                var raycaster = new THREE.Raycaster(pointerVector, pointerDir.transformDirection(camera.matrixWorld))
            }
            var objs = NOP_VIEWER.impl.scene.children;
            var intersects = raycaster.intersectObjects(objs, true);
            var ranBimid = Math.floor(Math.random() * bimids.length);
            if (intersects.length > 0) {
                var panel = new issuePanel(upviewer, upviewer.container, bimids[ranBimid], picName);
                panel.setVisible(true)
            }
        }
    }
    _getChildNode(dbids) {
        var instanceTree = NOP_VIEWER.model.getData().instanceTree;
        var rootChildren = [];
        var bimid = [];
        instanceTree.enumNodeChildren(dbids, function(childid) {
            rootChildren.push(childid)
        }, true);
        for (var i = 0; i < rootChildren.length; i++) {
            var thisDbids = [];
            instanceTree.enumNodeChildren(rootChildren[i], function(childid) {
                thisDbids.push(childid)
            }, true);
            if (thisDbids.length < 2) {
                bimid.push(thisDbids[0])
            }
        }
        return bimid
    }
}
class issuePanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(viewer, container, dbids, pic) {
        super(container, 'issuePanel', '可视化技术交底');
        this.viewer = viewer;
        this.table = document.createElement('table');
        var content = '<div><img src=' + pic + ' width="450px" height="310px"></img></div>';
        content += '<div><p>&nbsp;工程编码：' + dbids.bimid + '</br>&nbsp;' + dbids.represents + '</p></div>';
        this.table.innerHTML = content;
        this.table.className = 'adsk-lmv-tftable';
        this.tbody = document.createElement('tbody');
        this.table.appendChild(this.tbody);
        this.createScrollContainer({
            heightAdjustment: 10
        });
        this.scrollContainer.appendChild(this.table);
        this.container.style.width = '450px';
        this.container.style.top = '10px';
        this.container.style.left = '10px';
        this.container.style.height = '420px'
    }
}
Autodesk.Viewing.theExtensionManager.registerExtension('IssuesExtension', IssuesExtension);