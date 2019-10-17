function CustomPropertyPanelExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);

    this.viewer = viewer;   
    this.options = options;
    this.panel = null;
}

CustomPropertyPanelExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);   
CustomPropertyPanelExtension.prototype.constructor = CustomPropertyPanelExtension;  

CustomPropertyPanelExtension.prototype.load = function () {     
    this.panel = new CustomPropertyPanel(this.viewer, this.options);    
    this.viewer.setPropertyPanel(this.panel);   
    return true;
};

CustomPropertyPanelExtension.prototype.unload = function () {
    this.viewer.setPropertyPanel(null);
    this.panel = null;
    return true;
};



function CustomPropertyPanel(viewer, options) {
    this.viewer = viewer; 
    this.options = options; 
    this.nodeId = -1;   
    Autodesk.Viewing.Extensions.ViewerPropertyPanel.call(this, this.viewer);
}
CustomPropertyPanel.prototype = Object.create(Autodesk.Viewing.Extensions.ViewerPropertyPanel.prototype);   
CustomPropertyPanel.prototype.constructor = CustomPropertyPanel;

CustomPropertyPanel.prototype.setProperties = function (properties, options) {  
    
    Autodesk.Viewing.Extensions.ViewerPropertyPanel.prototype.setProperties.call(this, properties, options);
    var _this = this;   
    
    this.addProperty('dbId', this.nodeId, '施工工序');  
    this.viewer.getProperties(this.nodeId, function(props){
        _this.addProperty('externalId', props.externalId, '施工工序');
    })
    this.addProperty('工序步骤', '通过图纸分析,让学员掌握节点大样的图纸理解分析、构件建模计算', '施工工序');
}

CustomPropertyPanel.prototype.setNodeProperties = function (nodeId) {
    Autodesk.Viewing.Extensions.ViewerPropertyPanel.prototype.setNodeProperties.call(this, nodeId);
    this.nodeId = nodeId; 
};


Autodesk.Viewing.theExtensionManager.registerExtension('CustomPropertyPanelExtension', CustomPropertyPanelExtension);