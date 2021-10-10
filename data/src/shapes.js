/*
#-------------------------------------------------------------------------------
# Name:        shapes.js
# Purpose:     PyAMS.org
# Author:      d.fathi
# Created:     28/05/2021
# Copyright:  (c) PyAMS 2021-2014
# Licence:
#-------------------------------------------------------------------------------
 */
function rectOfSelectAll(p) {
    document.getElementById("select").setAttribute("d", "M " + p.xo + " " + p.yo + " L " + p.xo + " " + p.y + " L " + p.x + " " + p.y + " L " + p.x + " " + p.yo + " L " + p.xo + " " + p.yo);
}

function evtDown(self) {

    switch (self.selectedElement.getAttribute("name")) {
    case "rect":
        self.offset.x -= parseInt(self.selectedElement.getAttribute("x"));
        self.offset.y -= parseInt(self.selectedElement.getAttribute("y"));
        break;

    case 'text':
    case 'param':
    case 'label':
    case 'ref':
        self.offset.x -= parseInt(self.selectedElement.getAttribute("x"));
        self.offset.y -= parseInt(self.selectedElement.getAttribute("y"));
        break;

    case "ellipse":
        self.offset.x -= parseInt(self.selectedElement.getAttribute("cx"));
        self.offset.y -= parseInt(self.selectedElement.getAttribute("cy"));
        break;

    case "part":
        self.offset.x -= parseInt(self.selectedElement.getAttribute("x"));
        self.offset.y -= parseInt(self.selectedElement.getAttribute("y"));
        self.offset.x = self.pr * Math.round(self.offset.x / self.pr);
        self.offset.y = self.pr * Math.round(self.offset.y / self.pr);
        break;
		
   case "probe":
        self.offset.x -= parseInt(self.selectedElement.getAttribute("x"));
        self.offset.y -= parseInt(self.selectedElement.getAttribute("y"));
		
        break;

    case "pin":
        self.offset.x = self.pr * Math.round(self.offset.x / self.pr);
        self.offset.y = self.pr * Math.round(self.offset.y / self.pr);
        break;

    case "net":
        self.px = self.pr;
        getPolyPointsOfNet(self);
        break;
    }
}

function evtMouve(self) {
    var x = (self.coord.x - self.offset.x);
    var y = (self.coord.y - self.offset.y);
    self.px = 1;

    switch (self.selectedElement.getAttribute("name")) {
    case "rect":
        self.selectedElement.setAttribute("x", x);
        self.selectedElement.setAttribute("y", y);
        break;

    case 'text':
    case 'param':
    case 'label':
    case 'ref':
        self.selectedElement.setAttribute("x", x);
        self.selectedElement.setAttribute("y", y);
        var r = self.selectedElement.getAttribute("r");
        self.selectedElement.setAttribute("transform", 'rotate(' + r + ' ' + x + ' ' + y + ')');
        break;

    case "ellipse":
        self.selectedElement.setAttribute("cx", x);
        self.selectedElement.setAttribute("cy", y);
        break;

    case "polyline":
        self.selectedElement.setAttribute("points", polylineToAttribute(self.points, x, y));
        break;

    case "net":
        self.px = self.pr;
        setPolyPointsNetDierction(self);
        self.selectedElement.setAttribute("points", polylineToAttribute(self.points, 0, 0));
        break;

    case "pin": 
	    self.px = self.pr;
        self.selectedElement.setAttribute("points", polylineToAttribute(self.points, x, y));
        drawingPin(self.selectedElement);
        break;

    case "arc":
        self.selectedElement.setAttribute("d", arcToAttribute(self.arcPoints, x, y));
        //self.resizeGetInfo();
        break;

    case "part":
        self.px = self.pr;
        self.selectedElement.setAttribute("x", x);
        self.selectedElement.setAttribute("y", y);
        self.selectedElement.setAttribute('transform', "translate(" + x + "," + y + ")");
        movePartWithConnectNets(self);
		findPosProb();
        break;
		
    case "probe":
        self.selectedElement.setAttribute("x", x);
        self.selectedElement.setAttribute("y", y);
        self.selectedElement.setAttribute('transform', "translate(" + x + "," + y + ")");
		findPosProb();
        break;
    }

    self.resize.setElement = self.selectedElement;
    self.resize.moveObject();
}

