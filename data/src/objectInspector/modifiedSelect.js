/*
#-------------------------------------------------------------------------------
# Name:        modifiedSelect.js
# Author:      d.fathi
# Created:     18/07/2021
# Copyright:  (c) PyAMS 2021
# Licence:
#-------------------------------------------------------------------------------
 */
function deleteEllipseMS(self) {
    for (var i = 0; i < self.ellps.length; i++) {
        var element = document.getElementById(self.ellps[i].id);
        element.parentNode.removeChild(element);
    }
    self.ellps = [];
}


function modifiedRect() {
    var rect = mtable.select;
    var px = mtable.px;
    switch (mtable.pos) {
    case 0:
        rect.setAttribute("width", mtable.newElem.value);
        break;
    case 1:
        rect.setAttribute("height", mtable.newElem.value);
        break;
    case 2:
        rect.setAttribute("x", mtable.newElem.value);
        break;
    case 3:
        rect.setAttribute("y", mtable.newElem.value);
        break;
    case 4:
        mtable.select.style.stroke = mtable.newElem.value;
        break;
    case 5:
        mtable.select.style.fill = mtable.newElem.value;
        break;
    }

    deleteEllipseMS(mtable.resize);
	if(mtable.resize.setElement)
    mtable.resize.creatEllipse();
}

function modifiedEllipse() {
    var ellipse = mtable.select;
    var px = mtable.px;
    switch (mtable.pos) {
    case 0:
        ellipse.setAttribute("rx", mtable.newElem.value * px);
        break;
    case 1:
        ellipse.setAttribute("ry", mtable.newElem.value * px);
        break;
    case 2:
        ellipse.setAttribute("cx", mtable.newElem.value * px);
        break;
    case 3:
        ellipse.setAttribute("cy", mtable.newElem.value * px);
        break;
    case 4:
        mtable.select.style.stroke = mtable.newElem.value;
        break;
    case 5:
        mtable.select.style.fill = mtable.newElem.value;
        break;
    }

    deleteEllipseMS(mtable.resize);
	if(mtable.resize.setElement)
    mtable.resize.creatEllipse();
}




//-------The page and model description has been selected------------------------

function pageSelect() {
    mtable.typeSelect = 'page';
    mtable.table = [{
            name: 'Page.width',
            value: mtable.select.width,
            type: "number"
        }, {
            name: 'Page.height',
            value: mtable.select.height,
            type: "number"
        }, {
            name: 'Symbol.name',
            value: drawing.symbol.name,
            type: "text"
        }, {
            name: 'Symbol.reference',
            value: drawing.symbol.reference,
            type: "text"
        }, {
            name: 'Symbol.description',
            value: drawing.symbol.description,
            type: "text"
        }
    ]

if(drawing.pageType!='sym')
 {
	 mtable.table.pop();
	 mtable.table.pop();
	 mtable.table.pop();
 }
}

//-------The page or model description has been modified-----------------------------

function pageModified() {
    var grid = mtable.select;
    switch (mtable.pos) {
    case 0:
        grid.pageSize(mtable.newElem.value, grid.height);
        break;
    case 1:
        grid.pageSize(grid.width, mtable.newElem.value);
        break;
	case 2:
        drawing.symbol.name=mtable.newElem.value;
        break;
	case 3:
        drawing.symbol.reference=mtable.newElem.value;
        break;
	case 4:
        drawing.symbol.description=mtable.newElem.value;
        break;

    }
}

function rectSelect() {
    mtable.typeSelect = 'rect';
    mtable.table = [{
            name: 'Width',
            value: parseInt(mtable.select.getAttribute("width")) / mtable.px,
            type: "number"
        }, {
            name: 'Height',
            value: parseInt(mtable.select.getAttribute("height")) / mtable.px,
            type: "number"
        }, {
            name: 'Pos.x',
            value: parseInt(mtable.select.getAttribute("x")) / mtable.px,
            type: "number"
        }, {
            name: 'Pos.y',
            value: parseInt(mtable.select.getAttribute("y")) / mtable.px,
            type: "number"
        }, {
            name: 'Stroke',
            value: rgb2hex(mtable.select.style.stroke),
            type: "color"
        }, {
            name: 'Fill',
            value: rgb2hex(mtable.select.style.fill),
            type: "color"
        }
    ]
}

