///////////////////////////////////////////////////////////////////////////////

// MeshData viewer extension

// by Yiting Cai, June 2019, inspired by Philippe Leefsma & Xiaodong Liang

//for drawing model component while selected in the instance tree

///////////////////////////////////////////////////////////////////////////////

AutodeskNamespace("Autodesk.ADN.Viewing.Extension");



Autodesk.ADN.Viewing.Extension.MeshData = function (viewer, options) {



  Autodesk.Viewing.Extension.call(this, viewer, options);



  var _self = this;
  var _viewer = viewer;

  var _currentTriangle = null;
  var _currentComponent = null;
  var _mergedMesh = null;


  var _meshMaterial = null;
  var _currentMousePos = null;


  ///////////////////////////////////////////////////////////////////////////

  // load callback

  //

  ///////////////////////////////////////////////////////////////////////////

  _self.load = function () {



    _meshMaterial = createMeshMaterial();


    viewer.addEventListener(

      Autodesk.Viewing.SELECTION_CHANGED_EVENT,

      onSelectionChanged);

    viewer.setNavigationLock(true);


    console.log('Autodesk.ADN.Viewing.Extension.MeshData loaded');






    return true;

  };



  ///////////////////////////////////////////////////////////////////////////

  // unload callback

  //

  ///////////////////////////////////////////////////////////////////////////

  _self.unload = function () {



    viewer.removeEventListener(

      Autodesk.Viewing.SELECTION_CHANGED_EVENT,

      onSelectionChanged);


    _viewer.impl.removeOverlay('DraggingComponent',_currentComponent);
    // _viewer.impl.removeOverlay('DraggingComponent',_mergedMesh);


    viewer.setNavigationLock(false);

    // _viewer.unloadExtension('Viewing.Extension.MeshSelection');
    _viewer.unloadExtension('MeshHighlightToolExtension');


    console.log('Autodesk.ADN.Viewing.Extension.MeshData unloaded');


    return true;

  };



  ///////////////////////////////////////////////////////////////////////////

  // selection changed callback

  //

  ///////////////////////////////////////////////////////////////////////////

  function onSelectionChanged(event) {

    event.fragIdsArray.forEach(function(fragId,distance){



      drawMeshData(fragId,distance);

    });



    setTimeout(function() {

      //crashing :(

      //viewer.hide(event.nodeArray);

    }, 500);



  //  if(_viewer.getExtension('Viewing.Extension.MeshSelection') == null){
  //   _viewer.loadExtension('Viewing.Extension.MeshSelection');

  //  }else{
  //   _viewer.unloadExtension('Viewing.Extension.MeshSelection');
  //   _viewer.loadExtension('Viewing.Extension.MeshSelection');
  //  }

   _viewer.loadExtension('MeshHighlightToolExtension');

  // _viewer.loadExtension('Viewing.Extension.MeshSelection');
  //  _viewer.loadExtension('CustomTool');


   viewer.impl.sceneUpdated(true);


  }



  ///////////////////////////////////////////////////////////////////////////

  // draw vertices and faces

  //

  ///////////////////////////////////////////////////////////////////////////

  function drawMeshData(fragId,distance) {

    if(_currentComponent != null)
    {
      // remove the last component
      _viewer.impl.scene.remove(_currentComponent);
      _currentComponent = null;
    }

    // fragment proxy
    var fragProxy = viewer.impl.getFragmentProxy(

      viewer.model,

      fragId);


    // render proxy
    var renderProxy = viewer.impl.getRenderProxy(

      viewer.model,

      fragId);



    fragProxy.getAnimTransform();


    // transformation from fragment space to WCS
    var matrix = renderProxy.matrixWorld;


    // geometry data of the fragment
    var geometry = renderProxy.geometry;



    //not working

    //geometry.applyMatrix(matrix);


    // information of the fragment
    var attributes = geometry.attributes;

    var vA = new THREE.Vector3();

    var vB = new THREE.Vector3();

    var vC = new THREE.Vector3();

    _currentComponent = new THREE.Group();

    _currentMousePos = new THREE.Vector3();
    _currentMousePos = MousePosWCS();

    var distance = new THREE.Vector3();






    if (attributes.index !== undefined) {


      // index array of the vertices
      var indices = attributes.index.array || geometry.ib;
      // position array of the fragment
      var positions = geometry.vb ? geometry.vb : attributes.position.array;
      // unit range of the  vertices in the position array
      var stride = geometry.vb ? geometry.vbstride : 3;
      // geometry offset if any
      var offsets = geometry.offsets;



      if (!offsets || offsets.length === 0) {



        offsets = [{start: 0, count: indices.length, index: 0}];

      }



      for (var oi = 0, ol = offsets.length; oi < ol; ++oi) {


        var start = offsets[oi].start;

        var count = offsets[oi].count;

        var index = offsets[oi].index;



        for (var i = start, il = start + count; i < il; i += 3) {

      


          var a = index + indices[i];

          var b = index + indices[i + 1];

          var c = index + indices[i + 2];

          ///////// positions of  the vertices
          // Sets this vector's x value to be array[ offset + 0 ], 
          // y value to be array[ offset + 1 ] and z value to be array[ offset + 2 ]. 
          ////////////////////////////////////////////
          vA.fromArray(positions, a * stride);

          vB.fromArray(positions, b * stride);

          vC.fromArray(positions, c * stride);

          //////// transform to WCS in model space
          // Multiplies this vector (with an implicit 1 in the 4th dimension) and m, 
          // and divides by perspective. 
          //////////////////////////////////////////
          vA.applyMatrix4(matrix);

          vB.applyMatrix4(matrix);

          vC.applyMatrix4(matrix);

          if(i == start){

            distance.x = -((vA.x + vB.x + vC.x)/3-_currentMousePos.x)+5;
            distance.y = -((vA.y + vB.y + vC.y)/3-_currentMousePos.y)+5;
            distance.z = -((vA.z + vB.z + vC.z)/3-_currentMousePos.z);

          }

          vA.x += distance.x;vA.y += distance.y;vA.z += distance.z;
          vB.x += distance.x;vB.y += distance.y;vB.z += distance.z;
          vC.x += distance.x;vC.y += distance.y;vC.z += distance.z;


          drawSuface(vA, vB, vC)

        }

      }

    }

    else {



      var positions = geometry.vb ? geometry.vb : attributes.position.array;

      var stride = geometry.vb ? geometry.vbstride : 3;



      for (var i = 0, j = 0, il = positions.length; i < il; i += 3, j += 9) {



        var a = i;

        var b = i + 1;

        var c = i + 2;



        vA.fromArray(positions, a * stride);

        vB.fromArray(positions, b * stride);

        vC.fromArray(positions, c * stride);



        vA.applyMatrix4(matrix);

        vB.applyMatrix4(matrix);

        vC.applyMatrix4(matrix);

        if(i == 0){

          distance.x = -((vA.x + vB.x + vC.x)/3-_currentMousePos.x)+5;
          distance.y = -((vA.y + vB.y + vC.y)/3-_currentMousePos.y)+5;
          distance.z = -((vA.z + vB.z + vC.z)/3-_currentMousePos.z);

        }


        vA.x += distance.x;vA.y += distance.y;vA.z += distance.z;
        vB.x += distance.x;vB.y += distance.y;vB.z += distance.z;
        vC.x += distance.x;vC.y += distance.y;vC.z += distance.z;


        drawSuface(vA, vB, vC)


  
      }



    }

    var mergedGeometry = new THREE.Geometry();

    for(var i=0; i<_currentComponent.length; i++){
      mergedGeometry.merge(_currentComponent.children[i].geometry,_currentComponent.children[i].matrix);
    }

    _mergedMesh = new THREE.Mesh(mergedGeometry, _meshMaterial);

    _viewer.impl.createOverlayScene('DraggingComponent');

    // _viewer.impl.addOverlay('DraggingComponent', _mergedMesh);
    _viewer.impl.addOverlay('DraggingComponent', _currentComponent);


    // _viewer.impl.scene.add(_currentComponent)
    // _viewer.impl.sceneUpdated(true)



    return _currentComponent

  

  //   //////////////////////////试用three dragger//////////////////////////

  //   var mouseDragger = new ThreeDragger(_currentComponent.children, _viewer.impl.camera.perspectiveCamera, _viewer.container.firstElementChild);

  // // mouseDragger.on('dragstart', function (data) {
  // //   controls.enabled = false;
  // // });

  // mouseDragger.on('drag', function (data) {
  //   const {
  //     target,
  //     position
  //   } = data;
  //   target.position.set(position.x, position.y, position.z);
  // });

  // // mouseDragger.on('dragend', function (data) {
  // //   controls.enabled = true;
  // // });

  // mouseDragger.update(_currentComponent);
  // animate();
  // console.log(_currentComponent.children)


  // function animate() {
  //   requestAnimationFrame(animate);
  //   // renderer = new THREE.WebGLRenderer();
  //   // renderer.setSize(window.innerWidth, window.innerHeight);
  //   // document.body.appendChild(renderer.domElement);
  //   // // renderer.render(_viewer.impl.overlayScenes.DraggingComponent, _viewer.impl.camera.perspectiveCamera);

  // }


  //   // // 在object中添加类型为 Mesh 的元素
  //   // var objects = new THREE.Object3D();
  //   //   for (let i = 0; i < _currentComponent.children.length; i++) {
  //   //       // if (_currentComponent.children[i].type == "Mesh") {
  //   //           objects.appendChild(_currentComponent.children[i]);
  //   //       // }
  //   //   }


  //     // console.log(objects)


  //   // // 初始化拖拽控件
  //   // var dragControls = new THREE.DragControls(_viewer.impl.camera.perspectiveCamera,_currentComponent.children,_viewer.container.firstElementChild);
  //   // controls = new THREE.TrackballControls(_viewer.impl.camera, _viewer.container.firstElementChild);
    
  //   // var transformControls = new THREE.TransformControls(_viewer.impl.camera.perspectiveCamera,_viewer.container.firstElementChild,'translate');
  //   // // _viewer.impl.addOverlay('DraggingComponent', transformControls);
  //   // _viewer.impl.scene.add(transformControls);


  // //   console.log(dragControls)
  // //   // console.log(transformControls)

  // //    // 鼠标略过事件
  // //    dragControls.addEventListener('hoveron', function (event) {
  // //     // 让变换控件对象和选中的对象绑定
  // //     transformControls.attach(event._currentComponent);
  // //     console.log(event._currentComponent);
  // // });

  // //     // 开始拖拽
  // //   dragControls.on('dragstart', function (event) {
  // //       controls.enabled = false;
  // //   });
  // //   // 拖拽结束
  // //   dragControls.on('dragend', function (event) {
  // //       controls.enabled = true;
  // //   });

  

  //   // _viewer.impl.scene.add(_currentComponent);
  //   // _viewer.impl.invalidate(true, false, true);



  


 ///////////////////////////////////////////////////////////////////////////

  // draw a surface

  //

  ///////////////////////////////////////////////////////////////////////////

  function drawSuface(vA, vB, vC) {

    var geomface = new THREE.Geometry();

      geomface.vertices.push(
        new THREE.Vector3( vA.x,  vA.y, vA.z ),
        new THREE.Vector3( vB.x,  vB.y, vB.z ),
        new THREE.Vector3(  vC.x,  vC.y, vC.z )
      );

      // face sequence
      var face = new THREE.Face3(0, 1, 2);

      geomface.faces.push(face);
      geomface.computeBoundingSphere();
      geometry.computeFaceNormals();
      


      // create this triangle
      _currentTriangle = new THREE.Mesh(geomface, _meshMaterial);

      // add the triangle to the corresponding component group
      _currentComponent.add(_currentTriangle);
      }
  
    }





    // viewer.loadExtension('Viewing.Extension.MeshSlection');

    ///////////////////////////////////////////////////////////////////////////

  // mesh material

  //

  ///////////////////////////////////////////////////////////////////////////

  function createMeshMaterial() {



    var material = new THREE.MeshLambertMaterial({
      specular: 0x7777FF,

      side: THREE.DoubleSide,

      transparent: false, 
      
      opacity: 0.9,
      emissive:  0x7777FF,

      color: 0x7777FF,

    });

    // material.depthTest = false;


    viewer.impl.matman().addMaterial(

      'adn-material',

      material,

      true);



    return material;

  }






  ///////////////////////////////////////////////////////////////////////////

  //////// 物体跟随鼠标移动 ///////////////

  ///////////////////////////////////////////////////////////////////////////


  ////鼠标屏幕坐标获取
  function getMousePos(ev){
    var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
    var scrollLeft=document.documentElement.scrollLeft||document.body.scrollLeft;

    var x = ev.clientX+scrollLeft;
    var y = ev.clientY+scrollTop;

    return {x,y}

  };

  function convertTo3DCoordinate(clientX,clientY){
    var mv = new THREE.Vector3(
        (clientX / window.innerWidth) * 2 - 1,
        -(clientY / window.innerHeight) * 2 + 1,
        0.5 );
    mv.unproject(_viewer.impl.camera);   //这句将一个向量转成threejs坐标

    return mv;
}

////获得鼠标世界坐标系下的坐标
function MousePosWCS (ev) {
  var oEvent=ev||event;
  var mouse_pos = getMousePos(oEvent); ///已测试可以获取
  var mv = convertTo3DCoordinate(mouse_pos.x,mouse_pos.y);/// 已测试可行
  console.log('mousepos'+mv.x)

  return mv
}


// document.addEventListener('mousedown', onmousedown);
// // document.addEventListener('mousemove', Mousemove);
// document.addEventListener('mouseup', onmouseup);

 

}


Autodesk.ADN.Viewing.Extension.MeshData.prototype =

  Object.create(Autodesk.Viewing.Extension.prototype);



Autodesk.ADN.Viewing.Extension.MeshData.prototype.constructor =

  Autodesk.ADN.Viewing.Extension.MeshData;



Autodesk.Viewing.theExtensionManager.registerExtension(

  'Autodesk.ADN.Viewing.Extension.MeshData',

  Autodesk.ADN.Viewing.Extension.MeshData);

