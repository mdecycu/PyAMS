/*
#-------------------------------------------------------------------------------
# Name:        Object inspector.js
# Author:      d.fathi
# Created:     14/07/2021
# Copyright:  (c) PyAMS 2021
# Licence:
#-------------------------------------------------------------------------------
 */

const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

var mtable = {};
mtable.pos = -1;
mtable.newElem = null;
mtable.self = null;
mtable.table = null;

function Change(index, self) {
    //	var txt = parseInt(document.getElementById("txt").value)
    if (mtable.pos == index)
        return;

    modified();

    if (mtable.table[index].type == 'select') {
        mtable.self = self;
        mtable.newElem = document.createElement("select");
        array = mtable.table[index].array;
		var setIndex=0;
        for (var i = 0; i < array.length; i++) {
            var option = document.createElement("option");
            option.value = array[i];
            option.text = array[i];
            mtable.newElem.appendChild(option);
			if(option.value==self.innerHTML)
				setIndex=i;
			
        }
//console.log('select  :'+self.innerHTML);
        mtable.newElem.setAttribute("value", self.innerHTML);
        mtable.newElem.setAttribute("onchange", "changeSelect()");
        mtable.newElem.setAttribute("class", "myInput");
		 mtable.newElem.selectedIndex=setIndex;
        self.innerHTML = '';
        mtable.pos = index;
        self.appendChild(mtable.newElem);

        return;
    }

    mtable.self = self;
    mtable.newElem = document.createElement("input");
    mtable.newElem.setAttribute("type", mtable.table[index].type);
    mtable.newElem.setAttribute("value", self.innerHTML);
	if(mtable.table[index].type=="Button")
	  mtable.newElem.setAttribute("onclick", mtable.table[index].setClick);	
	else
      mtable.newElem.setAttribute("onchange", "changeSelect()");
    mtable.newElem.setAttribute("class", "myInput");
	if (mtable.table[index].condition) 
	{
		var c=mtable.table[index].condition;
		for(var i=0; i<c.length;i++)
		{
			var d=c[i];
			mtable.newElem.setAttribute(d[0],d[1]);
		}
			
	}
    self.innerHTML = '';
    mtable.pos = index;
    self.appendChild(mtable.newElem);

}

//-------Live modified of attribute of element----------------------------------

function modified() {
	if(mtable.pos==-1) return;
    if (mtable.self) {
        mtable.self.innerHTML = mtable.newElem.value;
        mtable.table[mtable.pos].value = mtable.newElem.value;
    }
}

function changeSelect() {



    switch (mtable.typeSelect) {
    case 'page':
        pageModified();
        break;

    case 'rect':
        modifiedRect();
        break;

    case 'ellipse':
        modifiedEllipse();
        break;

    case 'pin':
        modifiedPin();
        break;

    case 'text':
        modifiedText();
        break;

    case 'label':
        labelModified();
        break;
		
	case 'polyline':
        polylineModified();
        break;
	
	case 'part':
	  partModified();
	  break;
		
	case 'net':
        netModified();
        break;
		
    case 'ref':
        refModified();
        break;
		
    case 'param':
        paramModified();
        break;
		
	case 'probe':
	      probeModified();
        break;
    }
    drawing.saveData('Changed property of ' + mtable.typeSelect);
}

//-------Creat table of description of element--------------------------------------------

function fobjectInspector(id, drawingIntarface) {
    var self = this;
    self.id = id;
    self.drawing = drawingIntarface;
    self.grid = drawingIntarface.grid;
    mtable.grid = self.grid;
    mtable.px = 5;
    mtable.resize = drawingIntarface.resize;
	mtable.pos=-1;
	

    self.creat = function () {
		
        var s = '<table  id="customers"><tr><th>Property </th><th>Value</th></tr>';
        for (var i = 0; i < mtable.table.length; i++)
            s = s + '<tr><td>' + mtable.table[i].name + '</td><td onclick="Change(' + i + ',this);">' + mtable.table[i].value + '</td></tr>';
        s = s + '</table>';
        document.getElementById(self.id).innerHTML = s;
    }

    self.getSelect = function () {
        mtable.pos=-1;
		mtable.typeSelect='';
		mtable.newElem=null;
        if (self.drawing.resize.setElement) {
            mtable.select = self.drawing.resize.setElement;
            switch (mtable.select.getAttribute("name")) {
            case "rect":
                rectSelect();
                self.creat();
                break;

            case "ellipse":
                ellipseSelect();
                self.creat();
                break;

            case "pin":
                pinSelect();
                self.creat();
                break;
				
			case "polyline":
                polylineSelect();
                self.creat();
                break;
				
			case "net":
                netSelect();
                self.creat();
                break;
				
            case "part":
                partSelect();
                self.creat();
                break;

            case "text":
                textSelect();
                self.creat();
                break;

            case "label":
                labelSelected();
                self.creat();
                break;
				
            case "ref":
                refSelected();
                self.creat();
                break;
				
			 case "param":
                paramSelected();
                self.creat();
             break;
			 
			 case "probe":
                probeSelect();
                self.creat();
             break;
			 

            }
        } else {
            mtable.select = self.grid;
            pageSelect();
            self.creat();
        }

    }
    self.getSelect();
    self.creat();
    if (drawingIntarface.resize)
        drawingIntarface.resize.svgElem.addEventListener("mouseup", this.getSelect);

}
