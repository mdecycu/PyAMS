function newProbe(elem) {

    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
    newElement.style.stroke = "#000000";
	newElement.style.fill = "none";
    newElement.style["stroke-dasharray"] = "2,2";
	
    var xo = 20;
    var yo = 10;
    var x = xo;
    var y = yo;
    newElement.setAttribute("points", xo + "," + yo + " " + x + "," + y);
    elem.appendChild(newElement);

    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    newElement.style.stroke = "#000000";
    newElement.style.fill = "#000000";
    newElement.style.strokeWidth = "1px";
    newElement.setAttribute("x", 0);
    newElement.setAttribute("y", 0);
    newElement.setAttribute("width", 60);
    newElement.setAttribute("height", 20);
    elem.appendChild(newElement);

    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    newElement.style.fill = "#ffffff";
    newElement.style.fontSize = "12";
    newElement.style.fontFamily = "Times New Roman";
    newElement.textContent = 'NoPos';
    newElement.setAttribute("x", 0);
    newElement.setAttribute("y", 0);
    elem.appendChild(newElement);

}

function structProbe(elem) {
    elem.childNodes[2]
    bbox = elem.childNodes[2].getBBox();
    var w = bbox.width;
    var h = bbox.height;
    elem.childNodes[2].setAttribute("y", h);
    elem.childNodes[1].setAttribute("width", w);
    elem.childNodes[1].setAttribute("height", h + (h / 4));
    elem.setAttribute("width", w);
    elem.setAttribute("height", h);
}

function getProbes() {
    var probes = document.getElementsByName('probe');
    var list = [];
    for (var i = 0; i < probes.length; i++) {
        var r = probes[i].childNodes[2].textContent.split("=");
        list.push(r[0]);
    }
    return list;
}

function setProbesValues(val) {
    var probes = document.getElementsByName('probe');

    for (var i = 0; i < probes.length; i++) {
        var r = probes[i].childNodes[2].textContent.split("=");
        probes[i].childNodes[2].textContent = r[0] + '=' + val[i];
        structProbe(probes[i]);
    }

}

function findPosProb() {
    var probes = document.getElementsByName('probe');

    for (var i = 0; i < probes.length; i++) {
        var r = probes[i].childNodes[2].textContent.split(".");
        var elem = probes[i].childNodes[0];
        if (r.length > 0) {
            var s = document.getElementsByName('ref');
            for (var j = 0; j < s.length; j++) {
                if (s[j].textContent == r[0]) {
                    var parElem = s[j].parentElement;
                    var x = parseInt(parElem.getAttribute('x'));
                    var y = parseInt(parElem.getAttribute('y'));
                    var w = parseInt(parElem.getAttribute('width'));
                    var h = parseInt(parElem.getAttribute('height'));
                    var points = getArrayPoints(elem);
					var orgX=parseInt(probes[i].getAttribute('x'));
					var orgY=parseInt(probes[i].getAttribute('y'));
                    points[1].x = x+(w/2)-orgX;
                    points[1].y = y+(h/2)-orgY;
                    elem.setAttribute("points", polylineToAttribute(points, 0, 0));
                }
            }

        }
    }

}