function ellipseSelect() {
    mtable.typeSelect = 'ellipse';
    mtable.table = [{
            name: 'Radius x axis',
            value: parseInt(mtable.select.getAttribute("rx")) / mtable.px,
            type: "number"
        }, {
            name: 'Radius y axis',
            value: parseInt(mtable.select.getAttribute("rx")) / mtable.px,
            type: "number"
        }, {
            name: 'Pos.x',
            value: parseInt(mtable.select.getAttribute("cx")) / mtable.px,
            type: "number"
        }, {
            name: 'Pos.y',
            value: parseInt(mtable.select.getAttribute("cy")) / mtable.px,
            type: "number"
        }, {
            name: 'Stroke',
            value: rgb2hex(mtable.select.style.stroke),
            type: "color"
        }, {
            name: 'Fill',
            value: rgb2hex(mtable.select.style.fill),
            type: "color"
        }
    ]
}

function pinSelect() {

    var r = getPinDescription(mtable.select)

        mtable.typeSelect = 'pin';
    mtable.table = [{
            name: 'Size',
            value: parseInt(r.size) / mtable.px,
            type: "number",
			condition:[['min','1'],['max','5']]
        }, {
            name: 'Rotation',
            value: r.rotation,
            array: ['0°', '90°', '180°', '270°'],
            type: "select"
        }, {
            name: 'Pos.x',
            value: parseInt(r.x) / mtable.px,
            type: "number"
        }, {
            name: 'Pos.y',

            value: parseInt(r.y) / mtable.px,
            type: "number"
        }, {
            name: 'Name',
            value: r.text,
            type: "text"
        } ,
		{
			name: 'Name.display',
			array:["none","block"],
			value: mtable.select.childNodes[2].style.display,
			type: "select"
			
		}
    ]
}


function modifiedPin() {
    var pin = mtable.select;
    var px = mtable.px;
    var points = getArrayPoints(mtable.select);
    function sign(a, b) {
        if (a > b)
            return 1;
        else
            return -1;
    }

    switch (mtable.pos) {
    case 0:
        size = mtable.newElem.value * px;
		size=controlPinSize(size);
        if (points[0].y == points[1].y)
            points[1].x = points[0].x + sign(points[1].x, points[0].x) * size;
        else if (points[0].x == points[1].x)
            points[1].y = points[0].y + sign(points[1].y, points[0].y) * size;
        mtable.select.setAttribute("points", polylineToAttribute(points, 0, 0));
        drawingPin(mtable.select);
        break;
		
    case 1:
        size = mtable.table[0].value * px;
        switch (mtable.newElem.value) {
        case '0°':
            points[1].y = points[0].y;
            points[1].x = points[0].x + size;
			mtable.table[1].value='0°';
            break;
        case '90°':
            points[1].x = points[0].x;
            points[1].y = points[0].y + size;
			mtable.table[1].value='90°';
            break;
        case '180°':
            points[1].y = points[0].y;
            points[1].x = points[0].x - size;
			mtable.table[1].value='180°';
            break;
        case '270°':
            points[1].x = points[0].x;
            points[1].y = points[0].y - size;
			mtable.table[1].value='270°';
            break;
        }

        mtable.select.setAttribute("points", polylineToAttribute(points, 0, 0));
        drawingPin(mtable.select);
        break;
		
	case 2:
	    var dx=points[1].x-points[0].x;
		var dy=points[1].y-points[0].y;
        points[0].x =mtable.newElem.value * px;
		points[1].x=points[0].x+dx;
		points[1].y=points[0].y+dy;
        mtable.select.setAttribute("points", polylineToAttribute(points, 0, 0));
        drawingPin(mtable.select);
        break;	
		
	case 3:
		var dx=points[1].x-points[0].x;
		var dy=points[1].y-points[0].y;
        points[0].y =mtable.newElem.value * px;
		points[1].x=points[0].x+dx;
		points[1].y=points[0].y+dy;
        mtable.select.setAttribute("points", polylineToAttribute(points, 0, 0));
        drawingPin(mtable.select);
        break;	
		
	case 4:
	   mtable.select.childNodes[2].textContent=controlText(mtable.newElem.value);
	  break;
	  
	case 5:
	   mtable.select.childNodes[2].style.display=mtable.newElem.value;
	  break;

    }

    deleteEllipseMS(mtable.resize);
	if(mtable.resize.setElement)
    mtable.resize.creatEllipse();
}



