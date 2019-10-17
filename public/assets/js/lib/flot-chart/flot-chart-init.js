colorList = ["#DC143C",
	"#DA70D6",
	"#9400D3",
	"#1E90FF",
	"#7FFFAA",
	"#00FF00",
	"#F5F5DC",
	"#FFFF00"
];


/*  Pie_Employee
------------*/

$(function () {

	var data = [{
			label: "钢筋工",
			data: 35,
			color: colorList[0]
		},
		{
			label: "电焊工",
			data: 15,
			color: colorList[1]
		},
		{
			label: "混凝土工",
			data: 34,
			color: colorList[2]
		},
		{
			label: "测量工",
			data: 10,
			color: colorList[3]
		},
		{
			label: "机修工",
			data: 3,
			color: colorList[4]
		},
		{
			label: "起重工",
			data: 3,
			color: colorList[5]
		}
	];
	sumEmployee = 0;
	for (var i = 0; i < data.length; i++) {
		sumEmployee = sumEmployee + data[i]["data"];
	};
	document.getElementById('employeeSum').innerHTML = "总人数为" + sumEmployee + "人";

	var plotObj = $.plot($("#flot-pie"), data, {
		series: {
			pie: {
				show: true,
				radius: 1,
				label: {
					show: false,

				}
			}
		},
		grid: {
			hoverable: true
		},
		tooltip: {
			show: true,
			content: "%p.0%, %s, n=%n", // show percentages, rounding to 2 decimal places
			shifts: {
				x: 20,
				y: 0
			},
			defaultTheme: false
		}
	});

});

/*  Pie_Electricity
------------*/

$(function () {

	var data = [{
			label: "混凝土用电",
			data: 1,
			color: colorList[0]
		},
		{
			label: "吊运设备",
			data: 3,
			color: colorList[1]
		},
		{
			label: "金属构件制作",
			data: 9,
			color: colorList[2]
		},
		{
			label: "木工机械",
			data: 20,
			color: colorList[3]
		},
		{
			label: "其他",
			data: 20,
			color: colorList[4]
		}

	];

	sumElectricity = 0;
	for (var i = 0; i < data.length; i++) {
		sumElectricity = sumElectricity + data[i]["data"];
	};
	document.getElementById('electricitySum').innerHTML = "总用电量为" + sumElectricity + "kWh";


	var plotObj = $.plot($("#flot-pie-energy"), data, {
		series: {
			pie: {
				show: true,
				radius: 1,
				label: {
					show: false,
				}
			}
		},
		grid: {
			hoverable: true
		},
		tooltip: {
			show: true,
			content: "%p.0%, %s, n=%n", // show percentages, rounding to 2 decimal places
			shifts: {
				x: 20,
				y: 0
			},
			defaultTheme: false
		}
	});

});

/*  Pie_Water
------------*/

$(function () {

	var data = [{
			label: "施工生产",
			data: 126,
			color: colorList[1]
		},
		{
			label: "施工机械",
			data: 103,
			color: colorList[2]
		},
		{
			label: "现场生活用水",
			data: 29,
			color: colorList[3]
		},
		{
			label: "消防用水",
			data: 20,
			color: colorList[4]
		},
		{
			label: "其他用水",
			data: 20,
			color: colorList[5]
		}
	];

	sumWater = 0;
	for (var i = 0; i < data.length; i++) {
		sumWater = sumWater + data[i]["data"];
	}
	document.getElementById('waterSum').innerHTML = "总用水量为" + sumWater + "吨";

	/*  Pie_Water
------------*/
	var plotObj = $.plot($("#flot-pie-water"), data, {
		series: {
			pie: {
				show: true,
				radius: 1,
				label: {
					show: false,

				}
			}
		},
		grid: {
			hoverable: true
		},
		tooltip: {
			show: true,
			content: "%p.0%, %s, n=%n", // show percentages, rounding to 2 decimal places
			shifts: {
				x: 20,
				y: 0
			},
			defaultTheme: false
		}
	});
});

/*  Bar
-------------*/

var data = [
	[0, 11], //London, UK
	[1, 15], //New York, USA
	[2, 25], //New Delhi, India
	[3, 24], //Taipei, Taiwan
	[4, 13], //Beijing, China
	[5, 18], //Sydney, AU
	[6, 12],

];

var data1 = [
	[0, 2259.13],
	[3, 82471.98],
	[6, 347548.83],
	[9, 1938044.53],
	[12, 4405358.9],
	[15, 8076491.28],
	[18, 440617.97],
	[21, 807799.52],
	[24, 42494.73],
	[27, 2313001.92],
	[30, 1128866.02],
	[33, 1982606.48],
	[36, 1264679.29],
	[39, 423943.52],
	[42, 1698959.8],
	[45, 2446891.8],
	[48, 1513639.8],
	[51, 302231.69],
	[54, 981085.21],
	[57, 8938194.88],
	[60, 1042156.57],
	[63, 3589156.57],
	[66, 236418.64],
	[69, 503248.34],
	[72, 203495.41],
	[75, 265186.95],
	[78, 320547.48]
];
var data2 = [
	[1, 18447.8520420],
	[4, 102187.4825],
	[7, 357054.1369],
	[10, 1954962.846],
	[13, 4426785.454],
	[16, 8098121.721],
	[19, 444372.8627],
	[22, 817991.2647],
	[25, 65361.37934],
	[28, 2337295.233],
	[31, 1146152.358],
	[34, 1984069.6],
	[37, 1270070.523],
	[40, 440746.7204],
	[43, 1730613.092],
	[46, 2469129.772],
	[49, 1516444.447],
	[52, 308877.2043],
	[55, 985581.8967],
	[58, 8951590.328],
	[61, 1048631.725],
	[64, 3603422.594],
	[67, 249711.09],
	[70, 508976.7859],
	[73, 205734.4895],
	[76, 269471.2596],
	[79, 333275.3407]

];

