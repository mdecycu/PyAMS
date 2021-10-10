/*
#-------------------------------------------------------------------------------
# Name:        drawing.js
# Author:      d.fathi
# Created:     05/07/2021
# Copyright:   (c) PyAMS 2021
# Licence:
#-------------------------------------------------------------------------------
 */
 


function drawing(div) {

    var self = this;
    self.div = div;
    self.objectInspector = null;
    self.itSymbol = true;
    self.usedByInterface = false;
    self.modified = false;
    self.posUndo = 0;
    self.copyList = [];
    self.pins = [];
    self.maxIdNet = -1;
    self.pageType = 'sym';
	self.objectInspector=null;
    createBody(self);
    this.grid = new fgrid("svg", 1800, 1800);
    this.shapes = new fshapes("svg", self, 1800, 1800);
    this.resize = new fresize("svg", self, 1800, 1800);
    this.symbol = {
        name: "New Symbol",
        reference: "X",
        description: " "
    };
    this.elemg = '<g width="1550" top="0" left="0" height="1550"  version="0.0.1" zoom="3" reference="X" description=" "></g>';
    this.grid.resize = self.resize;
    this.shapes.resize = self.resize;
	this.resize.grid=this.grid;
    this.data = [{
            setDescription: 'New',
            symbol: self.elemg
        }
    ];

    this.changPositionRuler = function () {
        self.grid.getRuler();
    };

    this.add = function (type) {
        self.shapes.addElement(type);
    }

    this.zoomIn = function () {
        self.grid.zoomIn();
    }

    this.zoomOut = function () {
        self.grid.zoomOut();
    }

    document.getElementById("areaGlobal").addEventListener("scroll", self.changPositionRuler);

    self.getPos = function (x, y) {
        posInBody(document.getElementById("svg"), x, y);

    }

    self.setSize = function (w, h) {
        var r = (h) + 'px'
        document.getElementById("areaGlobal").style.height = r;
    }

    self.saveData = function (description) {
        self.data.push({
            setDescription: description,
            symbol: document.getElementById("sym").innerHTML
        });
        self.posUndo = self.data.length - 1;
        self.modified = true;
    }

    self.undo = function () {

        if (self.posUndo <= 0)
            return;
        self.posUndo = self.posUndo-1;
        self.resize.deletEllipse();
        document.getElementById("sym").innerHTML = self.data[self.posUndo].symbol;
        self.modified = true;
    }

    self.redo = function () {
        if (self.posUndo >= self.data.length - 1)
            return;
        self.posUndo = self.posUndo + 1;
        self.resize.deletEllipse();
        document.getElementById("sym").innerHTML = self.data[self.posUndo].symbol;
        self.modified = true;
    }
	
	self.getDescUndo=function(){
		return self.data[self.posUndo].setDescription;
	}

    self.copy = function () {
        if (self.shapes.lsg.elms.length > 0) {
            self.copyList = [];
            for (var i = 0; i < self.shapes.lsg.elms.length; i++) {
                self.copyList.push({
                    node: self.shapes.lsg.elms[i].cloneNode(true)
                });
            }

        } else if (self.resize.setElement) {
            self.copyList = [];
            self.copyList.push({
                node: self.resize.setElement.cloneNode(true)
            });
        }
    };
    self.past = function () {
        if (self.copyList.length == 0)
            return;
        for (var i = 0; i < self.copyList.length; i++) {
            var copy = self.copyList[i].node.cloneNode(true);
            document.getElementById("sym").appendChild(copy);
            window.onload;
        }
        selectPast(self);
        self.saveData('Past ');

    };
    self.cut = function () {
        self.copy();
        if (self.shapes.lsg.elms.length > 0) {
            for (var i = 0; i < self.shapes.lsg.elms.length; i++)
                self.shapes.lsg.elms[i].remove();
            clearSelectElms(self.shapes);
            self.saveData('Cut ');
        } else if (self.resize.setElement) {
            self.resize.setElement.remove();
            self.resize.deletEllipse();
            self.saveData('Cut ');
        }

    };

    self.newPage = function (type) {
        clearSelectElms(self.shapes);
        self.resize.deletEllipse();

        if (type == 'sym') {
            self.grid.zoom = 6;
            self.grid.pageSize(350, 350);
        } else {
            self.grid.zoom = 1.6;
            self.grid.pageSize(1500, 1500);
        }

        document.getElementById("sym").innerHTML = self.elemg;
        self.grid.area.areaGlobal.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        self.modified = false;
        self.posUndo = 0;
        self.data = [{
                setDescription: 'New',
                symbol: self.elemg
            }
        ];
        self.pageType = type;
        self.symbol = {
        name: "New symbol",
        reference: "X",
        description: " "
    };

    }

    self.setSymbolDescription = function () {
        sym = document.getElementById("sym").firstChild;
        var width = sym.getAttribute("width");
        var height = sym.getAttribute("height");
        var zoom = parseFloat(sym.getAttribute("zoom"));
        var scrollLeft = parseInt(sym.getAttribute("left"));
        var scrollTop = parseInt(sym.getAttribute("top"));

        self.grid.zoom = zoom;
        self.grid.pageSize(width, height);
        self.grid.area.areaGlobal.scrollTo({
            top: scrollTop,
            left: scrollLeft,
            behavior: 'smooth'
        });
        self.symbol.name = sym.getAttribute("symbolname");
        self.symbol.reference = sym.getAttribute("reference");
        self.symbol.description = sym.getAttribute("description");
    }

    self.getSymbolDescription = function () {
        sym = document.getElementById("sym").firstChild;
        sym.setAttribute("width", self.grid.width);
        sym.setAttribute("height", self.grid.height);
        sym.setAttribute("zoom", self.grid.zoom);
        sym.setAttribute("left", self.grid.area.areaGlobal.scrollLeft);
        sym.setAttribute("top", self.grid.area.areaGlobal.scrollTop);
        sym.setAttribute("symbolname", self.symbol.name);
        sym.setAttribute("reference", self.symbol.reference);
        sym.setAttribute("description", self.symbol.description);
    }

    self.getSymbol = function () {
        self.getSymbolDescription();
        return document.getElementById("sym").innerHTML;
    }

    self.setSymbol = function (sym) {
        document.getElementById("sym").innerHTML = sym;
        self.modified = false;
        self.posUndo = 0;
        self.data = [{
                setDescription: 'New',
                symbol: sym
            }
        ];
        self.setSymbolDescription();
    }
	
self.getObjectInspector =function(div){ 
self.objectInspector=new fobjectInspector(div, self);
};

    self.newPage('sym');
	

}




var drawing;
function creatPage(div) {
    
    function resizeCanvas() {
    var w = document.getElementById(div).offsetWidth - 2;
    var h = document.getElementById(div).offsetHeight - 1;
    drawing.setSize(w, h - 20);
	}
    drawing = new drawing(div);
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
  // objectInspector = new fobjectInspector('tab', drawing);
	return drawing;
}

