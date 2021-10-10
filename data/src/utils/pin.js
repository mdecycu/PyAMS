
/*
#-------------------------------------------------------------------------------
# Name:        pin.js
# Author:      d.fathi
# Created:     23/07/2021
# Copyright:   (c) PyAMS 2021
# Licence:
#-------------------------------------------------------------------------------
 */
 
 
function drawingPin(pinElement)
{

	points = [];
            var p = pinElement.getAttribute("points").split(' ');
            for (var j = 0; j < p.length; j++) {
                var n = p[j].split(',');
				if(n.length==2)
                points.push({
                    x: parseInt(n[0]),
                    y: parseInt(n[1])
                });
                }
				
	pinElement.childNodes[0].setAttribute("points", polylineToAttribute(points, 0,0));
    pinElement.childNodes[1].setAttribute("x", points[0].x-3);
    pinElement.childNodes[1].setAttribute("y", points[0].y-3);
				
    if ((points[0].y == points[1].y) && (points[0].x <= points[1].x)) {
        var xt = points[1].x+2;
        var yt = points[1].y+2;
        pinElement.childNodes[2].setAttribute('x', xt);
        pinElement.childNodes[2].setAttribute('y', yt);
        pinElement.childNodes[2].setAttribute('transform', 'rotate(0 ' + xt + ' ' + yt + ')');
    } else if ((points[0].y == points[1].y) && (points[0].x > points[1].x)) {

        var bbox = pinElement.childNodes[2].getBBox();
        var w = bbox.width;
        var h = bbox.height;
		var xt = points[1].x-w;
        var yt = points[1].y+2;
        pinElement.childNodes[2].setAttribute('x', xt);
        pinElement.childNodes[2].setAttribute('y', yt);
        pinElement.childNodes[2].setAttribute('transform', 'rotate(0 ' + xt + ' ' + yt + ')');
    }
	 else if ((points[0].y <= points[1].y) && (points[0].x == points[1].x)) {;
        var bbox = pinElement.childNodes[2].getBBox();
        var w = bbox.width;
        var h = bbox.height;
		var xt = points[1].x-2;
        var yt = points[1].y+2 
        pinElement.childNodes[2].setAttribute('x', xt);
        pinElement.childNodes[2].setAttribute('y', yt);
        pinElement.childNodes[2].setAttribute('transform', 'rotate(90 ' + xt + ' ' + yt + ')');
    }
	else if ((points[0].y > points[1].y) && (points[0].x == points[1].x)) {
    
        var bbox = pinElement.childNodes[2].getBBox();
        var w = bbox.width;
        var h = bbox.height;
		var xt = points[1].x-2;
        var yt = points[1].y-2-w ;
        pinElement.childNodes[2].setAttribute('x', xt);
        pinElement.childNodes[2].setAttribute('y', yt);
        pinElement.childNodes[2].setAttribute('transform', 'rotate(90 ' + xt + ' ' + yt + ')');
    }
	
}


function getPinDescription(elem)
{
	var points=getArrayPoints(elem);
	
	 if ((points[0].y == points[1].y) && (points[0].x <= points[1].x)) 
       return {size:points[1].x-points[0].x,rotation:'0°',text:elem.childNodes[2].textContent,x:points[0].x,y:points[0].y};
    else if ((points[0].y == points[1].y) && (points[0].x > points[1].x)) 
	   return {size:-points[1].x+points[0].x,rotation:'180°',text:elem.childNodes[2].textContent,x:points[0].x,y:points[0].y};
	 else if ((points[0].y <= points[1].y) && (points[0].x == points[1].x)) 
		 return {size:points[1].y-points[0].y,rotation:'90°',text:elem.childNodes[2].textContent,x:points[0].x,y:points[0].y};
	else if ((points[0].y > points[1].y) && (points[0].x == points[1].x)) 
		 return {size:points[0].y-points[1].y,rotation:'270°',text:elem.childNodes[2].textContent,x:points[0].x,y:points[0].y};
	
	
}
