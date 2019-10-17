function FloorExplodeExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
  }
  
  FloorExplodeExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
  FloorExplodeExtension.prototype.constructor = FloorExplodeExtension;

  FloorExplodeExtension.prototype.load = function() {
    this.createPanel();
    return true;
  };

 

  FloorExplodeExtension.prototype.createPanel = function(){

    var _panel = null;
 
    var EXPLODE_VIEW = ['Home','七层','十七层','二十七层','分层总览'];

    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup( 'LevelToolbar' ); 
    // this.subToolbar = this.viewer.getToolbar().container.children[4]
      
    const toolbar = this.viewer.getToolbar(); 
    toolbar.addControl( this.subToolbar );
  
  
    ///////////////////////楼层剖切按钮/////////////////////
    var levelbutton = new Autodesk.Viewing.UI.Button( 'LevelButton' ); 
    this.subToolbar.addControl( levelbutton );
  
    levelbutton.addClass( 'button3' ); 
    levelbutton.icon.classList.add( 'glyphicon' ); 
    levelbutton.setIcon( 'glyphicon-sort' ); 
    levelbutton.icon.style.fontSize = '20px';
    levelbutton.icon.style.position = 'center';
    levelbutton.setToolTip( '楼层拆分' );
   
      var viewer = this.viewer; 
    

      levelbutton.onClick = function (e) {

        NOP_VIEWER.setEnvMapBackground(false);
        NOP_VIEWER.setBackgroundColor(170,208,241,229,225,221);
        

        ////////////点击创建选择面板
        if (_panel == null) {
            _panel = new Autodesk.Viewing.UI.DockingPanel(viewer.container, 'NavigatorPanel', '视角选择');
            _panel.container.style.top = "10px";
            _panel.container.style.left = "10px";
            _panel.container.style.width = "330px";
            _panel.container.style.height = "640px";
            _panel.container.style.resize = "auto";
            _panel.container.style.backgroundColor = 'rgba(30,30,30,0.95)';

            var table = document.createElement('table');
            // table.className = 'adsk-lmv-table';
            _panel.container.appendChild(table);
            var tbody = document.createElement('tbody');
            table.appendChild(tbody); 
            table.style.margin = "15px";
            table.style.color = 'white';
        

           ////////////第一行///////////////
            var tr1 = document.createElement('tr');
            tr1.setAttribute('name','row1');
            tr1.setAttribute('value','row1：状态视角选择');

            /////////row1 col1
            var td11 = document.createElement('td');
            td11.innerHTML = '状态视角选择';
            td11.style.width = '120px';
            tr1.appendChild(td11);

            ////////row1 col2
            var td12 = document.createElement('td');
            var selecttab = document.createElement('select');
            selecttab.setAttribute('id','selecttab');
            selecttab.setAttribute('class','slider')
            selecttab.setAttribute('selectedIndex','2');

            for (i = 0; i < EXPLODE_VIEW.length;i++){
              var option = document.createElement('option');
              option.value = i;
              option.text = EXPLODE_VIEW[i];
              selecttab.appendChild(option);
            };

            td12.style.width = '120px';
            td12.appendChild(selecttab);
            tr1.appendChild(td12);


           

            

            tr1.style.height = '50px';
            tbody.appendChild(tr1);

            //////////////第二行//////////////
            var tr2 = document.createElement('tr');
            tr2.setAttribute('name','row2');
            tr2.setAttribute('value','row2：爆炸程度调节');
            var td21 = document.createElement('td');
            td21.innerHTML = '爆炸程度调节';
            td21.style.width = '120px';

            tr2.appendChild(td21);

            var td22 = document.createElement('td');

            var slider = document.createElement('input');
            slider.setAttribute('type','range')
            slider.setAttribute('title', 'level-slider');
            slider.setAttribute('value','0');
            slider.setAttribute("id", "slider");
            slider.setAttribute("min", "0");
            slider.setAttribute("max", "1");
            slider.setAttribute("step", "0.01");
            slider.setAttribute('class','slider');
            td22.appendChild(slider);   
            td22.style.width = '120px';         
            tr2.appendChild(td22);

            var td23 = document.createElement('td');
            var num = document.createElement('input');
            num.setAttribute('type','number');
            num.setAttribute('id','num1')
            num.setAttribute("min", "0");
            num.setAttribute("max", "1");
            num.setAttribute("step", "0.01");
            num.setAttribute('value','0');
            num.setAttribute('class','numberboader');  
            num.setAttribute("oninput", "slider.value=value; onSlider(value)");
            td23.appendChild(num);
            tr2.appendChild(td23);
            slider.setAttribute('oninput','onSlider(value); num1.value=value');

            tr2.style.height = '50px';

            tbody.appendChild(tr2);

            var div = document.createElement('div');
            div.setAttribute('id','gifdiv');
            div.style.margin = '15px';
            //指定字体颜色
            div.style.color = 'grey';
            _panel.container.appendChild(div);
            
            ////通过createElement来创建面板中的各类元素////

            //创建图片数组
            var images = ["img/银行7.jpg","img/7层综合图纸.jpg","img/17层综合图纸.jpg","img/银行17.jpg","img/7层综合图纸.jpg"];

            // var openvideo = document.createElement('video');//也可使用iframe嵌套，则默认304*154长宽
            // openvideo.setAttribute('title', '视频演示');
            // openvideo.setAttribute('value', '视频演示');
            // openvideo.setAttribute('width','304px');
            // openvideo.setAttribute('autoplay','true');
            // openvideo.setAttribute('controls','true');
            // openvideo.setAttribute('src', 'img/f761ffa8fe5440a941ca0e4bc6f5cfe6.mp4');           
            // div.appendChild(openvideo)

            var opengif0 = document.createElement('img');//也可使用iframe嵌套，则默认304*154长宽
            opengif0.setAttribute('id','opengif0');
            opengif0.setAttribute('title', '效果动图');
            opengif0.setAttribute('value', '图纸展示');
            opengif0.setAttribute('width','304px');
            // opengif0.setAttribute("src", images[selecttab.selectedIndex]);
            opengif0.setAttribute("src", images[3]);
            div.appendChild(opengif0);


            selecttab.onchange = function(e){
              onSlider(1);
              var index=document.getElementById('selecttab').selectedIndex;
              openView(index);

              /////////////若当前展示图纸不为空，则移除当前图纸，再后续换上新图纸进行展示////////
              if (div.childNodes[1] != null){
                div.removeChild(div.childNodes[1]);
              }                

                var opengif = document.createElement('img');//也可使用iframe嵌套，则默认304*154长宽
                opengif.setAttribute('id','opengif');
                opengif.setAttribute('title', '效果动图');
                opengif.setAttribute('value', '效果动图');
                opengif.setAttribute('width','304px');
                opengif.setAttribute("src", images[index]);
                div.appendChild(opengif);     
            };

               //////row1 col3-------reset button////////////////
            /////为了使重置按钮对滑块也有归零重置作用，所以在创建了滑块之后再创建按钮///
            var td13 = document.createElement('td');
            var resetbutton = document.createElement('input');
            resetbutton.setAttribute("type", "button");
            resetbutton.setAttribute("name", "resetbtn");
            resetbutton.setAttribute("value", "重置");
            resetbutton.setAttribute('class','panelbutton');  
            resetbutton.setAttribute("onclick", "javascript:resetView();selecttab.selectedIndex=0;slider.value=0;opengif.setAttribute('src', 'img/17层综合图纸.jpg');num1.value=0;");    
            /////////////////onclick句中，selecttab和slider为构件的“id”属性，并非变量名//////
            td13.appendChild(resetbutton)           
            tr1.appendChild(td13)
        }
  
        // show docking panel
        _panel.setVisible(true);

      }
  }

