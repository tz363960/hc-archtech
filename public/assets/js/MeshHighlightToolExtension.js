class MeshHighlightToolExtension extends Autodesk.Viewing.Extension {
  constructor( viewer, options ) {
    super( viewer, options );
    this._tool = undefined;
  }

  load() {
    // 产生自定 Tool 实体
    this._tool = new MeshHighlightTool( this.viewer );
    // 注册自定 Tool 到 viewer.toolController 里
    this.viewer.toolController.registerTool( this._tool );
    // 透过 viewer.toolController 启动自定 Tool
    this.viewer.toolController.activateTool('MeshHighlightTool');
        // this.viewer.impl.disableRollover(true);

    console.log('MeshHighlightTool loaded')

    return true;
  }

  unload() {
    // 如果自定 Tool 有被启动的话，停止这个自定 Tool
    if( this._tool.isActive() ) {
      this.viewer.toolController.deactivateTool('MeshHighlightTool');
    }
    // this.viewer.impl.disableRollover(false);

    // 取消注册自定 Tool 
    this.viewer.toolController.deregisterTool( this._tool );
    console.log('MeshHighlightTool unloaded')
    
    return true;
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension( 'MeshHighlightToolExtension', MeshHighlightToolExtension );

class MeshHighlightTool{
  constructor( viewer ) {
    this._viewer = viewer;
    this._active = false;
    this._names = [ 'MeshHighlightTool' ];
  }

  get viewer() {
    return this._viewer;
  }

  isActive() {
    return this._active;
  }

  getNames() {
    return this._names;
  }

  getName() {
    return this._names[0];
  }

  register() {
  }

  deregister() {
  }

  activate( name ) {
    this._active = true;
  }

  deactivate(name){
    this._active = false;
  }

  update( highResTimestamp ) {
    return false;
  }

///////////////////////////////////////////////////////////////////////////
  // Creates a dummy mesh to attach control to
  //
  ///////////////////////////////////////////////////////////////////////////
  createTransformMesh() {

    var material = new THREE.MeshPhongMaterial(
      { color: 0xff0000 })

    this._viewer.impl.matman().addMaterial(
      'transform-tool-material',
      material,
      true)

    var sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.0001, 5),
      material)

    sphere.position.set(0, 0, 0)

    return sphere
  }

  
  ///////////////////////////////////////////////////////////////////////////
  // normalize screen coordinates
  //
  ///////////////////////////////////////////////////////////////////////////
  normalize(screenPoint) {

    var viewport = this._viewer.navigation.getScreenViewport()

    var n = {
      x: (screenPoint.x - viewport.left) / viewport.width,
      y: (screenPoint.y - viewport.top) / viewport.height
    }

    return n
  }

  ///////////////////////////////////////////////////////////////////////////
  // get 3d hit point on mesh
  //
  ///////////////////////////////////////////////////////////////////////////
  getHitPoint(event) {

    var screenPoint = {
      x: event.clientX,
      y: event.clientY
    }

    var n = this.normalize(screenPoint)

    var hitPoint = this._viewer.utilities.getHitPoint(n.x, n.y)

    return hitPoint
  }




  handleSingleTap( event, button ) {
    return false;
  }

  handleDoubleTap( event, button ) {
    return false;
  }

  // handleKeyDown( event, button ) {
  //   return false;
  // }

  handleKeyUp( event, button ) {
    return false;
  }

  handleWheelInput( event, button ) {
    return false;
  }

  handleButtonDown( event, button ) {
    return false;
  }

  handleButtonUp( event, button ) {
    return false;
  }

  // handleMouseMove( event, button ) {
  //   return false;
  // }

  handleGesture( event, button ) {
    return false;
  }

  handleBlur( event, button ) {
    return false;
  }

  handleResize( event) {
    return false;
  }

  handleKeyUp(event){
    return false;
  }

  handleSingleClick( event,button){
  this.viewer.impl.overlayScenes.DraggingComponent.scene.children[0].visible = false;
  var sel = this.viewer.getSelection();
  // this.viewer.setSelectionColor(new THREE.Color(0xFFFFFF), Autodesk.Viewing.SelectionMode.MIXED);
  this.viewer.show(sel);
  NOP_VIEWER.impl.disableRollover(true);//该行会报错，但会阻止构件的连续选择，故保留

  // console.log('visibleId: '+visibleId)

}


  handleMouseMove(event) {
    const _viewer = this.viewer;
    const intersectObjects = (function () {
      const pointerVector = new THREE.Vector3();
      const pointerDir = new THREE.Vector3();
      const ray = new THREE.Raycaster();
      const camera = _viewer.impl.camera;
  
      return function(pointer, objects, recursive) {
          const rect = _viewer.impl.canvas.getBoundingClientRect();
          const x = (( pointer.clientX - rect.left) / rect.width ) * 2 - 1;
          const y = - (( pointer.clientY - rect.top) / rect.height ) * 2 + 1;
          
          if (camera.isPerspective) {
              pointerVector.set( x, y, 0.5 );
              pointerVector.unproject( camera );
              ray.set( camera.position, pointerVector.sub( camera.position ).normalize() );
          } else {
              pointerVector.set( x, y, -1 );
              pointerVector.unproject( camera );
              pointerDir.set( 0, 0, -1 );
              ray.set( pointerVector, pointerDir.transformDirection( camera.matrixWorld ) );
          }
  
          const intersections = ray.intersectObjects( objects, recursive );
          return intersections[0] ? intersections[0] : null;
      };
    })();
  
    const pointer = event.pointers ? event.pointers[ 0 ] : event;
    // console.log('pointer:  '+pointer.position)
    // console.log('children:  '+ this.viewer.impl.overlayScenes.DraggingComponent.scene.children[0].children)
    // 在自定形体的 Scene 里面找到与鼠标点击的点位有交集的自定形体
    const result = intersectObjects( pointer, this.viewer.impl.overlayScenes.DraggingComponent.scene.children[0].children );
  
    // 计算复制出的构件的坐标中心
    var startposition = new THREE.Vector3(0,0,0);
    var length = this.viewer.impl.overlayScenes.DraggingComponent.scene.children[0].children.length;
    for(var i = 0; i < length; i++){
      var center = new THREE.Vector3();
      center = this.viewer.impl.overlayScenes.DraggingComponent.scene.children[0].children[i].geometry.boundingSphere.center;
      startposition.x += center.x;
      startposition.y += center.y;
      startposition.z += center.z;
    }
      startposition.x = startposition.x/length;
      startposition.y = startposition.y/length;
      startposition.z = startposition.z/length;

    
    if( result && result.object ) {
      const mesh = result.object;
      

      // //改变形体颜色
      // let curColor = mesh.material.color;
      // curColor = ( curColor.getHex() == 0xff0000 ? 0x00ff00 : 0xff0000 );
      // mesh.material.color.setHex( curColor );
      // // console.log('mesh: '+ mesh)
      
      //跟随鼠标移动
          const rect = _viewer.impl.canvas.getBoundingClientRect();
          const x = (( pointer.clientX - rect.left) / rect.width ) * 2 - 1;
          const y = - (( pointer.clientY - rect.top) / rect.height ) * 2 + 1;
          const camera = _viewer.impl.camera;
          const pointerVector = new THREE.Vector3();


          if (camera.isPerspective) {
            pointerVector.set( x, y, 0.5 );
            pointerVector.unproject( camera );
        } else {
            pointerVector.set( x, y, -0.5 );
            pointerVector.unproject( camera );
        }
      

        mesh.parent.position.x = (pointerVector.x - startposition.x);
        mesh.parent.position.y = (pointerVector.y - startposition.y);
        mesh.parent.position.z = (pointerVector.z - startposition.z);

        // mesh.parent.position.x = 0;
        // mesh.parent.position.y = 0;
        // mesh.parent.position.z = 0;

      
      // 刷新画面
      this.viewer.impl.invalidate( true, true, true );
    }
  
    return false;
  }

  

  
}