var dataset = [{
		label: "预算金额",
		data: data1,
		color: "#5482FF"
	},
	{
		label: "实际金额",
		data: data2,
		color: "red"
	}
];

var ticks = [
	[1, "施工准备"],
	[4, "土方开挖"],
	[7, "灌注桩施工"],
	[10, "承台施工（筏板基础）"],
	[13,"基础-12层结构施工"],
	[16, "12-33层结构施工"],
	[19, "基础-12层砌体施工"],
	[22, "12-33层砌体施工"],
	[25, "屋面施工"],
	[28, "木工基础-12层装修（模板）"],
	[31, "铝构件基础-12层装修（天棚）"],
	[34, "抹灰基础-12层装修（墙面）"],
	[37, "基础-12层墙面粉刷（地面）"],
	[40, "木工12-33层装修（模板）"],
	[43, "铝构件12-33层装修（天棚）"],
	[46, "抹灰基础-12层装修（墙面）"],
	[49, "基础-12层墙面粉刷（地面）"],
	[52, "木工12-33层装修（模板）"],
	[55, "铝构件12-33层装修（天棚）"],
	[58, "抹灰12-33层装修（墙面）"],
	[61, "12-33层墙面粉刷（地面）"],
	[64, "外部抹灰施工"],
	[67, "外部墙面粉刷"],
	[70, "外部幕墙安装"],
	[73, "卫生及消防系统"],
	[76, "准备交付"],
	[79, "交付"]
];


var options = {
	series: {
		bars: {
			show: true
		}
	},
	bars: {
		align: "left",
		barWidth: 1
	},
	xaxis: {
		axisLabel: "",
		axisLabelUseCanvas: true,
		axisLabelFontSizePixels: 12,
		axisLabelFontFamily: 'Verdana, Arial',
		axisLabelPadding: 10,
		ticks: ticks

	},
	yaxis: {
		axisLabel: "支付金额",
		axisLabelUseCanvas: true,
		axisLabelFontSizePixels: 10,
		axisLabelFontFamily: 'Verdana, Arial',
		axisLabelPadding: 3
	},
	legend: {
		noColumns: 0,
		labelBoxBorderColor: "#000000",
		position: "nw"
	},
	grid: {
		hoverable: true,
		borderWidth: 1,
		backgroundColor: {
			colors: ["#ffffff", "#EDF5FF"]
		}
	}
};

$(document).ready(function () {
	$.plot($("#flot-placeholder"), dataset, options);
	$("#flot-placeholder").UseTooltip();
});




function gd(year, month, day) {
	return new Date(year, month, day).getTime();
}

var previousPoint = null,
	previousLabel = null;

$.fn.UseTooltip = function () {
	$(this).bind("plothover", function (event, pos, item) {
		if (item) {
			if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
				previousPoint = item.dataIndex;
				previousLabel = item.series.label;
				$("#tooltip").remove();

				var x = item.datapoint[0];
				var y = item.datapoint[1];

				var color = item.series.color;

				//console.log(item.series.xaxis.ticks[x].label);                

				showTooltip(item.pageX,
					item.pageY,
					color,
					"<strong>" + item.series.label + "</strong> : <strong>" + y + "</strong> ");
			}
		} else {
			$("#tooltip").remove();
			previousPoint = null;
		}
	});
};

function showTooltip(x, y, color, contents) {
	$('<div id="tooltip">' + contents + '</div>').css({
		position: 'absolute',
		display: 'none',
		top: y - 40,
		left: x - 20,
		border: '2px solid ' + color,
		padding: '3px',
		'font-size': '6px',
		'border-radius': '5px',
		'background-color': '#fff',
		'font-family': 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
		opacity: 0.9
	}).appendTo("body").fadeIn(200);
}

$(function () {
	var d1 = [
		[20, 20],
		[42, 60],
		[54, 20],
		[80, 80]
	];

	//flot options
	var options = {
		legend: {
			show: false
		},
		series: {
			label: "Curved Lines Test",
			curvedLines: {
				active: true,
				nrSplinePoints: 20
			}
		},

		grid: {
			color: "#fff",
			hoverable: true,
			borderWidth: 0,
			backgroundColor: 'transparent'
		},
		tooltip: {
			show: true,
			content: "%s | x: %x; y: %y"
		},
		yaxes: [{
			min: 10,
			max: 90
		}, {
			position: 'right'
		}]
	};
});