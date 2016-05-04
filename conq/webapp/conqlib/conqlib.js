/**
 * 
 */

var UserX = {};
UserX['id'] = new Date().getSeconds();
UserX['money'] = null;
UserX['rivalId'] = null;

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

		if( msg.type === 'new_Conection' && UserX.rivalId == null){
			UserX.rivalId = msg.userId;
			Cnq.SendMsg('game message', {userId : UserX.id,	type : 'start_game', other:UserX.rivalId});
			 
			
		}else if(msg.type === 'start_game' && msg.other == UserX.id){
			UserX.rivalId = msg.userId;

		}else if (msg.type === 'new_Turno' && msg.userId == UserX.rivalId){
			readyState('Tu turno...', 'Continuar');
			
		}else if(msg.type === 'init_game'){
			//Pintar Territorios
			Cnq.paintFirtStep(msg.idFirstPlayer == UserX.id, msg);
			
			if(msg.idFirstPlayer == UserX.id){
				readyState();
			}else{
				waitingTurn();
			}
		}
		
		//var group = Risk.stage.find("#primaryGroup")[0];
		/*var clicked =  Risk.stage.find("#"+msg.territory)[0];
		var group = clicked.getParent();
		
		clicked.setFill('#2E9AFE');
		clicked.setOpacity(0.6);
		group.moveTo(Risk.topLayer);
		 Risk.topLayer.drawScene();*/
	}
}

Cnq.SendMsg = function (path, obj){
	 socket.emit(path ,JSON.stringify(obj));
}

Cnq.finishTurn = function () {
	Cnq.SendMsg('game message', {userId : UserX.id,	type : 'new_Turno'});
	waitingTurn();
	maskGame();
}


Cnq.pintarLocal = function (id){
    var clicked =  Risk.stage.find("#"+id)[0];
	var group = clicked.getParent();
	
	clicked.setFill('#2E9AFE');
	clicked.setOpacity(0.6);
	group.moveTo(Risk.topLayer);
	Risk.topLayer.drawScene();
}

Cnq.pintarRival = function (id){
	var clicked =  Risk.stage.find("#"+id)[0];
	var group = clicked.getParent();
	
	clicked.setFill('#ff0000');
	clicked.setOpacity(0.6);
	group.moveTo(Risk.topLayer);
	Risk.topLayer.drawScene();
}


Cnq.paintFirtStep = function (local, obj){
	if(local){ 
		Cnq.pintarLocal(obj.firstPlayerTerr);
		Cnq.pintarRival(obj.secondPlayerTerr);
	}else{
		Cnq.pintarLocal(obj.secondPlayerTerr);
		Cnq.pintarRival(obj.firstPlayerTerr);
	}
}