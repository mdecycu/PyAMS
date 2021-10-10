
function itMouved(self){
return(Math.abs(self.coord.x-self.offset.x)>=5)||(Math.abs(self.coord.y-self.offset.y)>=5);
}


function print(st){
	console.log(st);
}


function strToBool(v)
{
	return v=='true';
}
