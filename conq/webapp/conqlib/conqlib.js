/**
 * 
 */

var UserX = {};
UserX['id'] = new Date().getSeconds();
UserX['money'] = 1;
UserX['rivalId'] = null;
UserX['localTerritories'] = [];
UserX['rivalTerritories'] = [];

var Cnq = {};
Cnq['locationSelected'] = "";
Cnq['previousSelected'] = "";
Cnq['blink'] = null;

Cnq['onTerritoryClick'] = function(path , group){
	 
	clearInterval(Cnq.blink);
	Cnq.clearNeighbours();
	Cnq.repaintLocal();
	
	 
     location.hash = path.attrs.id;
     Cnq.previousSelected= Cnq.locationSelected;
     Cnq.locationSelected = path.attrs.id;
     
     UserX['localTerritories'].push(path.attrs.id);
     
   /*  Cnq.SendMsg('game message',{userId:UserX['id'], type:'click', territory:path.attrs.id});
     
     
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
     
     
    /* path.setFill('#2E9AFE');
     path.setOpacity(0.6);
     group.moveTo(Risk.topLayer);
     Risk.topLayer.drawScene();*/
     
     Cnq.pintarLocal(path.attrs.id);
     Cnq.yourTurn();
}

Cnq['onTerritoryOver'] = function (path, group){
	if( !Cnq.terIsUsed(path.attrs.id)){
		path.setFill('#eee');
		path.setOpacity(0.3);
		group.moveTo(Risk.topLayer);
		Risk.topLayer.drawScene();
	}
	
}


Cnq['onTerritoryOut'] = function (path, group){
	if( !Cnq.terIsUsed(path.attrs.id)){
		
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
	clearInterval(Cnq.blink);
	Cnq.clearNeighbours();
	Cnq.repaintLocal();
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
		UserX.localTerritories.push(obj.firstPlayerTerr);
		UserX.rivalTerritories.push(obj.secondPlayerTerr);
		Cnq.pintarLocal(obj.firstPlayerTerr);
		Cnq.pintarRival(obj.secondPlayerTerr);
	}else{
		UserX.localTerritories.push(obj.secondPlayerTerr);
		UserX.rivalTerritories.push(obj.firstPlayerTerr);
		Cnq.pintarLocal(obj.secondPlayerTerr);
		Cnq.pintarRival(obj.firstPlayerTerr);
	}
}


Cnq.terIsUsed = function (id){
	var local = (UserX.localTerritories.indexOf(id) > -1);
	var rival = (UserX.rivalTerritories.indexOf(id) > -1);
	
	return local || rival;
}


Cnq.yourTurn = function(){
	var cont = 0;
	Cnq.blink = setInterval(function(){ 
		if(cont %2 == 0){
			Cnq.paintBlink('#eefe', 0.3);
		}else{
			Cnq.clearNeighbours("#58ACFA",  0.3);
		}
		Cnq.repaintLocal();
		cont++;
	}, 550);
}

Cnq.paintBlink = function (fill, opacity){
	
	for(var i in UserX.localTerritories){
		for(var j in Neighbours[ UserX.localTerritories[i]]){
			
			var id = Neighbours[ UserX.localTerritories[i]][j];
			if(!UserX.localTerritories.indexOf(id) > -1){
				
				var clicked =  Risk.stage.find("#"+id)[0];
				var group = clicked.getParent();
				
				clicked.setFill(fill);
				clicked.setOpacity(opacity);
				group.moveTo(Risk.topLayer);
				Risk.topLayer.drawScene();
			}
		}
	}
}

Cnq.clearNeighbours = function (){
	for(var i in UserX.localTerritories){
		for(var j in Neighbours[ UserX.localTerritories[i]]){
			var id = Neighbours[ UserX.localTerritories[i]][j];
			
			var clicked =  Risk.stage.find("#"+id)[0];
			var group = clicked.getParent();
			
			clicked.setFill(Risk.Settings.colors ["yellow"]);
			clicked.setOpacity(0.4);
			group.moveTo(Risk.mapLayer);
			Risk.topLayer.drawScene();
		}
	}
}

Cnq.repaintLocal = function(){
	for(var i in UserX.localTerritories){
		var id =  UserX.localTerritories[i];
		Cnq.pintarLocal(id);
	}
}