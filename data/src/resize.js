/*
#-------------------------------------------------------------------------------
# Name:        resize.js
# Author:      d.fathi
# Created:     05/06/2021
# Copyright:  (c) PyAMS 2021
# Licence:
#-------------------------------------------------------------------------------
*/

function getType(self) {
	
	//console.log(self.setElement.tagName);
	
    switch (self.setElement.getAttribute("name")) {
    case "rect":
    case "ellipse":
        self.type = 1;
        self.length = 4;
        break;
    case "arc":
        self.type = 1;
        self.length = 6;
        break;
	case "pin":	
	case "text":
	case 'param':
	case 'label':
	case 'ref':

	   self.type=3;
	   self.length = 0;
        break;
		case "part":
		case "probe":
	   self.type=4;
	   self.length = 0;
        break;
	   
		
    case "polyline":
	case "net":
        self.type = 2;
	    self.points = [];
		var p = self.setElement.getAttribute("points").split(' ');
            for (var j = 0; j < p.length; j++) {
                var n = p[j].split(',');
				if(n.length==2)
                self.points.push({
                    x: parseInt(n[0]),
                    y: parseInt(n[1])
                });
			}
		getTypeDirOfNet(self);
		deletePointInSameDirection(self);
		self.length =self.points.length+1;
		
        break;
    }
	

}

function setInitPos(self) {
	
    switch (self.setElement.getAttribute("name")) {
    case "rect":
        self.width = parseInt(self.setElement.getAttribute("width"));
        self.height = parseInt(self.setElement.getAttribute("height"));
        self.ellps[0].x = parseInt(self.setElement.getAttribute("x"));
        self.ellps[0].y = parseInt(self.setElement.getAttribute("y"));
        break;
    case "ellipse":
        self.ellps[0].x = -parseInt(self.setElement.getAttribute("rx")) + parseInt(self.setElement.getAttribute("cx"));
        self.ellps[0].y = -parseInt(self.setElement.getAttribute("ry")) + parseInt(self.setElement.getAttribute("cy"));
        self.width = 2 * parseInt(self.setElement.getAttribute("rx"));
        self.height = 2 * parseInt(self.setElement.getAttribute("ry"));
        break;
	case "arc":
	    var p = self.setElement.getAttribute("d").split(' ');
		self.arcPoints=getArc(p);
		self.ellps[0].x = -self.arcPoints.rx+ self.arcPoints.cx;
        self.ellps[0].y = -self.arcPoints.ry+self.arcPoints.cy;
        self.width  = 2 *self.arcPoints.rx;
        self.height = 2 *self.arcPoints.ry;
		
		self.ellps[4].x = self.arcPoints.cx+self.arcPoints.rx*Math.cos(self.arcPoints.startAngle);
        self.ellps[4].y = self.arcPoints.cy+self.arcPoints.ry*Math.sin(self.arcPoints.startAngle);
		
		self.ellps[5].x = self.arcPoints.cx+self.arcPoints.rx*Math.cos(self.arcPoints.endAngle);
        self.ellps[5].y = self.arcPoints.cy+self.arcPoints.ry*Math.sin(self.arcPoints.endAngle);
	    self.arcPoints.x= self.ellps[0].x;
        self.arcPoints.y= self.ellps[0].y;
	    break;
	case "polyline":
	case "net":
		self.points = [];
		var p = self.setElement.getAttribute("points").split(' ');
            for (var j = 0; j < p.length; j++) {
                var n = p[j].split(',');
				if(n.length==2)
                self.points.push({
                    x: parseInt(n[0]),
                    y: parseInt(n[1])
                });
			}
			
	   getTypeDirOfNet(self);
       for (var i=0; i<self.length-1; i++){
	     self.ellps[i].x=self.points[i].x;
	     self.ellps[i].y=self.points[i].y;
	   }
	   
	   self.ellps[self.length-1].x=-100;
	   self.ellps[self.length-1].y=-100;
	  
	   
	   break;
    }
	
  
}

