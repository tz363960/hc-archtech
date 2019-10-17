let viewerApp;
let isOpen = false;

function launchViewer(urn) {
    if (viewerApp != null) {
        var thisviewer = viewerApp.getCurrentViewer();
        if (thisviewer) {
            thisviewer.tearDown()
            thisviewer.finish()
            thisviewer = null
            $("#forgeViewer").empty();
        }
    }

    var options = {
        useADP: false,
        env: 'AutodeskProduction',
        getAccessToken: getForgeToken,     //��ForgeTree�л�ȡToken
        isAEC: true
    };
    //console.log(options);
    var documentId = 'urn:' + urn;
    // Viewer��ʼ��������Token ��Ϣ��ע��Viewer/����Extensions���Լ�viewer�ļ�����ʾ
    Autodesk.Viewing.Initializer(options, function onInitialized() {
        var myDate = new Date();
        var mytime_start=myDate.toLocaleTimeString();
        console.log('模型开始加载时间：' + mytime_start);

        viewerApp = new Autodesk.Viewing.ViewingApplication('forgeViewer');
        var config = {
            extensions: ['HandleSelectionExtension', 'ModelSummaryExtension', 'Autodesk.Sample.Navigator']
        };
        viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D, config);  //ע��Viewer
        viewerApp.loadDocument(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);  // ����Viewer���ĵ���ʾ
    });
}  //launchViewer end

function onDocumentLoadSuccess(doc) {
    // We could still make use of Document.getSubItemsWithProperties()
    // However, when using a ViewingApplication, we have access to the **bubble** attribute,
    // which references the root node of a graph that wraps each object from the Manifest JSON.
    //ʹ��DocumentҲ�ǿ��Եģ�����Ȼ����Viewer����ô�и�����ķ�����bubble bubble
    //ָ�� 'role': '3d'����ʾviewablesֻ�洢��άģ�����ݣ���άͼֽ�洢��_viewables��
    var viewables = viewerApp.bubble.search({ 'type': 'geometry' });
    //viewables.length ==== 1
    if (viewables.length === 0) {
        console.error('Document contains no viewables.');
        return;

    var geometries = doc.getRoot().search({ 'type': 'geometry', 'role': '3d' });
    svf = doc.getViewablePath(geometries[0]);
        NOP_VIEWER.start(svf, { sharedPropertyDbPath: doc.getPropertyDbPath() }, e => {
        NOP_VIEWER.setTheme("light-theme");
        NOP_VIEWER.restoreState(vstates[0]);
        NOP_VIEWER.autocam.shotParams.destinationPercent = 3;
        NOP_VIEWER.autocam.shotParams.duration = 3;
    });
    }
    viewerApp.selectItem(viewables[0].data, onItemLoadSuccess, onItemLoadFail);
}

function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function onItemLoadSuccess(viewerApp) {
    var myDate = new Date();
    var mytime_end=myDate.toLocaleTimeString();
    console.log('模型加载完成时间：' + mytime_end);
}


function onItemLoadFail(errorCode) {
    console.error('onItemLoadFail() - errorCode:' + errorCode);
}

function getForgeToken(callback) {
    jQuery.ajax({
        url: '/api/forge/oauth/token',
        success: function (res) {
            callback(res.access_token, res.expires_in)
        }
    });
}

//����floorExplore����,������
function onSlider(val) {
    floorExplode(NOP_VIEWER, val, [0]);
    NOP_VIEWER.impl.sceneUpdated(true);
}

//��������
function openView(level) {
    NOP_VIEWER.restoreState(vstates[level || 4]);
    if (isOpen) return;
    isOpen = true;
    animate({
        timing: makeEaseOut(circ),
        draw(progress) { onSlider(progress) },
        duration: 800,
    });
}

//����ť������restView�������ȫ����
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


const vstates = [
    { "seedURN": "home", "objectSet": [{ "id": [], "isolated": [], "hidden": [], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-56.65177484061517, -110.22448381222459, 48.75854608014884], "target": [-56.61241442215515, -110.13854629080645, 48.725902642962545], "up": [0.13593096966393645, 0.2967847160658019, 0.9452203995872939], "worldUpVector": [0, 0, 1], "pivotPoint": [17.422795311668544, 39.67309215526787, 3.7083339691161967], "distanceToOrbit": 172.6794473004014, "aspectRatio": 1.9121887287024901, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748217565049 }, "renderOptions": { "environment": "Photo Booth", "ambientOcclusion": { "enabled": false, "radius": 8, "intensity": 0.2 }, "toneMap": { "method": 1, "exposure": 0, "lightMultiplier": -1 }, "appearance": { "ghostHidden": true, "ambientShadow": false, "antiAliasing": true, "progressiveDisplay": false, "swapBlackAndWhite": false, "displayLines": true, "displayPoints": true } }, "cutplanes": [] },
    { "seedURN": "level1", "objectSet": [{ "id": [], "isolated": [], "hidden": [2504], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-36.41125987722669, -30.732643696677684, -86.22762903383037], "target": [-36.365517298329515, -30.676039477578286, -86.29621236253467], "up": [0.431068121123091, 0.5334258575508876, 0.7277617257368708], "worldUpVector": [0, 0, 1], "pivotPoint": [19.137502518237405, 34.13362693786621, -167.54953570228284], "distanceToOrbit": 117.89919814238792, "aspectRatio": 1.9121887287024901, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748210294843 } },
    { "seedURN": "level2", "objectSet": [{ "id": [], "isolated": [], "hidden": [2504, 2592, 2685, 2691, 2698, 2839, 3030, 2838], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-35.46404870563104, -27.529563519257522, -15.30649012863412], "target": [-35.41597137129759, -27.473297920115, -15.373742239357153], "up": [0.4368809056422555, 0.5112880372983192, 0.7400808180197859], "worldUpVector": [0, 0, 1], "pivotPoint": [15.488505365572507, 34.90642802417278, -77.67748231720651], "distanceToOrbit": 101.57194522307726, "aspectRatio": 1.9121887287024901, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748210294843 } },
    { "seedURN": "level3", "objectSet": [{ "id": [], "isolated": [], "hidden": [2993, 2995, 3001, 3707, 3708, 3709, 3710, 3711, 3778, 3788, 2544, 2545, 2924, 2037, 2533, 2553, 2557, 3057, 3102, 2504, 3105, 2216], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-33.14703887727957, -19.89876367602013, 76.69370110727729], "target": [-33.098961542946114, -19.8424980768776, 76.62644899655426], "up": [0.43688090564222926, 0.5112880372982885, 0.7400808180198225], "worldUpVector": [0, 0, 1], "pivotPoint": [17.422795311668544, 39.67309215526787, 3.7083339691161967], "distanceToOrbit": 106.91478663728728, "aspectRatio": 1.9121887287024901, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748210294843 } },
    { "seedURN": "exploded", "objectSet": [{ "id": [], "isolated": [], "hidden": [], "explodeScale": 0, "idType": "lmv" }], "viewport": { "name": "", "eye": [-274.98795631207673, -551.2456417563669, 18.376081859041367], "target": [-274.94317121075403, -551.1576115714628, 18.36042697592285], "up": [0.07098511535741645, 0.1395292775008055, 0.9876703367611064], "worldUpVector": [0, 0, 1], "pivotPoint": [17.422795311668544, 39.67309215526787, 3.7083339691161967], "distanceToOrbit": 653.4364492059653, "aspectRatio": 1.9121887287024901, "projection": "perspective", "isOrthographic": false, "fieldOfView": 37.80748217565049 } },
];

window.devicePixelRatio = 1.25;
