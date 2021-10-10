/*
#-------------------------------------------------------------------------------
# Name:        part.js
# Author:      d.fathi
# Created:     08/08/2021
# Copyright:  (c) PyAMS 2021
# Licence:
#-------------------------------------------------------------------------------
 */

function newPart(self, part) {

    self.innerHTML = part;

    var collection = self.children;
    var xmin = 2000;
    var ymin = 2000;
    var xmax = -2000;
    var ymax = -2000;

    for (var i = 0; i <= collection.length - 1; i++) {
        var elem = collection[i];
        switch (elem.getAttribute("name")) {
        case "rect":
            var x = parseInt(elem.getAttribute("x"));
            var y = parseInt(elem.getAttribute("y"));
            var w = parseInt(elem.getAttribute("width"));
            var h = parseInt(elem.getAttribute("height"));
            xmin = Math.min(x, xmin);
            ymin = Math.min(y, ymin);
            xmax = Math.max(x + w, xmax);
            ymax = Math.max(y + h, ymax);
            break
        case "ellipse":
            var x = parseInt(elem.getAttribute("cx")) - parseInt(elem.getAttribute("rx"));
            var y = parseInt(elem.getAttribute("cy")) - parseInt(elem.getAttribute("ry"));
            var w = 2 * parseInt(elem.getAttribute("rx"));
            var h = 2 * parseInt(elem.getAttribute("ry"));
            xmin = Math.min(x, xmin);
            ymin = Math.min(y, ymin);
            xmax = Math.max(x + w, xmax);
            ymax = Math.max(y + h, ymax);
            break
        case "pin":
            var p = getArrayPoints(elem);
            xmin = Math.min(p[0].x, p[1].x, xmin);
            ymin = Math.min(p[0].y, p[1].y, ymin);
            xmax = Math.max(p[0].x, p[1].x, xmax);
            ymax = Math.max(p[0].y, p[1].y, ymax);
            break;
        case "polyline":
            var p = getArrayPoints(elem);
            for (var j = 0; j < p.length; j++) {
                v = p[j];
                xmin = Math.min(v.x, xmin);
                ymin = Math.min(v.y, ymin);
                xmax = Math.max(v.x, xmax);
                ymax = Math.max(v.y, ymax);
            }
            break;
        }
    }
    var xorg = xmin;
    var yorg = ymin;
    xmin = 5 * Math.round((xmin - 5) / 5);
    ymin = 5 * Math.round((ymin - 5) / 5);
    var xorg = 0; //xorg-xmin;
    var yorg = 0; //yorg-ymin;

    xmax = 5 * Math.ceil(xmax / 5);
    ymax = 5 * Math.ceil(ymax / 5);
    for (var i = 0; i <= collection.length - 1; i++) {
        var elem = collection[i];
        switch (elem.getAttribute("name")) {
        case "rect":
            var x = parseInt(elem.getAttribute("x"));
            var y = parseInt(elem.getAttribute("y"));
            elem.setAttribute("x", x - xmin);
            elem.setAttribute("y", y - ymin);
            break;
        case "ellipse":
            var x = parseInt(elem.getAttribute("cx"));
            var y = parseInt(elem.getAttribute("cy"));
            elem.setAttribute("cx", x - xmin);
            elem.setAttribute("cy", y - ymin);
            break;
        case "pin":
            var p = getArrayPoints(elem);
            var xo = p[0].x - xmin;
            var yo = p[0].y - ymin;
            var x = p[1].x - xmin;
            var y = p[1].y - ymin;
            print(xo);
            print(yo);

            elem.setAttribute("points", xo + "," + yo + " " + x + "," + y);
            drawingPin(elem);
            break;
        case "polyline":
            var p = getArrayPoints(elem);
            for (var j = 0; j < p.length; j++) {
                p[j].x = p[j].x - xmin;
                p[j].y = p[j].y - ymin;
            }
            elem.setAttribute("points", polylineToAttribute(p, 0, 0));
            break;

            //case 'text':
        case 'param':
        case 'label':
        case 'ref':
            var x = parseInt(elem.getAttribute("x")) - xmin;
            var y = parseInt(elem.getAttribute("y")) - ymin;
            elem.setAttribute("x", x);
            elem.setAttribute("y", y);
            elem.setAttribute("class", "var");
            var r = elem.getAttribute("r");
            elem.setAttribute("transform", 'rotate(' + r + ' ' + x + ' ' + y + ')');
            break;

        }
    }

    self.setAttribute("width", xmax - xmin);
    self.setAttribute("height", ymax - ymin);
    self.setAttribute("xo", xorg);
    self.setAttribute("yo", yorg);

    console.log('w=' + self.getAttribute("width"));
    console.log('h=' + self.getAttribute("height"));
}