function evtUp(self) {}

function fshapes(svg, setDrawing, width, height) {

    this.svg = svg;
    this.resize = 1;
    this.px = 1;
    this.pr = 5;
    this.drawing = setDrawing;
    this.svgElem = document.getElementById("svg");
    this.svgSym = document.getElementById("sym");
    this.coord = {
        x: 0,
        y: 0
    };
    this.design = {
        mouse: false,
        start: false,
        name: 'nonName',
        end: false
    };
    this.lsg = {
        elms: [],
        xo: 0,
        yo: 0,
        x: 0,
        y: 0,
        oldPos: [],
        move: false
    }; //list Select Group of Element
    this.selectAll = {
        used: false,
        xo: 0,
        yo: 0,
        x: 0,
        y: 0
    };

    this.selectedElement;
    this.offset;
    this.coord;
    this.points = [];
    this.part = '';
    this.setNetXDir = true;
    var self = this;

    const style = document.createElement('style');
    style.innerHTML = ".draggable {  cursor: move;  }";
    document.head.appendChild(style);

    this.displayDate = function (evt) {

        var etargSVG = evt.target;

        function getMousePosition(evt) {
            var CTM = etargSVG.getScreenCTM();
            return {
                x: self.px * Math.round(((evt.clientX - CTM.e) / (self.px * CTM.a))),
                y: self.px * Math.round(((evt.clientY - CTM.f) / (self.px * CTM.d)))
            };
        }

        evt.target.addEventListener('mousedown', startDrag);
        evt.target.addEventListener('mousemove', drag);
        evt.target.addEventListener('mouseup', endDrag);
        evt.target.addEventListener('mouseleave', endDrag);

        function startDrag(evt) {

            if (self.design.mouse) {
                designMouseDown(self, getMousePosition(evt));
                return;
            }

            self.selectAll.used = false;
            if (self.resize) {
                if (self.resize.selectEllipse(getMousePosition(evt)))
                    return;
            }
            self.resize.deletEllipse();

            self.offset = getMousePosition(evt);
			if (netAddInThisPos(getMousePosition(evt))) {
                designMouseDown(self, getMousePosition(evt));
                return;
            } else
            if (self.getPosCriticalElement(evt.target)) {
                //	if()
                self.selectedElement = self.setCritElem;
                if (!thisSelectElemItInGroup(self, self.selectedElement)) {
                    if (self.resize) {
                        self.resize.setElement = self.setCritElem;
                        self.resize.creatEllipse();
                    }
                    clearSelectElms(self);
                }

                evtDown(self);

            } else  {
                var p = getMousePosition(evt);
                self.selectAll.used = true;
                self.selectAll.xo = p.x;
                self.selectAll.yo = p.y;
                self.selectAll.x = p.x;
                self.selectAll.y = p.y;
            }

        }

        function drag(evt) {
            if (self.design.mouse) {
                self.svgElem.style.cursor = 'crosshair';
                designMouseMouve(self, getMousePosition(evt));
                return;
            }

            if (self.resize)
                if (self.resize.select)
                    return;

            if (self.selectedElement) {
                self.svgElem.style.cursor = getCursor(self, true);
                evt.preventDefault();
                self.coord = getMousePosition(evt);
                if (moveElemGroup(self))
                    return;
                evtMouve(self);
            } else {
                self.offset = getMousePosition(evt);
                if (self.resize.cursorInEllps(self.offset))
                    getCursorByResize(self.resize);
				else if(netItIsPosOfPin(getMousePosition(evt)))
					self.svgElem.style.cursor = 'crosshair';
                else if (self.getPosCriticalElement(evt.target))
                    self.svgElem.style.cursor = getCursor(self, false);
                else
                    self.svgElem.style.cursor = 'default';

            }

            if (self.selectAll.used) {
                var p = getMousePosition(evt);
                self.selectAll.x = p.x;
                self.selectAll.y = p.y;
                rectOfSelectAll(self.selectAll);
            } else {
                self.selectAll.xo = 0;
                self.selectAll.yo = 0;
                self.selectAll.x = 0;
                self.selectAll.y = 0;
                rectOfSelectAll(self.selectAll);
            }
        }

        function endDrag(evt) {
            self.coord = getMousePosition(evt);
            upElemGroup(self);
            if (self.selectedElement && itMouved(self))
                self.drawing.saveData('Move :' + self.selectedElement.getAttribute("name"));
            self.selectedElement = null;
            if (self.selectAll.used)
                selectElementsInRect(self, self.selectAll);
            self.selectAll.used = false;
            refNetWithPart();

        }

    }

    this.addElement = function (element) {

        function getRandomInt(max) {
            return Math.floor(Math.random() * max) * 10;
        }

        var svg = document.getElementById("sym");

        switch (element) {
        case 'ellipse':
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
            newElement.style.stroke = "#0000ff";
            newElement.style.fill = "#ff7b00";
            newElement.style.strokeWidth = "1px";
            newElement.setAttribute("class", "draggable");
            newElement.setAttribute("name", "ellipse");
            newElement.setAttribute("cx", 50 + getRandomInt(5));
            newElement.setAttribute("cy", 50 + getRandomInt(5));
            newElement.setAttribute("rx", 60);
            newElement.setAttribute("ry", 60);
            svg.appendChild(newElement);
            break;

        case 'arc':
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            newElement.style.stroke = "#0000ff";
            // newElement.style.fill = "none";
            newElement.style.fill = "#ff7b00";
            newElement.style.strokeWidth = "1px";
            newElement.setAttribute("class", "arc");
            newElement.setAttribute("name", "arc");
            newElement.setAttribute("d", f_svg_ellipse_arc([50 + getRandomInt(5), 50 + getRandomInt(5)], [60, 60], [0, 3 * pi / 2]));
            svg.appendChild(newElement);
            break;

        case 'rect':
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            newElement.style.stroke = "#0000ff";
            newElement.style.fill = "#ff7b00";
            newElement.style.strokeWidth = "1px";
            newElement.setAttribute("class", "draggable");
            newElement.setAttribute("x", 50 + getRandomInt(5));
            newElement.setAttribute("y", 50 + getRandomInt(5));
            newElement.setAttribute("name", "rect");
            newElement.setAttribute("width", 120);
            newElement.setAttribute("height", 80);
            svg.appendChild(newElement);
            break;

        case 'text':
        case 'param':
        case 'label':
        case 'ref':
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            //  newElement.style.stroke = "#000000";
            if (element == 'text')
                newElement.style.fill = "#ff7b00";
            else
                newElement.style.fill = "#11a229";
            newElement.style.fontSize = "12";
            newElement.style.fontFamily = "Times New Roman";
            newElement.setAttribute("class", "draggable");
            newElement.setAttribute("name", element);
            newElement.setAttribute("x", 100);
            newElement.setAttribute("y", 100);
            newElement.setAttribute("r", 0);
            newElement.textContent = getTextContentByType(element);
            newElement.setAttribute('transform', 'rotate(0 100 100)');
            svg.appendChild(newElement);
            break;

        case 'net':
        case 'polyline':
            if (element == 'net')
                self.px = self.pr;
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            var xo = 50 + getRandomInt(5);
            var yo = 50 + getRandomInt(5);
            var x = xo + 180;
            var y = yo + 140;
            newElement.setAttribute("points", xo + "," + yo + " " + x + "," + y);
            newElement.style.stroke = "#0000ff";
            if (element == 'net')
                newElement.style.stroke = "#000000";
            newElement.style.fill = "none";
            newElement.style.strokeWidth = "1px";
            newElement.setAttribute("class", "polyline");
            newElement.setAttribute("name", element);
            svg.appendChild(newElement);
            break;

        case 'getPart':
            alert(document.getElementById("sym").innerHTML);
            break;

        case 'part':
            self.px = self.pr;
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            newElement.setAttribute("x", 0);
            newElement.setAttribute("y", 0);
            newElement.setAttribute('transform', "translate(0,0)");
            newElement.setAttribute("width", 145);
            newElement.setAttribute("height", 145);
            newElement.setAttribute("class", "part");
            newElement.setAttribute("name", "part");
            newPart(newElement, self.part);
            svg.appendChild(newElement);
            addName(newElement);

            break;
			
	     case 'probe':
		    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            newElement.setAttribute("x", 0);
            newElement.setAttribute("y", 0);
			newElement.setAttribute("width", 100);
            newElement.setAttribute("height", 100);
            newElement.setAttribute('transform', "translate(0,0)");
            newElement.setAttribute("class", "probe");
			newElement.setAttribute("name", "probe");
			newProbe(newElement);
            svg.appendChild(newElement);
			structProbe(svg.lastChild);
            break;

        case 'pin':
            self.px = self.pr;
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            var xo = 50 + getRandomInt(4);
            var yo = 50 + getRandomInt(4);
            var x = xo;
            var y = yo + 20;
            newElement.setAttribute("points", xo + "," + yo + " " + x + "," + y);
            newElement.setAttribute("class", "polyline");
            newElement.setAttribute("name", "pin");

            var newElement1 = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            newElement1.style.stroke = "#ff0000";
            newElement1.style.strokeWidth = "1px";
            newElement.appendChild(newElement1);

            var newElement2 = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            newElement2.style.stroke = "#00ff00";
            newElement2.style.fill = "none";
            newElement2.style.strokeWidth = "1px";
            newElement2.setAttribute("width", 6);
            newElement2.setAttribute("height", 6);
            newElement2.setAttribute("class", "pin");
            newElement.appendChild(newElement2);

            var els = document.getElementById(self.svg).getElementsByClassName("pin");

            var newElement3 = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            // newElement3.style.stroke ="none";
            //newElement3.style.fill = "#00ff00";
            newElement3.style.fontSize = "12px";
            newElement3.style.fontFamily = "Times New Roman";
            newElement3.style.display = "block";
            newElement3.setAttribute("r", 0);
            newElement3.textContent = 'pin' + (els.length + 1);
            newElement.appendChild(newElement3);

            svg.appendChild(newElement);
            drawingPin(newElement);
            break;

        }

    }

    self.getPosCriticalElement = function (evtTarget) {

        var els = document.getElementById(self.svg).getElementsByClassName("arc");
        self.arcPoints = [];
        for (var i = 0; i < els.length; i++) {
            var p = els[i].getAttribute("d").split(' ');
            self.arcPoints = getArc(p);
            if (pointInArc(self.arcPoints, self.offset)) {
                self.setCritElem = els[i];
                return true;
            }
        }
        //******************************PolyLine**************************************************//
        //var els = document.getElementById(self.svg).getElementsByClassName("polyline");
		//
		
        var els = document.getElementById("sym").children;
        var listElsInPos = [];
        for (var i = 0; i < els.length; i++)
            if ((els[i].getAttribute("class") == 'polyline')) {
                self.points = getArrayPoints(els[i]);

                get = pointInPolyline(self.points, self.offset);
                if (get[0]) {
                    listElsInPos.push({
                        pos: get[1],
                        elem: els[i]
                    });
                    self.setCritElem = els[i];
                    var pos = get[1];
                }
            }

        for (var i = 0; i < listElsInPos.length; i++)
            if (listElsInPos[i].pos < pos) {
                self.setCritElem = listElsInPos[i].elem;
                pos = listElsInPos[i].pos;
            }

        if (listElsInPos.length > 0) {
            self.points = getArrayPoints(self.setCritElem);
            return true;
        }

        //****************************************************end polyline
        if (evtTarget.classList.contains('var')) {
            self.setCritElem = evtTarget;
            return true;
        }

        var els = document.getElementById(self.svg).getElementsByClassName("part");
        for (var i = 0; i < els.length; i++)
            if (pointInRect(els[i], self.offset)) {
                self.setCritElem = els[i];
                return true;
            }
			
		var els = document.getElementById(self.svg).getElementsByClassName("probe");
        for (var i = 0; i < els.length; i++)
            if (pointInRect(els[i], self.offset)) {
                self.setCritElem = els[i];
                return true;
            }

        if (evtTarget.classList.contains('draggable')) {
            self.setCritElem = evtTarget;
            return true;
        }

        return false;
    };

    self.selectPolylines = function () {}

    document.getElementById(self.svg).addEventListener("load", this.displayDate);
}
