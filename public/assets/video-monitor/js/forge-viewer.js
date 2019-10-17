var viewer;
//固定加载的模型，bucket宜采用persistent。注意：此处urn需和token对应。
urn="dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE5LTA2LTI4LTA5LTU4LTM4LWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL1plbWVuJTIwLSUyMCVFNiU5NSVCNCVFNSU5MCU4OCVFNiVBOCVBMSVFNSU5RSU4QiUyMDA3MjYubndj"
//urn = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2hocWl2czJvaWNhZGdnaHBndnhkYzBoZHpzdXFhM3gtdGVtcG9yYXJ5L1plbWVuJTIwLSUyMCVFNiU5NSVCNCVFNSU5MCU4OCVFNiVBOCVBMSVFNSU5RSU4QiUyMDA3MjYubndj"
// @urn the model to show
// @viewablesId which viewables to show, applies to BIM 360 Plans folder

function launchViewer(urn) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken,
  };

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('bimViewer'), { extensions: ['ChangeBackgroundColor'] });
    viewer.start();
    var documentId = 'urn:' + urn;
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
  });
}

function onDocumentLoadSuccess(doc) {
  var viewables = doc.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(doc, viewables).then(i => {
  });
}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
}

launchViewer(urn)