//------------------------------------------------Rotation (RVH)------------------------------//


function itPartSelect()
{
	if (drawing.resize.setElement) 
      if(drawing.resize.setElement.getAttribute("name")== 'part') 
		return true;
	return false;	
}

function rotatePart() {
    if (drawing.resize.setElement) {
        elem = drawing.resize.setElement;
        var name = elem.getAttribute("name");
        if (name == 'part') {
            w = parseInt(elem.getAttribute("width"));
            h = parseInt(elem.getAttribute("height"));
			
			elem.setAttribute("width",h);
            elem.setAttribute("height",w);
			
			information(drawing.resize);

            var collection = elem.children;
            for (var i = 0; i < collection.length; i++) {
                var e = collection[i];
				
                switch (e.getAttribute("name")) {
                case "pin":
                    var p = getArrayPoints(e);
                    var xo = p[0].y;
                    var yo = p[0].x;

                    var x = p[1].y;
                    var y = p[1].x;

                    e.setAttribute("points", xo + "," + yo + " " + x + "," + y);
                    drawingPin(e);
                    break;
                case "polyline":
                    var p = getArrayPoints(e);
                    for (var j = 0; j < p.length; j++) {
                        var temp = p[j].x;
                        p[j].x = p[j].y;
                        p[j].y = temp;
                    }
                    e.setAttribute("points", polylineToAttribute(p, 0, 0));
                    break;

                }

            }
        }
    }

}

function flipHorizontalPart(){
    if (drawing.resize.setElement) {
        elem = drawing.resize.setElement;
        var name = elem.getAttribute("name");
        if (name == 'part') {
            w = parseInt(elem.getAttribute("width"));
            h = parseInt(elem.getAttribute("height"));
			
			
			information(drawing.resize);

            var collection = elem.children;
            for (var i = 0; i < collection.length; i++) {
                var e = collection[i];
				
                switch (e.getAttribute("name")) {
                case "pin":
                    var p = getArrayPoints(e);
                    var xo = Math.abs(p[0].x-w);
                    var yo = p[0].y;

                    var x = Math.abs(p[1].x-w);
                    var y = p[1].y;

                    e.setAttribute("points", xo + "," + yo + " " + x + "," + y);
                    drawingPin(e);
                    break;
                case "polyline":
                    var p = getArrayPoints(e);
                    for (var j = 0; j < p.length; j++) 
                                p[j].x = Math.abs(p[j].x-w);
                    
                    
                    e.setAttribute("points", polylineToAttribute(p, 0, 0));
                    break;

                }

            }
        }
    }

}

function flipVerticallyPart(){
    if (drawing.resize.setElement) {
        elem = drawing.resize.setElement;
        var name = elem.getAttribute("name");
        if (name == 'part') {
            w = parseInt(elem.getAttribute("width"));
            h = parseInt(elem.getAttribute("height"));

			information(drawing.resize);

            var collection = elem.children;
            for (var i = 0; i < collection.length; i++) {
                var e = collection[i];
				
                switch (e.getAttribute("name")) {
                case "pin":
                    var p = getArrayPoints(e);
					var xo = p[0].x;
                    var yo = Math.abs(p[0].y-h);
                    
                    var x = p[1].x;
                    var y = Math.abs(p[1].y-h);
                    

                    e.setAttribute("points", xo + "," + yo + " " + x + "," + y);
                    drawingPin(e);
                    break;
                case "polyline":
                    var p = getArrayPoints(e);
                    for (var j = 0; j < p.length; j++) 
                                p[j].y = Math.abs(p[j].y-h);
                    
                    
                    e.setAttribute("points", polylineToAttribute(p, 0, 0));
                    break;

                }

            }
        }
    }

}


//------------------------------------------------End Rotation (RVH)------------------------------//

function pointInRect(self, offset) {
    var xo = parseInt(self.getAttribute("x"));
    var yo = parseInt(self.getAttribute("y"));
    var x = parseInt(self.getAttribute("width")) + xo;
    var y = parseInt(self.getAttribute("height")) + yo;
    return (xo < offset.x) && (yo < offset.y) && (x > offset.x) && (y > offset.y);
}