function textSelect() {
    mtable.typeSelect = 'text';
    mtable.table = [{
            name: 'Font.size',
            value: parseInt(mtable.select.style.fontSize),
            type: "number"
        }, {
            name: 'Font.family',
            value: mtable.select.style.fontFamily,
            type: "select",
			array:["Times New Roman"]
			
        }, {
            name: 'Pos.x',
            value: parseInt(mtable.select.getAttribute("x")) / mtable.px,
            type: "number"
        }, {
            name: 'Pos.y',
            value: parseInt(mtable.select.getAttribute("y")) / mtable.px,
            type: "number"
        }, {
            name: 'Rotation',
            value: mtable.select.getAttribute("r")+"°",
            array: ['0°', '90°', '180°', '270°'],
            type: "select"
        }, {
            name: 'Fill',
            value: rgb2hex(mtable.select.style.fill),
            type: "color"
        },  {
            name: 'Text',
            value: mtable.select.textContent,
            type: "text"
        }
    ]
}

  function setPosText()
  {
	  var x=mtable.select.getAttribute("x");
	  var y=mtable.select.getAttribute("y");
	  var r=mtable.select.getAttribute("r");
	  mtable.select.setAttribute('transform', 'rotate('+r+' '+x+' '+y+')');
  }
function modifiedText() {
	
	var px = mtable.px;

  switch (mtable.pos) {
    case 0: mtable.select.style.fontSize=mtable.newElem.value; break;
	case 1: mtable.select.style.fontFamily=mtable.newElem.value; break;
	case 2: mtable.select.setAttribute("x", mtable.newElem.value * px); setPosText(); break;
	case 3: mtable.select.setAttribute("y", mtable.newElem.value * px); setPosText(); break;
	case 4: mtable.select.setAttribute("r", mtable.newElem.value.replace('°','')); setPosText(); break;
	case 5: mtable.select.style.fill=mtable.newElem.value; break;
	case 6: mtable.select.textContent=mtable.newElem.value; break;
  }
    deleteEllipseMS(mtable.resize);
	if(mtable.resize.setElement)
    mtable.resize.creatEllipse();
}
//-------The polyline has been selected-------------------------------------
function polylineSelect(){
	mtable.typeSelect = 'polyline';
	mtable.table = [{
            name: 'Stroke',
            value: rgb2hex(mtable.select.style.stroke),
            type: "color"
        }
    ]
}



//-------The polyline has been modified----------------------------------
function polylineModified() {
	
  var px = mtable.px;
  
  switch (mtable.pos) {
    case 0: mtable.select.style.stroke=mtable.newElem.value; break;
  }
    deleteEllipseMS(mtable.resize);
	if(mtable.resize.setElement)
    mtable.resize.creatEllipse();
}

//-------The part has been selected-------------------------------------
function partSelect(){
	mtable.typeSelect = 'part';
	getPartDescription();	
}



//-------The part has been modified----------------------------------
function partModified() {
	
 setPartDescription();
}

