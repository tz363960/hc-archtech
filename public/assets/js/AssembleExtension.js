// Content for 'AssembleExtwnsion.js'

function AssembleExtension( viewer, options ) { 
  Autodesk.Viewing.Extension.call( this, viewer, options ); 
} 

AssembleExtension.prototype = Object.create( Autodesk.Viewing.Extension.prototype ); 
AssembleExtension.prototype.constructor = AssembleExtension;

AssembleExtension.prototype.load = function() {
    if( this.viewer.getToolbar() ) { 
      // Toolbar 已產生時，直接建立我們的 sub toolbar 
      this.createUI(); 
    } else { 
      // 註冊事件等待 Viewer 通知 Toolbar 已產生 
      this.onToolbarCreatedBinded = this.onToolbarCreated.bind( this ); 
      this.viewer.addEventListener( 
        Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded ); 
      }
      return true;

      

  };
    

  //创建toolbar

  AssembleExtension.prototype.onToolbarCreatedBinded = function( ) { 
    this.viewer.removeEventListener( 
      Autodesk.Viewing.TOOLBAR_CREATED_EVENT, 
      this.onToolbarCreatedBinded 
      ); 
    
      this.onToolbarCreatedBinded = null; 
      this.createUI(); 
    }


    AssembleExtension.prototype.createUI = function(){
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup( 'ViewerToolbar' ); 
    
    const toolbar = this.viewer.getToolbar(); 
    toolbar.addControl( this.subToolbar );



    //// 整体模型可见性控制按钮 button1
    var button1 = new Autodesk.Viewing.UI.Button( 'ViewerButton' ); 
    this.subToolbar.addControl( button1 );

    button1.addClass( 'button1' ); 
    // button1.icon.classList.add( 'glyphicon' ); 
    // button1.setIcon( 'glyphicon-eye-close' ); 
    button1.setToolTip( '隐藏/可见' );
    button1.onClick = ( event ) => { 
      const btnState1 = button1.getState(); 
      var viewer = this.viewer; 
      if( btnState1 === Autodesk.Viewing.UI.Button.State.INACTIVE ) { 
        button1.setState( Autodesk.Viewing.UI.Button.State.ACTIVE ); 
        viewer.isolate(-1);  
        // viewer.setSelectionColor(new THREE.Color(0xFF0000), Autodesk.Viewing.SelectionMode.MIXED); // red color
        //不可见时，选中构件红色高亮
        // alert( 'The model is now fully invisible!' );  
      } else if( btnState1 === Autodesk.Viewing.UI.Button.State.ACTIVE ) { 
        button1.setState( Autodesk.Viewing.UI.Button.State.INACTIVE ); 
        viewer.isolate(1);
        // viewer.setSelectionColor(new THREE.Color(0x6699FF), Autodesk.Viewing.SelectionMode.MIXED); // red color
        //模型可见时，选中构件蓝色高亮
      } 
    };


    ////装配式交互控制按钮  button2
    var button2 = new Autodesk.Viewing.UI.Button( 'ViewerButton2' ); 
    this.subToolbar.addControl( button2 );

    button2.addClass( 'button2' ); 
    button2.icon.classList.add( 'glyphicon' ); 
    button2.setIcon( 'glyphicon-th-large' ); 
    button2.icon.style.fontSize = '24px';
    button2.icon.style.position = 'center';
    button2.icon.style.transform = 'rotateZ(90Deg)'

    button2.setToolTip( '模型拼装' );
    button2.onClick = ( event ) => { 
      const btnState2 = button2.getState(); 
      var viewer = this.viewer; 
      if( btnState2 === Autodesk.Viewing.UI.Button.State.INACTIVE ) { 
        button2.setState( Autodesk.Viewing.UI.Button.State.ACTIVE ); 
         //load extension for MeshData
         viewer.loadExtension('Autodesk.ADN.Viewing.Extension.MeshData');
        //  viewer.loadExtension('SelectFaceExtension');
       
      } else if( btnState2 === Autodesk.Viewing.UI.Button.State.ACTIVE ) { 
        button2.setState( Autodesk.Viewing.UI.Button.State.INACTIVE ); 
        viewer.unloadExtension('Autodesk.ADN.Viewing.Extension.MeshData');
        // viewer.unloadExtension('SelectFaceExtension');
    
      } 
    };

  }



  AssembleExtension.prototype.unload = function(){
    this.viewer.toolbar.removeControl( this.subToolbar );
    this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
    return true;
  }

  Autodesk.Viewing.theExtensionManager.registerExtension('AssembleExtension', AssembleExtension);