function getListPins(part) {
    var pins = [];
    var x = parseInt(part.getAttribute("x"));
    var y = parseInt(part.getAttribute("y"));

    var collection = part.children;
    for (var i = 0; i <= collection.length - 1; i++) {
        var elem = collection[i];
        switch (elem.getAttribute("name")) {
        case "pin":
            var p = getArrayPoints(elem);
            pins.push({
                x: p[0].x + x,
                y: p[0].y + y,
                typeXDir: p[0].x == p[1].x,
                elem: elem
            });
            break;
        }
    }
    return pins;
}

function updateRefParts() {
    var s = document.getElementsByName('ref');
    for (var i = 0; i < s.length; i++) {
        //if(s[i].getAttribute("class")=='var'){
        var parElem = s[i].parentElement;
        if (parElem.getAttribute('sref')) {
            var ref = parElem.getAttribute('sref');
            s[i].textContent = ref;
        }
    }
}

function addName(part) {
    var s = document.getElementsByName('part');
    var x = part.firstChild.getAttribute("reference");
    var n = 1;
    var i = 0;
    var newName = x + n;
    while (i < s.length - 1) {
        var p = s[i].getAttribute('sref');
        if (p == newName) {
            n++;
            newName = x + n;
            i = -1;
        }
        i++;
    }

    part.setAttribute("sref", newName);
    part.setAttribute("directory", drawing.dir);
    part.setAttribute("liblocale", drawing.libLocale);
    part.setAttribute("modelname", drawing.modelname);
    updateRefParts();

}

function getPartDescription() {
    mtable.table = [{
            name: 'Symbol name',
            value: mtable.select.firstChild.getAttribute("symbolname"),
            type: "text",
            condition: [['readonly', 'true']]
        }, {
            name: 'Model name',
            value: mtable.select.getAttribute("modelname"),
            type: "text",
            condition: [['readonly', 'true']]
        }, {
            name: 'Directory',
            value: mtable.select.getAttribute("directory"),
            type: "text",
            condition: [['readonly', 'true']]
        }, {
            name: 'Reference',
            value: mtable.select.getAttribute("sref"),
            type: "text"
        }
    ]
    var elem = mtable.select;
    var collection = mtable.select.children;
    for (var i = 0; i < collection.length - 1; i++)
        if (collection[i].getAttribute("name") == "param") {
            var arr = collection[i].textContent.split("=");
            mtable.table.push({
                name: 'Paramater.' + arr[0],
                value: arr[1],
                type: "text",
                param: arr[0],
                pos: i
            });
        }
}

function setPartDescription() {
    var collection = mtable.select.children;
    switch (mtable.pos) {
    case 3:
        mtable.select.setAttribute("sref", mtable.newElem.value);
        break;
    }

    for (var i = 0; i < collection.length; i++)
        if (collection[i].getAttribute("name") == "ref") {
            collection[i].textContent = mtable.select.getAttribute("sref");
        }

    if (mtable.pos >= 4) {
        var desc = mtable.table[mtable.pos]
            collection[desc.pos].textContent = desc.param + '=' + mtable.newElem.value;
    }

}

//**************************************

function netListPins(part) {

    var pins = getListPins(part);
    var listPinsName = [];

    for (var i = 0; i < pins.length; i++)
        if (pins[i].elem.childNodes[1].style.display == "none") {
            var netId = pins[i].elem.getAttribute('netId');
            var elemNet = document.getElementById(netId);
            listPinsName.push(elemNet.getAttribute("ref"));
        } else
            listPinsName.push('0');
    return listPinsName;
}

function getListParams(part) {
    var lp = [];
    var collection = part.children;
    for (var i = 0; i < collection.length - 1; i++)
        if (collection[i].getAttribute("name") == "param") {
            lp.push(collection[i].textContent);
        }
    return lp;
}

function netList() {
    var parts = document.getElementsByName('part');
    var list = [];
    for (var i = 0; i < parts.length; i++)
        if (!strToBool(parts[i].firstChild.getAttribute('std'))) {
            list.push({
                modelname: parts[i].getAttribute('modelname'),
                ref: parts[i].getAttribute('sref'),
                directory: parts[i].getAttribute('directory'),
                pins: netListPins(parts[i]),
                params: getListParams(parts[i])
            });
        }
    return list;
}