//-------The net has been selected-------------------------------------
function netSelect(){
	mtable.typeSelect = 'net';
	mtable.table = [{
            name: 'Stroke',
            value: rgb2hex(mtable.select.style.stroke),
            type: "color"
        },
		{
            name: 'Reference',
            value: mtable.select.getAttribute("ref"),
            type: "text"
        }
    ]
}



//-------The net has been modified----------------------------------
function netModified() {
	
  var px = mtable.px;
  
  switch (mtable.pos) {
    case 0: 
	mtable.select.setAttribute("setcolor",mtable.newElem.value);
    mtable.select.setAttribute("parentcolor",true); 
	getNetRef();
	refSelectedColorNet(mtable.select);
	refNetWithPart();
	break;
	case 1: 
	mtable.select.setAttribute("setref",mtable.newElem.value);
    mtable.select.setAttribute("parent",true); 
    refNetWithPart();	
	break;
  }
 
    deleteEllipseMS(mtable.resize);
	if(mtable.resize.setElement)
    mtable.resize.creatEllipse();
}



//-------The label has been selected-------------------------------------

function labelSelected() {
    mtable.typeSelect = 'label';
    mtable.table = [{
            name: 'Font.size',
            value: parseInt(mtable.select.style.fontSize),
            type: "number"
        }, {
            name: 'Font.family',
            value: mtable.select.style.fontFamily,
            type: "select",
			array:["Times New Roman"]
			
        }, {
            name: 'Pos.x',
            value: parseInt(mtable.select.getAttribute("x")) / mtable.px,
            type: "number"
        }, {
            name: 'Pos.y',
            value: parseInt(mtable.select.getAttribute("y")) / mtable.px,
            type: "number"
        }, {
            name: 'Fill',
            value: rgb2hex(mtable.select.style.fill),
            type: "color"
        },  {
            name: 'Label',
            value: mtable.select.textContent,
            type: "text"
        }
    ]
}

//-------The label has been modified----------------------------------
function labelModified() {
	
	var px = mtable.px;

  switch (mtable.pos) {
    case 0: mtable.select.style.fontSize=mtable.newElem.value; break;
	case 1: mtable.select.style.fontFamily=mtable.newElem.value; break;
	case 2: mtable.select.setAttribute("x", mtable.newElem.value * px); setPosText(); break;
	case 3: mtable.select.setAttribute("y", mtable.newElem.value * px); setPosText(); break;
	case 4: mtable.select.style.fill=mtable.newElem.value; break;
	case 5: mtable.select.textContent=mtable.newElem.value; break;
  }
    deleteEllipseMS(mtable.resize);
	if(mtable.resize.setElement)
    mtable.resize.creatEllipse();
}



//-------The reference has been selected-------------------------------------

function refSelected() {
    mtable.typeSelect = 'ref';
	if( drawing.pageType == 'sym')
	{
	  mtable.select.textContent=drawing.symbol.reference+'?';
	  var ref=drawing.symbol.reference;
	}
	else
	  var ref=mtable.select.textContent;
    mtable.table = [{
            name: 'Font.size',
            value: parseInt(mtable.select.style.fontSize),
            type: "number"
        }, {
            name: 'Font.family',
            value: mtable.select.style.fontFamily,
            type: "select",
			array:["Times New Roman"]
			
        }, {
            name: 'Pos.x',
            value: parseInt(mtable.select.getAttribute("x")) / mtable.px,
            type: "number"
        }, {
            name: 'Pos.y',
            value: parseInt(mtable.select.getAttribute("y")) / mtable.px,
            type: "number"
        }, {
            name: 'Fill',
            value: rgb2hex(mtable.select.style.fill),
            type: "color"
        }
		, {
            name: 'Reference',
            value: ref,
            type: "text"
        }
    ]
}

