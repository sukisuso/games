/**
 * 
 */

var UserX = {};
UserX['id'] = new Date().getSeconds();
UserX['money'] = null;

var Cnq = {};
Cnq['locationSelected'] = "";
Cnq['previousSelected'] = "";
Cnq['territoriSelected'] = [];

Cnq['onTerritoryClick'] = function(path , group){
	
	 console.log(path.attrs.id);
     location.hash = path.attrs.id;
     Cnq.previousSelected= Cnq.locationSelected;
     Cnq.locationSelected = path.attrs.id;
     
     Cnq.SendMsg('game message',{userId:UserX['id'], type:'click', territory:path.attrs.id});
     
     
     if(Cnq.previousSelected != ""){
			var previous =  Risk.stage.find("#"+Cnq.previousSelected)[0]
			previous.setFill("#F3E56B");
			previous.setOpacity(0.4);
	 }

     /*var imgObj = new Image();
     imgObj.src = 'resources/img/castle.png';
     imgObj.onload = function () {
                 
             var img = new Kinetic.Image({
                 x:CenterPoints[location.hash.substring(1, location.hash.length)].x,
                 y:CenterPoints[location.hash.substring(1, location.hash.length)].y,
                 image: imgObj,
                 alpha: 0.5
             });

             layer = new Kinetic.Layer();
             layer.add(img)
             Risk.stage.add(layer);
     };*/
     
     
     path.setFill('#2E9AFE');
     path.setOpacity(0.6);
     group.moveTo(Risk.topLayer);
     Risk.topLayer.drawScene();
     
}

Cnq['onTerritoryOver'] = function (path, group){
	if(path.attrs.id != Cnq.locationSelected){
		path.setFill('#eee');
		path.setOpacity(0.3);
		group.moveTo(Risk.topLayer);
		Risk.topLayer.drawScene();
	}
	
}


Cnq['onTerritoryOut'] = function (path, group){
	if(path.attrs.id != Cnq.locationSelected){
		path.setFill(Risk.Settings.colors[Risk.Territories[t].color]);
		path.setOpacity(0.4);
		
		group.moveTo(Risk.mapLayer);
		Risk.topLayer.draw();
	}
}



Cnq.Router = function(msgAux){
	var  msg = JSON.parse(msgAux);
	if(msg.userId !== UserX['id']){
		
		if( msg.type === 'new_Conection'){
			debugger
		}
		//var group = Risk.stage.find("#primaryGroup")[0];
		var clicked =  Risk.stage.find("#"+msg.territory)[0];
		var group = clicked.getParent();
		
		clicked.setFill('#2E9AFE');
		clicked.setOpacity(0.6);
		group.moveTo(Risk.topLayer);
		 Risk.topLayer.drawScene();
	}
}

Cnq.SendMsg = function (path, obj){
	 socket.emit(path ,JSON.stringify(obj));
}
