/*
#-------------------------------------------------------------------------------
# Name:        arc.js
# Author:      d.fathi
# Created:     15/06/2021
# Copyright:  (c) PyAMS 2021
# Licence:
#-------------------------------------------------------------------------------
 */

function radian(ux, uy, vx, vy) {
    var dot = ux * vx + uy * vy;
    var mod = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
    var rad = Math.acos(dot / mod);
    if (ux * vy - uy * vx < 0.0) {
        rad = -rad;
    }
    return rad;
}

function svgArcToCenterParam(x1, y1, rx, ry, phi, fA, fS, x2, y2) {
    var cx,
    cy,
    startAngle,
    deltaAngle,
    endAngle;
    var PIx2 = Math.PI * 2.0;

    if (rx < 0) {
        rx = -rx;
    }
    if (ry < 0) {
        ry = -ry;
    }
    if (rx == 0.0 || ry == 0.0) { // invalid arguments
        throw Error('rx and ry can not be 0');
    }

    var s_phi = Math.sin(phi);
    var c_phi = Math.cos(phi);
    var hd_x = (x1 - x2) / 2.0; // half diff of x
    var hd_y = (y1 - y2) / 2.0; // half diff of y
    var hs_x = (x1 + x2) / 2.0; // half sum of x
    var hs_y = (y1 + y2) / 2.0; // half sum of y

    // F6.5.1
    var x1_ = c_phi * hd_x + s_phi * hd_y;
    var y1_ = c_phi * hd_y - s_phi * hd_x;

    // F.6.6 Correction of out-of-range radii
    //   Step 3: Ensure radii are large enough
    var lambda = (x1_ * x1_) / (rx * rx) + (y1_ * y1_) / (ry * ry);
    if (lambda > 1) {
        rx = rx * Math.sqrt(lambda);
        ry = ry * Math.sqrt(lambda);
    }

    var rxry = rx * ry;
    var rxy1_ = rx * y1_;
    var ryx1_ = ry * x1_;
    var sum_of_sq = rxy1_ * rxy1_ + ryx1_ * ryx1_; // sum of square
    if (!sum_of_sq) {
        throw Error('start point can not be same as end point');
    }
    var coe = Math.sqrt(Math.abs((rxry * rxry - sum_of_sq) / sum_of_sq));
    if (fA == fS) {
        coe = -coe;
    }

    // F6.5.2
    var cx_ = coe * rxy1_ / ry;
    var cy_ = -coe * ryx1_ / rx;

    // F6.5.3
    cx = c_phi * cx_ - s_phi * cy_ + hs_x;
    cy = s_phi * cx_ + c_phi * cy_ + hs_y;

    var xcr1 = (x1_ - cx_) / rx;
    var xcr2 = (x1_ + cx_) / rx;
    var ycr1 = (y1_ - cy_) / ry;
    var ycr2 = (y1_ + cy_) / ry;

    // F6.5.5
    startAngle = radian(1.0, 0.0, xcr1, ycr1);

    // F6.5.6
    deltaAngle = radian(xcr1, ycr1, -xcr2, -ycr2);
    while (deltaAngle > PIx2) {
        deltaAngle -= PIx2;
    }
    while (deltaAngle < 0.0) {
        deltaAngle += PIx2;
    }
    if (fS == false || fS == 0) {
        deltaAngle -= PIx2;
    }
    endAngle = startAngle + deltaAngle;
    while (endAngle > PIx2) {
        endAngle -= PIx2;
    }
    while (endAngle < 0.0) {
        endAngle += PIx2;
    }

    var outputObj = { /* cx, cy, startAngle, deltaAngle */
        cx: cx,
        cy: cy,
        rx: rx,
        ry: ry,
        startAngle: startAngle,
        deltaAngle: deltaAngle,
        endAngle: endAngle,
        clockwise: (fS == true || fS == 1)
    }

    return outputObj;
}
const cos_ = Math.cos;
const sin_ = Math.sin;
const pi = Math.PI;

const f_vec_add = (([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2]);

const f_svg_ellipse_arc = (([cx, cy], [rx, ry], [t1, D]) => {

    D = D % (2 * pi);

    const[sX, sY] = (f_vec_add([rx * cos_(t1), ry * sin_(t1)], [cx, cy]));
    const[eX, eY] = (f_vec_add([rx * cos_(t1 + D), ry * sin_(t1 + D)], [cx, cy]));
    const fA = ((D > pi) ? 1 : 0);
    const fS = ((D > 0) ? 1 : 0);
    var s = "M " + sX + " " + sY + " A " + [rx, ry, 0, fA, fS, eX, eY].join(" ");
    var p = s.split(' ');

    sX1 = parseInt(p[1]);
    sY1 = parseInt(p[2]);
    rx1 = parseInt(p[4]);
    ry1 = parseInt(p[5]);
    fA1 = parseInt(p[7]);
    fS1 = parseInt(p[8]);
    eX1 = parseInt(p[9]);
    eY1 = parseInt(p[10]);

    var result = svgArcToCenterParam(sX1, sY1, rx1, ry1, 0, fA1, fS1, eX1, eY1);
    //console.log(result);
    return s;
});

function getArc(p) {
    var sX = parseInt(p[1]);
    var sY = parseInt(p[2]);
    var rx = parseInt(p[4]);
    var ry = parseInt(p[5]);
    var fA = parseInt(p[7]);
    var fS = parseInt(p[8]);
    var eX = parseInt(p[9]);
    var eY = parseInt(p[10]);

    return svgArcToCenterParam(sX, sY, rx, ry, 0, fA, fS, eX, eY);
}

function pointInArc(r, offset) {

    d = Math.pow((offset.x - r.cx) / r.rx, 2) + Math.pow((offset.y - r.cy) / r.ry, 2);
    min = 0.5;
    max = 1.5;
    return (d >= min) && (d <= max);

}

function arcToAttribute(arcPoints, x, y) {
    return f_svg_ellipse_arc([arcPoints.cx + x, arcPoints.cy + y], [arcPoints.rx, arcPoints.ry], [arcPoints.startAngle, arcPoints.endAngle]);
}

//*************************************

function getNewPosByAngle(self) {

    var p = self.setElement.getAttribute("d").split(' ');
    arcPointsf = getArc(p);

    if ((self.pos != 5) && (self.select)) {

        self.ellps[5].x = self.arcPoints.cx + self.arcPoints.rx * Math.cos(arcPointsf.endAngle);
        self.ellps[5].y = self.arcPoints.cy + self.arcPoints.ry * Math.sin(arcPointsf.endAngle);
        self.moveElement(self.ellps[5]);
    }
    if ((self.pos != 4) && (self.select)) {
        self.ellps[4].x = self.arcPoints.cx + self.arcPoints.rx * Math.cos(arcPointsf.startAngle);
        self.ellps[4].y = self.arcPoints.cy + self.arcPoints.ry * Math.sin(arcPointsf.startAngle);
        self.moveElement(self.ellps[4]);
    }
}