function setPosSize(self) {
    var el = self.setElement;  //tagName
    switch (el.getAttribute("name")) {
    case "rect":
        el.setAttribute("width", Math.abs(self.ellps[0].x - self.ellps[2].x));
        el.setAttribute("height", Math.abs(self.ellps[0].y - self.ellps[3].y));
        el.setAttribute("x", Math.min(self.ellps[0].x, self.ellps[2].x));
        el.setAttribute("y", Math.min(self.ellps[0].y, self.ellps[3].y));
        break;
    case "ellipse":
        el.setAttribute("rx", Math.abs((self.ellps[0].x - self.ellps[2].x) / 2));
        el.setAttribute("ry", Math.abs((self.ellps[0].y - self.ellps[3].y) / 2));
        el.setAttribute("cx", (Math.min(self.ellps[0].x, self.ellps[2].x) + Math.max(self.ellps[0].x, self.ellps[2].x)) / 2);
        el.setAttribute("cy", (Math.min(self.ellps[0].y, self.ellps[3].y) + Math.max(self.ellps[0].y, self.ellps[3].y)) / 2);
        break;
		
	 case "arc":
        self.arcPoints.rx=Math.abs((self.ellps[0].x - self.ellps[2].x) / 2);
        self.arcPoints.ry=Math.abs((self.ellps[0].y - self.ellps[3].y) / 2);
        self.arcPoints.cx=(Math.min(self.ellps[0].x, self.ellps[2].x) + Math.max(self.ellps[0].x, self.ellps[2].x)) / 2;
        self.arcPoints.cy=(Math.min(self.ellps[0].y, self.ellps[3].y) + Math.max(self.ellps[0].y, self.ellps[3].y)) / 2;
		self.width  = 2 *self.arcPoints.rx;
        self.height = 2 *self.arcPoints.ry;
		self.arcPoints.x= Math.min(self.ellps[0].x, self.ellps[2].x);
        self.arcPoints.y= Math.max(self.ellps[0].y, self.ellps[3].y);
		
		el.setAttribute("d", arcToAttribute(self.arcPoints, 0, 0));
		getNewPosByAngle(self);

        break;
    }
	
	information(self);
}

//********************************************************Start_Sizing***********************************************************//

