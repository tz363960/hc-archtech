var viewerApp;

function tempLaunchViewer(urn) {
	var options = {
		env: 'AutodeskProduction',
		getAccessToken: getForgeToken
	};
	var documentId = 'urn:' + urn;
	Autodesk.Viewing.Initializer(options, function onInitialized() {
		viewerApp = new Autodesk.Viewing.ViewingApplication('MyViewerDiv');
		viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D, {
			extensions: ['CustomPropertyPanelExtension',
				'HeatmapExtension', 'Autodesk.Sample.Navigator', 'FloorExplodeExtension', 'IssuesExtension'
			]
		});
		viewerApp.loadDocument(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
	});
}

function launchViewer(urn) {
	var options = {
		env: 'AutodeskProduction',
		api: 'derivativeV2',
		getAccessToken: getForgeToken
	};
	var documentId = 'urn:' + urn;
	Autodesk.Viewing.Initializer(options, function onInitialized() {
		viewerApp = new Autodesk.Viewing.ViewingApplication('MyViewerDiv');
		var config = {
			extensions: ['IssuesExtension', 'Autodesk.Sample.Navigator', 'CustomPropertyPanelExtension', 'FloorExplodeExtension']
		};
		viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D, config);
		viewerApp.loadDocument(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
	});
}

function onDocumentLoadSuccess(doc) {
	var viewables = viewerApp.bubble.search({
		'type': 'geometry'
	});
	if (viewables.length === 0) {
		console.error('Document contains no viewables.');
		return;
	}
	viewerApp.selectItem(viewables[0].data, onItemLoadSuccess, onItemLoadFail);
}

function onDocumentLoadFailure(viewerErrorCode) {
	console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function onItemLoadSuccess(viewer, item) {
	console.log('onItemLoadSuccess()!');
	console.log(item);
	console.log('Viewers are equal: ' + (viewer === viewerApp.getCurrentViewer()));
	viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, () => {
		const channel = new MessageChannel();
		channel.port1.onmessage = (event) => console.log(event);
		// 模型加载完成，该模型所需资源已作记录，遂向ServiceWorker发送消息，开始缓存所需资源
		viewer.loadExtension('HeatmapExtension');
	})
}

function onItemLoadFail(errorCode) {
	console.error('onItemLoadFail() - errorCode:' + errorCode);
}

function getForgeToken(callback) { //接收后端传来的token
	$.ajax({
		url: '/api/forge/oauth/token',
		success: function (res) {
			callback(res.access_token)
		}
	});
}