////////////////////////////分层爆炸函数及相关参数设置/////////////////////////

function floorExplode(viewer, scale, excludedFragIds, model) {

    model = model || viewer.model
    var svf = model.getData();
    var mc = model.getVisibleBounds(true).center();
    var fragList = model.getFragmentList();
    var pt = new THREE.Vector3();

    //Input scale is in the range 0-1, where 0
    //means no displacement, and 1 maximum reasonable displacement.
    scale *= 2;

    var boxes = fragList.fragments.boxes;
    var nbFrags = fragList.getCount();
    for (var fragId = 0; fragId < nbFrags; ++fragId) {

        if (scale == 0) {

            fragList.updateAnimTransform(fragId);

        } else {

            // var box_offset = fragId * 6;
            // var cz = Math.floor(boxes[box_offset + 2] / 10) * 10; //+ boxes[box_offset + 5];
            // // cz = scale * (cz - mc.z);
            // pt.z = cz * scale * 4; //控制楼层cluster分裂距离/高度

            // pt.z = mc.z;


            var box_offset = fragId * 6; //每个boundingbox由6个点定义
            var cz = Math.floor(boxes[box_offset + 2] / 10) * 10;// + boxes[box_offset + 5]; // 2：底，5：顶
            // cz = scale * (cz - mc.z);
            pt.z = cz * scale * 6; //控制楼层cluster分裂距离/高度


            fragList.updateAnimTransform(fragId, null, null, pt);
        }
    }
}


