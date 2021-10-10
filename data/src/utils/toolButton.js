/*
#-------------------------------------------------------------------------------
# Name:        tool Button
# Author:      d.fathi
# Created:     25/07/2021
# Copyright:   (c) PyAMS 2021
# Licence:
#-------------------------------------------------------------------------------
 */



function creatToolButton(id)
{
	
var S=`
<a class="myButton"  onclick="appClick('zoomIn')">zoom In</a>';
<a class="myButton"  onclick="appClick('zoomOut')">zoom Out</a>
<a class="myButton"  onclick="appClick('rect')">rect</a>
<a class="myButton"  onclick="appClick('ellipse')">ellipse</a>
<a class="myButton"  onclick="appClick('arc')">arc</a>
<a class="myButton"  onclick="appClick('polyline')">polyline</a>
<a class="myButton"  onclick="appClick('text')">text</a>
<a class="myButton"  onclick="appClick('label')">label</a>
<a class="myButton"  onclick="appClick('param')">param</a>
<a class="myButton"  onclick="appClick('ref')">ref</a>
<a class="myButton"  onclick="appClick('pin')">pin</a>
<a class="myButton"  onclick="appClick('probe')">probe</a>
<a class="myButton"  onclick="appClick('undo')">Undo</a>
<a class="myButton"  onclick="appClick('redo')">Redo</a>
<a class="myButton"  onclick="appClick('copy')">copy</a>
<a class="myButton"  onclick="appClick('past')">past</a>
<a class="myButton"  onclick="appClick('cut')">cut</a>
<a class="myButton"  onclick="appClick('part1')">GND</a>
<a class="myButton"  onclick="appClick('part2')">part2</a>
<a class="myButton"  onclick="appClick('part3')">part3</a>
<a class="myButton"  onclick="appClick('part4')">part4</a>
<a class="myButton"  onclick="appClick('net')">net</a>
<a class="myButton"  onclick="openpage()">circuit</a>
<a class="myButton"  onclick="excute()">excute</a>
<a class="myButton"  onclick="endDrawing()">End drawing</a>
<a class="myButton"  onclick="rotatePart()">rotate Part</a>
<a class="myButton"  onclick="rotatePart()">rotate Part</a>
<a class="myButton"  onclick="flipVerticallyPart()">flip Vertically Part</a>
<a class="myButton"  onclick="flipHorizontalPart()">flip Horizontal Part</a>
<a class="myButton"  onclick="savePageToSVG()">save SVG</a>
`;

const body = document.getElementById(id);
if(drawing.usedByInterface)
body.innerHTML =S;

}

