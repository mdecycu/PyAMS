/*
#-------------------------------------------------------------------------------
# Name:        ioData.js
# Description:   in and out data
# Author:      d.fathi
# Created:     29/08/2021
# Copyright:   (c) PyAMS 2021
# Licence:
#-------------------------------------------------------------------------------
 */

new QWebChannel(qt.webChannelTransport,
    function (channel) {
    var document = channel.objects.document;
    window.foo = document;
    document.jscallme('Hello');
    document.return_list(function (pyval) {
        //alert("Un message a été reçu: " + (pyval[0]+pyval[1]));
    });

    document.newPage(function (val) {
        if (val)
            drawing.newPage('sym');
        else
            drawing.newPage('pac');
        drawing.objectInspector.getSelect();
    });

});

var ioDic = {
    x: 0,
    y: 0,
    zoom: 0,
    select: false,
    undo: false,
    redo: false,
    past: false,
    endDrawing: true,
    modified: false,
    selectPart: false,
    undoPos: '  '
};

function dataToInterfacePython() {

    function getMousePosition(evt) {
        var CTM = svg.getScreenCTM();
        return {
            x: Math.round((evt.clientX - CTM.e) / CTM.a),
            y: Math.round((evt.clientY - CTM.f) / CTM.d)
        };

    }

    function ioupdateData(e) {
        ioDic.x = getMousePosition(e).x;
        ioDic.y = getMousePosition(e).y;
        ioDic.zoom = Math.ceil(drawing.grid.zoom * 100) + '%';
        ioDic.select = (drawing.shapes.lsg.elms.length > 0) || (drawing.resize.setElement != null);
        ioDic.undo = !(drawing.posUndo <= 0);
        ioDic.redo = !(drawing.posUndo >= drawing.data.length - 1);
        ioDic.past = !(drawing.copyList.length == 0);
        ioDic.endDrawing = !drawing.shapes.design.mouse;
        ioDic.modified = drawing.modified;
        ioDic.undoPos = drawing.getDescUndo();
        ioDic.selectPart = itPartSelect();
        window.foo.getRef([ioDic]);
    }

    document.getElementById("svg").addEventListener('mousemove', e => {
        ioupdateData(e);
    });
    document.getElementById("svg").addEventListener('mouseup', e => {
        ioupdateData(e);
    });
}

dataToInterfacePython();

function updatResult() {
    ioDic.zoom = Math.ceil(drawing.grid.zoom * 100) + '%';
    ioDic.select = (drawing.shapes.lsg.elms.length > 0) || (drawing.resize.setElement != null);
    ioDic.undo = !(drawing.posUndo <= 0);
    ioDic.redo = !(drawing.posUndo >= drawing.data.length - 1);
    ioDic.past = !(drawing.copyList.length == 0);
    ioDic.endDrawing = !drawing.shapes.design.mouse;
    ioDic.modified = drawing.modified;
    ioDic.undoPos = drawing.getDescUndo();
    ioDic.selectPart = itPartSelect();
    window.foo.getRef([ioDic]);
}

function ioZoomIn() {
    drawing.zoomIn();
    updatResult();
}

function ioZoomOut() {
    drawing.zoomOut();
    updatResult();
}

function ioRedo() {
    drawing.redo();
    updatResult();
}

function ioUndo() {
    drawing.undo();
    updatResult();
}

function ioCut() {
    drawing.cut();
    updatResult();
}

function ioCopy() {
    drawing.copy();
    updatResult();
}

function ioPast() {
    drawing.past();
    updatResult();
}

function ioEndDrawing() {
    drawing.shapes.design.mouse = false;
    drawing.shapes.design.start = false;
    updatResult();
}

function ioNewPage(type) {
    drawing.newPage(type);
    updatResult();
}

function ioSetSymbol(sym) {
    drawing.setSymbol(sym);
    updatResult();
}

function ioGetSymbol(sym) {
    drawing.modified = false;
    updatResult();
    return drawing.getSymbol();
}

function ioGetNetList() {
    return netList();
}

function ioGetProbes() {
    return getProbes();
}

function ioGetNetList() {
    return netList();
}

function ioGetProbesWithNetList() {
    return [getProbes(), netList()];
}

function ioSetProbeValue(val) {
    setProbesValues(val);
}

function ioPosProbe() {
    var str = mtable.select.childNodes[2].textContent.split('=');
    window.foo.getProbeValue(str[0]);
}

function ioSetPosProbe(pos) {
    mtable.newElem.setAttribute("value", pos);
    mtable.select.childNodes[2].textContent = pos;
    structProbe(mtable.select);
}

function ioTypeRotation(type) {
    switch (type) {
    case 'rotate':
        rotatePart();
        break;
    case 'flipHorizontal':
        flipHorizontalPart();
        break;
    case 'flipVertical':
        flipVerticallyPart();
        break;
    }
}