// animate.js
function circ(timeFraction) { return 1 - Math.sin(Math.acos(timeFraction)) }
function makeEaseOut(timing) { return function(timeFraction) {return 1 - timing(1 - timeFraction)}}
function animate({timing, draw, duration}) {
  let start = performance.now();
  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    let progress = timing(timeFraction);
    draw(progress); // draw it
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}

let isOpen = false;


/////////floorExplore//////////////////
function onSlider(val) {
   floorExplode(NOP_VIEWER, val, [0]);
   NOP_VIEWER.impl.sceneUpdated(true);
   if (val != 0){
     isOpen = true;
   }
}

///////////
function openView(level) {
   NOP_VIEWER.restoreState(vstates[level || 4]);
   if (isOpen) return;
   isOpen = true;
   animate({
       timing: makeEaseOut(circ),
       draw(progress) { onSlider(progress) },
       duration: 1000,
   });
}

////////////////////restView//////////////////
function resetView() {
   if (!isOpen) return;
   isOpen = false;
   NOP_VIEWER.restoreState(vstates[0]);
   animate({
       timing: makeEaseOut(circ),
       draw(progress) { onSlider(1 - progress) },
       duration: 1500,
   });
}


// const vstates = [
//    { "seedURN": "home", "objectSet": [{ "id": [], "isolated": [], "hidden": [], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-56.65177484061517, -110.22448381222459, 48.75854608014884], "target": [-56.61241442215515, -110.13854629080645, 48.725902642962545], "up": [0.13593096966393645, 0.2967847160658019, 0.9452203995872939], "worldUpVector": [0, 0, 1], "pivotPoint": [17.422795311668544, 39.67309215526787, 3.7083339691161967], "distanceToOrbit": 172.6794473004014, "aspectRatio": 1.9121887287024901, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748217565049 }, "renderOptions": { "environment": "Photo Booth", "ambientOcclusion": { "enabled": false, "radius": 8, "intensity": 0.2 }, "toneMap": { "method": 1, "exposure": 0, "lightMultiplier": -1 }, "appearance": { "ghostHidden": true, "ambientShadow": false, "antiAliasing": true, "progressiveDisplay": false, "swapBlackAndWhite": false, "displayLines": true, "displayPoints": true } }, "cutplanes": [] },
//    { "seedURN": "level1", "objectSet": [{ "id": [], "isolated": [], "hidden": [2504], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-36.41125987722669, -30.732643696677684, -86.22762903383037], "target": [-36.365517298329515, -30.676039477578286, -86.29621236253467], "up": [0.431068121123091, 0.5334258575508876, 0.7277617257368708], "worldUpVector": [0, 0, 1], "pivotPoint": [19.137502518237405, 34.13362693786621, -167.54953570228284], "distanceToOrbit": 117.89919814238792, "aspectRatio": 1.9121887287024901, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748210294843 } },
//    { "seedURN": "level2", "objectSet": [{ "id": [], "isolated": [], "hidden": [2504, 2592, 2685, 2691, 2698, 2839, 3030, 2838], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-35.46404870563104, -27.529563519257522, -15.30649012863412], "target": [-35.41597137129759, -27.473297920115, -15.373742239357153], "up": [0.4368809056422555, 0.5112880372983192, 0.7400808180197859], "worldUpVector": [0, 0, 1], "pivotPoint": [15.488505365572507, 34.90642802417278, -77.67748231720651], "distanceToOrbit": 101.57194522307726, "aspectRatio": 1.9121887287024901, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748210294843 } },
//    { "seedURN": "level3", "objectSet": [{ "id": [], "isolated": [], "hidden": [2993, 2995, 3001, 3707, 3708, 3709, 3710, 3711, 3778, 3788, 2544, 2545, 2924, 2037, 2533, 2553, 2557, 3057, 3102, 2504, 3105, 2216], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-33.14703887727957, -19.89876367602013, 76.69370110727729], "target": [-33.098961542946114, -19.8424980768776, 76.62644899655426], "up": [0.43688090564222926, 0.5112880372982885, 0.7400808180198225], "worldUpVector": [0, 0, 1], "pivotPoint": [17.422795311668544, 39.67309215526787, 3.7083339691161967], "distanceToOrbit": 106.91478663728728, "aspectRatio": 1.9121887287024901, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748210294843 } },
//    { "seedURN": "exploded", "objectSet": [{ "id": [], "isolated": [], "hidden": [], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-274.98795631207673, -551.2456417563669, 18.376081859041367], "target": [-274.94317121075403, -551.1576115714628, 18.36042697592285], "up": [0.07098511535741645, 0.1395292775008055, 0.9876703367611064], "worldUpVector": [0, 0, 1], "pivotPoint": [17.422795311668544, 39.67309215526787, 3.7083339691161967], "distanceToOrbit": 653.4364492059653, "aspectRatio": 1.9121887287024901, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748217565049 } },
// ];