var parts=[
'<rect class="draggable" x="300" y="70" name="rect" width="70" height="80" style="stroke: rgb(0, 0, 255); fill: rgb(255, 123, 0); stroke-width: 1px;"></rect><ellipse class="draggable" name="ellipse" cx="375" cy="155" rx="45" ry="45" style="stroke: rgb(0, 0, 255); fill: rgb(255, 123, 0); stroke-width: 1px;"></ellipse><g points="290,100 300,100 " class="polyline" name="pin"><polyline points="290,100 300,100 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="287" y="97" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px;"></rect><text r="0" x="302" y="102" transform="rotate(0 302 102)" style="stroke: rgb(0, 0, 0); fill: none; font-size: 8px; font-family: &quot;Times New Roman&quot;;">pin1</text></g>'
,'<ellipse class="draggable" name="ellipse" cx="230" cy="120" rx="40" ry="40" style="stroke: rgb(0, 0, 255); fill: rgb(4, 255, 0); stroke-width: 1px;"></ellipse><g points="180,120 190,120" class="polyline" name="pin"><polyline points="180,120 190,120 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="177" y="117" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px;"></rect><text r="0" x="192" y="122" transform="rotate(0 192 122)" style="stroke: rgb(0, 0, 0); fill: none; font-size: 8px; font-family: &quot;Times New Roman&quot;;">pin1</text></g>'
,'<ellipse class="draggable" name="ellipse" cx="230" cy="120" rx="40" ry="40" style="stroke: rgb(0, 0, 255); fill: rgb(255, 0, 208); stroke-width: 1px;"></ellipse><g points="180,120 190,120" class="polyline" name="pin"><polyline points="180,120 190,120 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="177" y="117" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px;"></rect><text r="0" x="192" y="122" transform="rotate(0 192 122)" style="stroke: rgb(0, 0, 0); fill: none; font-size: 8px; font-family: &quot;Times New Roman&quot;;">pin1</text></g><rect class="draggable" x="270" y="90" name="rect" width="90" height="130" style="stroke: rgb(0, 0, 255); fill: rgb(82, 83, 96); stroke-width: 1px;"></rect><g points="260,190 270,190" class="polyline" name="pin"><polyline points="260,190 270,190 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="257" y="187" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px;"></rect><text r="0" x="272" y="192" transform="rotate(0 272 192)" style="stroke: rgb(0, 0, 0); fill: none; font-size: 8px; font-family: &quot;Times New Roman&quot;;">pin2</text></g>'
,'<polyline points="180,200 190,200 200,180 210,220 220,180 230,220 240,180 250,220 260,200 280,200 " class="polyline" name="polyline" style="stroke: rgb(0, 0, 255); fill: none; stroke-width: 1px;"></polyline><g points="170,200 180,200" class="polyline" name="pin"><polyline points="170,200 180,200 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="167" y="197" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px;"></rect><text r="0" x="182" y="202" transform="rotate(0 182 202)" style="stroke: rgb(0, 0, 0); fill: none; font-size: 8px; font-family: &quot;Times New Roman&quot;;">pin1</text></g><g points="170,210 180,210" class="polyline" name="pin"><polyline points="170,210 180,210 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="167" y="207" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px;"></rect><text r="0" x="182" y="212" transform="rotate(0 182 212)" style="stroke: rgb(0, 0, 0); fill: none; font-size: 8px; font-family: &quot;Times New Roman&quot;;">pin2</text></g>'];


function appClick(argument) {

    switch (argument) {
    case 'zoomIn':
        drawing.zoomIn();
        break;
    case 'zoomOut':
        drawing.zoomOut();
        break;
    case 'undo':
        drawing.undo();
        break;
    case 'redo':
        drawing.redo();
        break;
	case 'copy':
        drawing.copy();
        break;
    case 'cut':
        drawing.cut();
        break;
    case 'past':
        drawing.past();
        break;
		
	case 'part1':
	   addGnd();
        break;
		
	case 'part2':
	    part='<g points="100,100 110,100 " std="false" class="polyline" name="pin" width="300" height="200" zoom="5.200000000000002" left="0" top="147" modelname="Resistor" reference="R" description=" Resistor"><polyline points="100,100 110,100 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="97" y="97" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px;"></rect><text r="0" x="112" y="102" transform="rotate(0 112 102)" style="font-size: 12px; font-family: &quot;Times New Roman&quot;; display: none;">pin1</text></g><g points="200,100 190,100 " class="polyline" name="pin"><polyline points="200,100 190,100 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="197" y="97" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px;"></rect><text r="0" x="190" y="102" transform="rotate(0 190 102)" style="font-size: 12px; font-family: &quot;Times New Roman&quot;; display: none;">pin2</text></g><polyline points="110,100 121,100 128,80 138,120 150,80 162,120 174,80 180,100 190,100 " class="polyline" name="polyline" style="stroke: rgb(0, 0, 255); fill: none; stroke-width: 1px;"></polyline><text class="draggable" name="param" x="141" y="153" r="0" transform="rotate(0 141  153)" style="fill: rgb(17, 162, 41); font-size: 12px; font-family: &quot;Times New Roman&quot;;">R=100Ω </text><text class="draggable" name="ref" x="140" y="140" r="0" transform="rotate(0 140  140)" style="fill: rgb(17, 162, 41); font-size: 12px; font-family: &quot;Times New Roman&quot;;">R?</text>';
		addPart(part,'****',true)
        break;
	
	case 'part3':
	    part='<g points="30,60 40,60 " std="false" class="polyline" name="pin" width="150" height="150" zoom="9.999999999999996" left="0" top="251" modelname="Resistor" reference="R" description=" Resistor"><polyline points="30,60 40,60 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="27" y="57" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px;"></rect><text r="0" x="42" y="62" transform="rotate(0 42 62)" style="font-size: 12px; font-family: &quot;Times New Roman&quot;; display: none;">pin1</text></g><g points="80,60 70,60 " class="polyline" name="pin"><polyline points="80,60 70,60 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="77" y="57" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px;"></rect><text r="0" x="70" y="62" transform="rotate(0 70 62)" style="font-size: 12px; font-family: &quot;Times New Roman&quot;; display: none;">pin2</text></g><polyline points="39,60 45,60 48,50 52,70 57,50 61,70 67,50 69,60 73,60 " class="polyline" name="polyline" style="stroke: rgb(0, 0, 255); fill: none; stroke-width: 1px;"></polyline><text class="draggable" name="param" x="46" y="98" r="0" transform="rotate(0 46 98)" style="fill: rgb(17, 162, 41); font-size: 12px; font-family: &quot;Times New Roman&quot;;">R=100Ω </text><text class="draggable" name="ref" x="46" y="86" r="0" transform="rotate(0 46 86)" style="fill: rgb(17, 162, 41); font-size: 12px; font-family: &quot;Times New Roman&quot;;">R?</text>';
        addPart(part,'****',true);
        break;


		
	case 'getPart':
        drawing.add('getPart');
        break;

    default:
	   addShape(argument);

    }
}


