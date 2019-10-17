class PointCloudExtension extends Autodesk.Viewing.Extension {
	load() {
		var changdu = 200;
		var gaodu = 5;
		this.points = this._generatePointCloud(changdu, changdu, gaodu);
		this.points.scale.set(changdu, changdu, gaodu);
		this.viewer.impl.createOverlayScene('pointclouds');
		this.viewer.impl.addOverlay('pointclouds', this.points);	//点云的中心点应是300，300，因为scale是600.
		this.points.position.x = this.points.position.x - changdu / 2 - 174;	//x负数的话是从右到左，因为选择的物体中心点是-170，所以-300-170
		this.points.position.y = this.points.position.y - changdu / 2 + 9;	//y负数的话是从后到前
		this.points.position.z = 76;
		// setInterval(() => {			//匿名函数调用下面的update
		// 	this.update();
		// }, 1000);
		return true;
	}

	unload() {
		return true;
	}

	_generatePointCloudGeometry(width, length, height) {
		let geometry = new THREE.BufferGeometry();
		$.ajax({
			url: "test_post/nn",
			async: false,	//得用同步方法，待ajax结束后return geometry的值
			success: function (data) {
				let numPoints = width * length * height;
				let positions = new Float32Array(numPoints * 3);
				let colors = new Float32Array(numPoints * 3);
				let color = new THREE.Color();
				let l = 0;	//l总数为numPoints * 3
				var HSLData = data;
				HSLData = JSON.parse(HSLData);

				var instanceTree = NOP_VIEWER.impl.model.getData().instanceTree;
				var tmpBox = new Float32Array(6);
				instanceTree.getNodeBox(5493, tmpBox);  //tmpBox为min（x，y，z）和max（x，y，z）,这个5493为dbid
				var thiswidth = parseInt((tmpBox[0] + tmpBox[3]) / 2);	//要选择的物体x方向中点坐标
				var thislong = parseInt((tmpBox[1] + tmpBox[4]) / 2);	//要选择的物体y方向中点坐标
				var thishight = parseInt((tmpBox[2] + tmpBox[5]) / 2);
				console.log('x: ' + thiswidth);
				console.log('y: ' + thislong);
				console.log('z: ' + thishight);

				for (var k = 0; k < height; k++) {
					let ll = 0;		//代表给xy平面上色，总数为xy平面的点的个数
					for (var i = 0; i < width; i++) {
						for (var j = 0; j < length; j++) {
							const u = i / width;
							const v = j / length;
							const w = k / height;
							positions[3 * l] = u;
							positions[3 * l + 1] = v;
							positions[3 * l + 2] = w;
							color.setHSL(HSLData[ll], 1, 0.5);
							colors[3 * l] = color.r;
							colors[3 * l + 1] = color.g;
							colors[3 * l + 2] = color.b;
							l++;
							ll++;
						}
					}
				}
				geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
				geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
				geometry.computeBoundingBox();
				geometry.isPoints = true; 	// This flag will force Forge Viewer to render the geometry as gl.POINTS
			}
		})
		return geometry;
	}


	_generatePointCloud(width, length, height) {
		var PointSize = 1;
		const geometry = this._generatePointCloudGeometry(width, length, height);
		const material = new THREE.PointCloudMaterial({ size: PointSize, vertexColors: THREE.VertexColors });
		return new THREE.PointCloud(geometry, material);
	}

	update() {
		const colors = this.points.geometry.attributes.color.array;
		for (var i = 0; i < colors.length; i++) {
			if (i < colors.length - 1) {
				colors[i] = colors[i + 1];
			}
			else {
				colors[i] = colors[0];
			}

		}
		this.points.geometry.attributes.color.needsUpdate = true;
		this.viewer.impl.invalidate(false, false, true);
	}		//NOP_VIEWER.getExtension('PointCloudExtension').points 这个命令可以取到extention中的变量

}

Autodesk.Viewing.theExtensionManager.registerExtension('PointCloudExtension', PointCloudExtension);