const vstates = [
  { "seedURN": "home", "objectSet": [{ "id": [], "isolated": [], "hidden": [], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-56.65177484061517, -110.22448381222459, 48.75854608014884], "target": [-56.61241442215515, -110.13854629080645, 48.725902642962545], "up": [0.13593096966393645, 0.2967847160658019, 0.9452203995872939], "worldUpVector": [0, 0, 1], "pivotPoint": [17.422795311668544, 39.67309215526787, 3.7083339691161967], "distanceToOrbit": 172.6794473004014, "aspectRatio": 1.9121887287024901, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748217565049 }, "renderOptions": { "environment": "Photo Booth", "ambientOcclusion": { "enabled": false, "radius": 8, "intensity": 0.2 }, "toneMap": { "method": 1, "exposure": 0, "lightMultiplier": -1 }, "appearance": { "ghostHidden": true, "ambientShadow": false, "antiAliasing": true, "progressiveDisplay": false, "swapBlackAndWhite": false, "displayLines": true, "displayPoints": true } }, "cutplanes": [] },
  { "seedURN": "7F", "objectSet": [{ "id": [], "isolated": [], "hidden": [], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-97.68657350684839, -209.3611430115334, -1235.8788107459136], "target": [-97.66116927007926, -209.28935364849505, -1235.943625915659], "up": [0.21622252030261685, 0.6110192228230853, 0.7615138416697738], "worldUpVector": [0, 0, 1], "pivotPoint": [17.422795311668544, 39.67309215526787, 3.7083339691161967], "distanceToOrbit": -595.4149621887011, "aspectRatio": 1.5665634674922602, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748210294843 } },
  { "seedURN": "17F", "objectSet": [{ "id": [], "isolated": [], "hidden": [], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-87.63192116427922, -175.63881261085385, 309.9891229772649], "target": [-87.60639032587046, -175.5666654865828, 309.92475634872227], "up": [0.2147261929816978, 0.6067907791094742, 0.7653088346774154], "worldUpVector": [0, 0, 1], "pivotPoint": [17.422795311668544, 39.67309215526787, 3.7083339691161967], "distanceToOrbit": 379.30353015910305, "aspectRatio": 1.662749706227967, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748210294843 } },
  { "seedURN": "27F", "objectSet": [{ "id": [], "isolated": [], "hidden": [], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-74.2996062638657, -135.4869255865418, 1820.8524538750896], "target": [-74.2740754254563, -135.4147784622704, 1820.7880872465473], "up": [0.21472619298015244, 0.6067907791051074, 0.7653088346813115], "worldUpVector": [0, 0, 1], "pivotPoint": [17.422795311668544, 39.67309215526787, 3.7083339691161967], "distanceToOrbit": 1319.4186103464303, "aspectRatio": 1.3501762632197414, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748210294843 } },
  { "seedURN": "exploded", "objectSet": [{ "id": [], "isolated": [], "hidden": [], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-274.98795631207673, -551.2456417563669, 18.376081859041367], "target": [-274.94317121075403, -551.1576115714628, 18.36042697592285], "up": [0.07098511535741645, 0.1395292775008055, 0.9876703367611064], "worldUpVector": [0, 0, 1], "pivotPoint": [17.422795311668544, 39.67309215526787, 3.7083339691161967], "distanceToOrbit": 653.4364492059653, "aspectRatio": 1.9121887287024901, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748217565049 } },
];

window.devicePixelRatio = 1.25;

  FloorExplodeExtension.prototype.unload = function() {
    alert('FloorExplodeExtension is now unloaded!');
    return true;
  };
  
  Autodesk.Viewing.theExtensionManager.registerExtension('FloorExplodeExtension', FloorExplodeExtension);