function openpage()
{
	var cir='<g width="1500" top="0" left="0" height="1500" version="0.0.1" zoom="1.6" reference="X" description=" " modelname="NewModel"></g><g x="285" y="345" transform="translate(285,345)" width="25" height="15" class="part" name="part" xo="0" yo="0" sref="01" directory="standard" liblocale="true"><g width="150" top="572" left="0" height="150" zoom="20" reference="0" std="true" description=" " setref="GND" modelname="GND"></g><g points="15,5 15,10" class="polyline" name="pin" netid="2" netidpos="4" netId="2" netIdPos="4"><polyline points="15,5 15,10 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="12" y="2" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px; display: none;"></rect><text r="0" x="13" y="12" transform="rotate(90 13 12)" style="font-size: 12px; font-family: &quot;Times New Roman&quot;; display: none;">pin2</text></g><polyline points="7,10 23,10 " class="polyline" name="polyline" style="stroke: rgb(0, 0, 255); fill: none; stroke-width: 1px;"></polyline><polyline points="9,12 21,12 " class="polyline" name="polyline" style="stroke: rgb(0, 0, 255); fill: none; stroke-width: 1px;"></polyline><polyline points="13,14 17,14 " class="polyline" name="polyline" style="stroke: rgb(0, 0, 255); fill: none; stroke-width: 1px;"></polyline></g><g x="690" y="320" transform="translate(690,320)" width="25" height="15" class="part" name="part" xo="0" yo="0" sref="02" directory="standard" liblocale="true"><g width="150" top="572" left="0" height="150" zoom="20" reference="0" std="true" description=" " setref="GND" modelname="GND"></g><g points="15,5 15,10" class="polyline" name="pin" netid="0" netidpos="0" netId="0" netIdPos="0"><polyline points="15,5 15,10 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="12" y="2" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px; display: none;"></rect><text r="0" x="13" y="12" transform="rotate(90 13 12)" style="font-size: 12px; font-family: &quot;Times New Roman&quot;; display: none;">pin2</text></g><polyline points="7,10 23,10 " class="polyline" name="polyline" style="stroke: rgb(0, 0, 255); fill: none; stroke-width: 1px;"></polyline><polyline points="9,12 21,12 " class="polyline" name="polyline" style="stroke: rgb(0, 0, 255); fill: none; stroke-width: 1px;"></polyline><polyline points="13,14 17,14 " class="polyline" name="polyline" style="stroke: rgb(0, 0, 255); fill: none; stroke-width: 1px;"></polyline></g><polyline points="705,325 705,200 590,200 " class="polyline" name="net" xdir="true" ref="0" parent="false" parentcolor="false" used="true" id="0" node0="-1" node1="-1" style="stroke: rgb(0, 0, 0); fill: none; stroke-width: 1px;"></polyline><polyline points="545,200 540,200 400,200 " class="polyline" name="net" xdir="true" ref="N02" parent="false" parentcolor="false" used="true" id="1" node0="-1" node1="-1" style="stroke: rgb(0, 0, 0); fill: none; stroke-width: 1px;"></polyline><polyline points="355,200 355,200 300,200 300,350 300,350 " class="polyline" name="net" xdir="true" ref="0" parent="false" parentcolor="false" used="true" id="2" node0="-1" node1="-1" style="stroke: rgb(0, 0, 0); fill: none; stroke-width: 1px;"></polyline><g x="350" y="185" transform="translate(350,185)" width="50" height="25" class="part" name="part" xo="0" yo="0" sref="R1" directory="basic" liblocale="true" modelname="Resistor"><g width="150" height="150" std="false" zoom="12.599999999999987" left="0" top="392" modelname="Resistor" reference="R" description=" Resistor"></g><g points="5,15 15,15" class="polyline" name="pin" width="150" height="150" zoom="9" left="0" top="418" modelname="Resistor" reference="R" description=" Resistor" netId="2" netIdPos="0"><polyline points="5,15 15,15 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="2" y="12" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px; display: none;"></rect><text r="0" x="17" y="17" transform="rotate(0 17 17)" style="font-size: 12px; font-family: &quot;Times New Roman&quot;; display: none;">pin1</text></g><g points="50,15 40,15" class="polyline" name="pin" netId="1" netIdPos="2"><polyline points="50,15 40,15 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="47" y="12" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px; display: none;"></rect><text r="0" x="40" y="17" transform="rotate(0 40 17)" style="font-size: 12px; font-family: &quot;Times New Roman&quot;; display: none;">pin2</text></g><polyline points="10,15 15,15 18,7 22,21 28,7 32,21 38,7 40,15 46,15 " class="polyline" name="polyline" style="stroke: rgb(0, 0, 255); fill: none; stroke-width: 1px;"></polyline><text class="var" name="param" x="21" y="46" r="0" transform="rotate(0 21 46)" style="fill: rgb(17, 162, 41); font-size: 12px; font-family: &quot;Times New Roman&quot;;">R=100Ω </text><text class="var" name="ref" x="21" y="36" r="0" transform="rotate(0 21 36)" style="fill: rgb(17, 162, 41); font-size: 12px; font-family: &quot;Times New Roman&quot;;">R1</text></g><g x="540" y="185" transform="translate(540,185)" width="50" height="25" class="part" name="part" xo="0" yo="0" sref="R2" directory="basic" liblocale="true" modelname="Resistor"><g width="150" height="150" std="false" zoom="12.599999999999987" left="0" top="392" modelname="Resistor" reference="R" description=" Resistor"></g><g points="5,15 15,15" class="polyline" name="pin" width="150" height="150" zoom="9" left="0" top="418" modelname="Resistor" reference="R" description=" Resistor" netId="1" netIdPos="0"><polyline points="5,15 15,15 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="2" y="12" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px; display: none;"></rect><text r="0" x="17" y="17" transform="rotate(0 17 17)" style="font-size: 12px; font-family: &quot;Times New Roman&quot;; display: none;">pin1</text></g><g points="50,15 40,15" class="polyline" name="pin" netId="0" netIdPos="2"><polyline points="50,15 40,15 " style="stroke: rgb(255, 0, 0); stroke-width: 1px;"></polyline><rect width="6" height="6" class="pin" x="47" y="12" style="stroke: rgb(0, 255, 0); fill: none; stroke-width: 1px; display: none;"></rect><text r="0" x="40" y="17" transform="rotate(0 40 17)" style="font-size: 12px; font-family: &quot;Times New Roman&quot;; display: none;">pin2</text></g><polyline points="10,15 15,15 18,7 22,21 28,7 32,21 38,7 40,15 46,15 " class="polyline" name="polyline" style="stroke: rgb(0, 0, 255); fill: none; stroke-width: 1px;"></polyline><text class="var" name="param" x="21" y="46" r="0" transform="rotate(0 21 46)" style="fill: rgb(17, 162, 41); font-size: 12px; font-family: &quot;Times New Roman&quot;;">R=100Ω </text><text class="var" name="ref" x="21" y="36" r="0" transform="rotate(0 21 36)" style="fill: rgb(17, 162, 41); font-size: 12px; font-family: &quot;Times New Roman&quot;;">R2</text></g>';
	drawing.setSymbol(cir);
   updatResult();
}

function excute()
{
	alert(netList())
}