function fresize(svg,setDrawing, width, height) {

    this.svg = svg;
	this.drawing=setDrawing;
    this.svgElem = document.getElementById(this.svg);
    this.ellps = [];
    this.select = false;
    this.width = 200;
    this.height = 100;
    this.pos = 0;
    this.fixZoom = 10;
	this.px=2;
    this.zoom = 2;
    this.offset = {
        x: 0,
        y: 0
    };

    var self = this;

    const style = document.createElement('style');
    document.head.appendChild(style);

    this.displayDate = function (evt) {

        var etargSVG = evt.target;

        function getMousePosition(evt) {
            var CTM = etargSVG.getScreenCTM();
            return {
                x: self.px*Math.round((evt.clientX - CTM.e) /(self.px*CTM.a)),
                y: self.px*Math.round((evt.clientY - CTM.f) /(self.px*CTM.d))
            };
        }
		
		
	    function getMousePositionOrginal(evt) {
            var CTM = etargSVG.getScreenCTM();
            return {
                x: Math.round((evt.clientX - CTM.e) /CTM.a),
                y: Math.round((evt.clientY - CTM.f) /CTM.d)
            };
        }

        evt.target.addEventListener('mousedown', startDrag);
        evt.target.addEventListener('mousemove', drag);
        evt.target.addEventListener('mouseup', endDrag);
        evt.target.addEventListener('mouseleave', endDrag);

        var selectedElement,
        offset,
        transform;

        function startDrag(evt) {
            self.select = false;
            var coord = getMousePositionOrginal(evt);
            self.selectEllipse(coord);

        }

        function drag(evt) {

            var coord = getMousePosition(evt);
            if (self.select) {
                var e = self.ellps[self.pos];
                e.x = coord.x;
                e.y = coord.y;
                self.moveElementByPos();
                return;
            }



            //
        }

        function endDrag(evt) {
			if((self.type==2) && self.select ) 
				updatePolyline(self);
			if(self.select  && (!self.drawing.shapes.design.mouse)) 
				self.drawing.saveData('Resize :'+self.setElement.getAttribute("name"));
            self.select = false;
			deleteInfoByPos(self);
			designMouseUp(self,getMousePosition(evt));
			findPosProb();
        }
    }

    this.addElement = function (element) {
        var r = 6 / self.grid.zoom;
        self.fixZoom = r;
        switch (element) {
        case 'ellipse':
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
            newElement.style.stroke = "#1100ff";
            newElement.style.fill = "#1100ff";
            newElement.style.strokeWidth = "1px";
            newElement.setAttribute("cx", 400);
            newElement.setAttribute("cy", 400);
            newElement.setAttribute("rx", r);
            newElement.setAttribute("ry", r);
            setId = "el" + self.ellps.length + 1;
            newElement.setAttribute("id", setId);
            self.ellps.push({
                id: setId,
                x:  200,
                y:  200,
                xc: 0,
                yc: 0
            });
            self.svgElem.appendChild(newElement);
            break;
        }

    }

    self.moveElement = function (setNewPos) {
        document.getElementById(setNewPos.id).setAttribute("cx", setNewPos.x);
        document.getElementById(setNewPos.id).setAttribute("cy", setNewPos.y);
		informationByPos(self);
    }

    self.initPos = function () {
        setInitPos(self);
    }

    self.creatEllipse = function () {
        getType(self);
        for (var i = 0; i < self.length; i++)
            self.addElement('ellipse');
        self.initPos();
        self.limitsUpdate();

    }

    self.moveObject = function () {
        self.initPos();
        self.limitsUpdate();
		
    }

    self.setPosSize = function () {
        setPosSize(self);
    }

    self.deletEllipse = function () {
        for (var i = 0; i < self.ellps.length; i++) {
            var element = document.getElementById(self.ellps[i].id);
            element.parentNode.removeChild(element);
        }
        self.ellps = [];
		deleteInfo(self);
		self.setElement=null;
    }

    self.selectEllipse = function (coord) {
        for (var i = 0; i < self.ellps.length; i++) {

            if ((Math.abs(coord.x - self.ellps[i].x) <= 2*self.fixZoom) && (Math.abs(coord.y - self.ellps[i].y) <= 2*self.fixZoom)) {
                self.select = true;
                self.offset.x = self.ellps[i].x;
                self.offset.y = self.ellps[i].y;
                self.pos = i;	
                return true;
            }
        }
        return false;
    }

    self.limitsUpdate = function () {
      if (self.type == 1)
	   {
        var x = self.ellps[0].x;
        var y = self.ellps[0].y;

        var w = self.width;
        var h = self.height;

        self.ellps[1].x = x;
        self.ellps[2].x = x + w;
        self.ellps[3].x = x + w;
        self.ellps[1].y = y + h;
        self.ellps[2].y = y;
	    self.ellps[3].y = y + h;
	   }

        for (var i = 0; i < self.length; i++)
            self.moveElement(self.ellps[i]);
		
	 information(self);
    }

    self.moveElementByPos = function () {
        if (self.type == 1){
            switch (self.pos) {

            case 0:

                x = self.ellps[0].x;
                y = self.ellps[0].y;

                self.width = self.ellps[3].x - x;
                self.height = self.ellps[3].y - y;

                self.limitsUpdate();
                break;

            case 1:
                x = self.ellps[1].x;
                y = self.ellps[1].y;
                self.ellps[0].x = x;

                self.width = self.ellps[3].x - x;
                self.height = y - self.ellps[0].y;

                self.limitsUpdate();
                break;

            case 2:
                x = self.ellps[2].x;
                y = self.ellps[2].y;
                self.ellps[0].y = y;

                self.width = self.ellps[2].x - self.ellps[0].x;
                self.height = self.ellps[3].y - y;

                self.limitsUpdate();
                break;

            case 3:
                x = self.ellps[3].x;
                y = self.ellps[3].y;

                self.width = x-self.ellps[0].x;
                self.height= y-self.ellps[0].y;

                self.limitsUpdate();
                break;
				
			case 4:
			    var x = self.ellps[4].x;
                var y = self.ellps[4].y;
				var cx=self.arcPoints.cx;
				var cy=self.arcPoints.cy;
				var r=Math.sqrt(Math.pow(x-cx,2)+Math.pow(y-cy,2));
				var cos=(x-cx)/r;
				var sin=(y-cy)/r;
				
				self.ellps[4].x=cx+self.arcPoints.rx*cos;
				self.ellps[4].y=cy+self.arcPoints.ry*sin;
				
				var a=1;
				if ((y<cy)) a=-1;
			
				
				var deltaX = x-cx;
                var deltaY = y-cy;
                var rad = 2*pi+Math.atan2(deltaY, deltaX);
				self.arcPoints.startAngle=a*Math.acos(cos);
				self.limitsUpdate();
			
			break;
			
			case 5:
			    var x = self.ellps[5].x;
                var y = self.ellps[5].y;
				var cx=self.arcPoints.cx;
				var cy=self.arcPoints.cy;
				var r=Math.sqrt(Math.pow(x-cx,2)+Math.pow(y-cy,2));
				var cos=(x-cx)/r;
				var sin=(y-cy)/r;
				
				self.ellps[5].x=cx+self.arcPoints.rx*cos;
				self.ellps[5].y=cy+self.arcPoints.ry*sin;
				
				//var a=1;
				//if (y<cy) a=-1;
				
				var deltaX = x-cx;
                var deltaY = y-cy;
                var rad = 2*pi+Math.atan2(deltaY, deltaX);
				self.arcPoints.endAngle=rad-self.arcPoints.startAngle;//a*Math.acos(cos);-self.arcPoints.endAngle+
				self.arcPoints.deltaAngle=rad
				self.limitsUpdate();
			
			break;


            }

        self.setPosSize();
		}
	 else if(self.type==2){
			 
			 if(self.pos!=self.length-1){
			 self.points[self.pos].x=self.ellps[self.pos].x;
			 self.points[self.pos].y=self.ellps[self.pos].y;
			 ShangeNetDierction(self);
			 self.svgElem.style.cursor='move';
			 getPosToAddlineInPolyline(self);
			 } else addLineInPolyline(self);
			 self.setElement.setAttribute("points", polylineToAttribute(self.points,0,0));
			 self.moveElement(self.ellps[self.pos]);
		 }
	
    }

    self.updateSizeByZoom = function () {
        var r = 6 / self.grid.zoom;
        self.fixZoom = r;
        for (var i = 0; i < self.ellps.length; i++) {
            document.getElementById(self.ellps[i].id).setAttribute("rx", r);
            document.getElementById(self.ellps[i].id).setAttribute("ry", r);
        }
    }
	
	
	self.cursorInEllps=function(coord)
	{
		        for (var i = 0; i < self.ellps.length; i++)
                if ((Math.abs(coord.x - self.ellps[i].x) <= self.fixZoom) && (Math.abs(coord.y - self.ellps[i].y) <= self.fixZoom)) {
                    self.posCursor=i;
					//console.log(true+'  '+coord.x+'  '+coord.y+'  '+self.fixZoom+'  '+self.ellps.length);
                    return true;
                }
				//console.log(false+'  '+coord.x+'  '+coord.y+'  '+self.fixZoom+'  '+self.ellps.length);
				return false;
	}

    self.svgElem.addEventListener("load", this.displayDate);

}
