

function getTextContentByType(type) {
    switch (type) {
    case 'text':
        return 'Text styling';
        break;
    case 'label':
        return 'label';
        break;
    case 'param':
        return 'p=100';
        break;
    case 'ref':
        return drawing.symbol.reference + '?';
        break;
    }
}



function controlPinSize(size){
	if(size<=5)
		return 5;
	else if(size>=25)
		return 25;
	else
		return size;
}

function controlText(Text){
	return Text.split('`').join('');
}
