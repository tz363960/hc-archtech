var viewer;
//固定加载的模型，bucket宜采用persistent。注意：此处urn需和token对应。
//urn = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6b3ltcDdmaG5paHhyZ2ZkeG5zc2VqOXA3bzFobGp6NG0teXQvWmVtZW4lMjAtMTAxNy5ud2M="
// @urn the model to show
// @viewablesId which viewables to show, applies to BIM 360 Plans folder
urn="dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZWFpbXV0d3Eydm5sYTN2YWE3emJ3eWRqMmtsemtzaXUtemVtZW4tYmFuay9aZW1lbiUyMC0lMjAlRTYlOTUlQjQlRTUlOTAlODglRTYlQTglQTElRTUlOUUlOEIlMjAwNzI2Lm53Yw"
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