//-------The attribute of reference element has been modified----------------------------------
function refModified() {
	
	var px = mtable.px;

  switch (mtable.pos) {
    case 0: mtable.select.style.fontSize=mtable.newElem.value; break;
	case 1: mtable.select.style.fontFamily=mtable.newElem.value; break;
	case 2: mtable.select.setAttribute("x", mtable.newElem.value * px); setPosText(); break;
	case 3: mtable.select.setAttribute("y", mtable.newElem.value * px); setPosText(); break;
	case 4: mtable.select.style.fill=mtable.newElem.value; break;
	case 5:	if( drawing.pageType == 'sym')
	{
	  mtable.select.textContent=mtable.newElem.value+'?';
	  drawing.model.reference=mtable.newElem.value;
	} else{
	   mtable.select.textContent=mtable.newElem.value;
	   parElem = mtable.select.parentElement;
	   parElem.setAttribute('sref',mtable.newElem.value);
	}
  }
    deleteEllipseMS(mtable.resize);
	if(mtable.resize.setElement)
    mtable.resize.creatEllipse();
}


//-------The paramater element has been selected-------------------------------------

function paramSelected() {
    mtable.typeSelect = 'param';
	var p=mtable.select.textContent.split("=");
    mtable.table = [{
            name: 'Font.size',
            value: parseInt(mtable.select.style.fontSize),
            type: "number"
        }, {
            name: 'Font.family',
            value: mtable.select.style.fontFamily,
            type: "select",
			array:["Times New Roman"]
			
        }, {
            name: 'Pos.x',
            value: parseInt(mtable.select.getAttribute("x")) / mtable.px,
            type: "number"
        }, {
            name: 'Pos.y',
            value: parseInt(mtable.select.getAttribute("y")) / mtable.px,
            type: "number"
        }, {
            name: 'Fill',
            value: rgb2hex(mtable.select.style.fill),
            type: "color"
        },  {
            name: 'Paramater',
            value: p[0],
            type: "text"
        },  {
            name: 'Value',
            value: p[1],
            type: "text"
        }
    ]
}

//-------The attribute of parameter element has been modified----------------------------------
function paramModified() {
	
	var px = mtable.px;

  switch (mtable.pos) {
    case 0: mtable.select.style.fontSize=mtable.newElem.value; break;
	case 1: mtable.select.style.fontFamily=mtable.newElem.value; break;
	case 2: mtable.select.setAttribute("x", mtable.newElem.value * px); setPosText(); break;
	case 3: mtable.select.setAttribute("y", mtable.newElem.value * px); setPosText(); break;
	case 4: mtable.select.style.fill=mtable.newElem.value; break;
	case 5: mtable.select.textContent=mtable.newElem.value+'='+mtable.table[6].value; break;
	case 6: mtable.select.textContent=mtable.table[5].value+'='+mtable.newElem.value; break;

  }
    deleteEllipseMS(mtable.resize);
	if(mtable.resize.setElement)
    mtable.resize.creatEllipse();
}


//-------The probe  description has been selected------------------------

function probeSelect() {
    mtable.typeSelect = 'probe';
	var str=mtable.select.childNodes[2].textContent.split('=');
    mtable.table = [{
            name: 'Pos',
            value: str[0],
            type: "Button",
			setClick:'ioPosProbe()'
        }, {
            name: 'Color',
            value: rgb2hex(mtable.select.childNodes[1].style.stroke),
            type: "color"
        }
    ]


}

//-------The probe description has been modified-----------------------------

function probeModified() {

    switch (mtable.pos) {
    case 0:
          mtable.select.childNodes[2].textContent= mtable.newElem.value;
        break;
    case 1:
	      mtable.select.childNodes[0].style.stroke= mtable.newElem.value;
          mtable.select.childNodes[1].style.stroke= mtable.newElem.value;
		  mtable.select.childNodes[1].style.fill= mtable.newElem.value;
        break;

    }
	
	 structProbe(mtable.select);
}