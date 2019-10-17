AutodeskNamespace('Autodesk.Sample.Navigator');

Autodesk.Sample.Navigator = function (viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    //this 为type of Autodesk.Sample
    //为何使用var _self = this;？如果省略这行，那么在嵌套函数作用域内就无法访问到本函数作用域的成员了。
    var _self = this;

    ///////////////////////////////////////////////////////////////////////////
    // load callback
    ///////////////////////////////////////////////////////////////////////////
    _self.load = function () {
        var _panel = null;
        var _panelGuid = newGUID();
        var viewables;
        //获取二维模型信息
        viewables = viewerApp.bubble.search({ 'type': 'geometry', 'role': '2d' });

        createUI = function () {
            // Button 1，使用Viewing自带UI创建
            var button1 = new Autodesk.Viewing.UI.Button('toolbarNavigator');
            //点击按钮，弹出panel
            button1.onClick = function (e) {
                if (_panel == null) {
                    _panel = new Autodesk.Viewing.UI.DockingPanel(viewer.container, 'NavigatorPanel', '二维图纸导航');
                    _panel.container.style.top = "10px";
                    _panel.container.style.left = "10px";
                    _panel.container.style.width = "auto";
                    _panel.container.style.height = "300px";
                    _panel.container.style.resize = "auto";
                    

                    var div = document.createElement('div');
                    div.style.margin = '5px';
                    //指定字体颜色
                    div.style.color = 'grey';
                    div.id = _panelGuid;
                    _panel.container.appendChild(div);


                    var selectViewable = document.createElement('select');
                    selectViewable.id = 'viewables2dList';

                    viewables.forEach(function (view2d, index) {
                        var option = document.createElement("option");
                        option.value = index;
                        option.text = view2d.data.name;
                        selectViewable.appendChild(option);
                    });
                    div.appendChild(selectViewable);
                    $('#viewables2dList').change(function () {
                        viewerApp.selectItem(viewables[this.value], onItemLoadSuccess, onItemLoadFail);
                    });
                }

                // show docking panel
                _panel.setVisible(true);

                viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function (selected) {
                    var ul = $('#' + _panelGuid + 'ul');
                    if (ul) ul.remove();
                    if (selected.dbIdArray.length == 0) return;

                    ul = document.createElement('ul');
                    ul.id = _panelGuid + 'ul'
                    ul.className = 'list-group';
                    div.appendChild(ul);
                    viewer.model.getProperties(selected.dbIdArray[0], function (props) {
                        var liTop = document.createElement('li');
                        liTop.className = 'list-group-item';
                        liTop.innerText = 'Also viewable on the following sheets:';
                        ul.append(liTop);

                        props.properties.forEach(function (prop) {
                            if (prop.displayCategory === '__viewable_in__')
                                viewables.forEach(function (view2d) {
                                    var li = document.createElement('li');
                                    if (view2d.data.guid === prop.displayValue) {
                                        li.className = 'list-group-item PCitem';
                                        li.id = view2d.data.guid;
                                        li.onclick = onSelectView;
                                        li.innerText = view2d.data.name;
                                        ul.append(li);
                                    }
                                });
                        })
                    });
                });
            };
            button1.addClass('toolbarNavigatorButton');
            button1.setToolTip('二维图纸');

            // SubToolbar
            this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('myAppGroup1');
            this.subToolbar.addControl(button1);

            viewer.toolbar.addControl(this.subToolbar);
        };

        createUI();

        console.log('MyExtension loaded');

        var elementToSelect;

        onSelectView = function (e) {
            var id = e.srcElement.id;
            viewables.forEach(function (view2d, index) {
                if (view2d.data.guid === id) {
                    var selectedIds = viewer.getSelection();
                    viewerApp.selectItem(view2d.data, function () {
                        elementToSelect = selectedIds;
                    }, onItemLoadFail);
                }
            });
        };

        viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function () {
            if (elementToSelect) {
                viewer.select(elementToSelect);
                //viewer.fitToView(elementToSelect);
            }
            elementToSelect = null;
            createUI();
        });
        return true;
    };


    ///////////////////////////////////////////////////////////////////////////
    // unload callback
    ///////////////////////////////////////////////////////////////////////////
    _self.unload = function () {
        // ToDo: prepare to unload the extension
        console.log('MyExtension unloaded');
        return true;
    };
};

Autodesk.Sample.Navigator.prototype = Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.Sample.Navigator.prototype.constructor = Autodesk.Sample.Navigator;
//viewer注册
Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Sample.Navigator', Autodesk.Sample.Navigator);

//创建新GUID
function newGUID() {
    var d = new Date().getTime();
    var guid = 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });

    return guid;
};