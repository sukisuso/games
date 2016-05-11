/**
 * 
 */

var UserX = {};
UserX['id'] = new Date().getSeconds();
UserX['money'] = 1;
UserX['rivalId'] = null;
UserX['localTerritories'] = [];
UserX['rivalTerritories'] = [];
UserX['']

var Cnq = {};
Cnq['locationSelected'] = "";
Cnq['blink'] = null;

Cnq['onTerritoryClick'] = function(path , group){
	var battle = true;
	if(UserX['money'] > 0 && Cnq.terIsNeighbour(path.attrs.id)){
		UserX['money'] --;
		
		location.hash = path.attrs.id;
		Cnq.locationSelected = path.attrs.id;
		 
	     if(Cnq.terIsRival(Cnq.locationSelected)){
	    	 //SIMULATE BATLE.
	    	 battle = Cnq.conquestBatle(Cnq.locationSelected);
	    	
	    	if(UserX['rivalTerritories'].length == 0){
	    		 winStage();
	    		 maskGame();
	    		 Cnq.stopBlink();
	    		 Cnq.SendMsg('game message',{userId:UserX['id'], type:'end_game'});
	    	}
	     }else{
	    	 UserX['localTerritories'].push(path.attrs.id);
	     }
	     
	     if(battle)
	     Cnq.SendMsg('game message',{userId:UserX['id'], type:'movement', type_move: 'conquer', idTer: Cnq.locationSelected});
	     
	     if(UserX['money'] == 0){
	    	 Cnq.stopBlink();
	     }
	     Risk.topLayer.drawScene();
	}else{
		if(!Cnq.terIsNeighbour(path.attrs.id)){
			Cnq.Notify("Error", "Seleccione un territorio Valido", "error");
		}else{
			Cnq.Notify("No Money", "No te queda dinero!", "info");
		}
	}
	
	Cnq.reloadMoneyValue();
     
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
			Cnq.calculateMoney();
		}else if(msg.type === 'init_game'){
			//Pintar Territorios
			Cnq.paintFirtStep(msg.idFirstPlayer == UserX.id, msg);
			
			if(msg.idFirstPlayer == UserX.id){
				readyState();
			}else{
				waitingTurn();
			}
		}else if (msg.type == 'end_game' && msg.userId == UserX.rivalId){
			loseStage();
		}else if(msg.type == 'movement' && msg.userId  == UserX.rivalId){
			Cnq.movementRouter(msg);
		}
	}
}

Cnq.SendMsg = function (path, obj){
	 socket.emit(path ,JSON.stringify(obj));
}

Cnq.finishTurn = function () {
	clearInterval(Cnq.blink);
	Cnq.clearNeighbours();
	Cnq.repaintLocal();
	Cnq.repaintRival();
	
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
//	Risk.topLayer.drawScene();
}

Cnq.pintarRival = function (id){
	var clicked =  Risk.stage.find("#"+id)[0];
	var group = clicked.getParent();
	
	clicked.setFill('#ff0000');
	clicked.setOpacity(0.6);
	group.moveTo(Risk.topLayer);
//	Risk.topLayer.drawScene();
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
	Risk.topLayer.drawScene();
}

Cnq.terIsLocal = function(id){
	return UserX.localTerritories.indexOf(id) > -1;
}

Cnq.terIsRival= function(id){
	return UserX.rivalTerritories.indexOf(id) > -1;
}

Cnq.terIsUsed = function (id){
	var local = (UserX.localTerritories.indexOf(id) > -1);
	var rival = (UserX.rivalTerritories.indexOf(id) > -1);
	
	return local || rival;
}
Cnq.terIsNeighbour = function(id){
	for(var i in UserX.localTerritories){
		for(var j in Neighbours[ UserX.localTerritories[i]]){
			if(id === Neighbours[ UserX.localTerritories[i]][j])
				return true;
		}
	}
	return false
}


Cnq.yourTurn = function(){
	if(UserX['money'] > 0){
		var cont = 0;
		Cnq.blink = setInterval(function(){ 
			if(cont %2 == 0){
				Cnq.paintBlink('#eefe', 0.3);
			}else{
				Cnq.clearNeighbours("#58ACFA",  0.3);
				Cnq.repaintRival();
			}
			Cnq.repaintLocal();
			Risk.topLayer.drawScene();
			cont++;
		}, 600);
	}
}

Cnq.paintBlink = function (fill, opacity){
	for(var i in UserX.localTerritories){
		for(var j in Neighbours[ UserX.localTerritories[i]]){
			
			var id = Neighbours[ UserX.localTerritories[i]][j];
			if(!UserX.localTerritories.indexOf(id) > -1){
				
				var clicked =  Risk.stage.find("#"+id)[0];
				group = clicked.getParent();
				
				clicked.setFill(fill);
				clicked.setOpacity(opacity);
				group.moveTo(Risk.topLayer);
			}
		}
	}
	Risk.topLayer.drawScene();
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
		}
	}
	Risk.topLayer.drawScene();
}

Cnq.repaintLocal = function(){
	for(var i in UserX.localTerritories){
		var id =  UserX.localTerritories[i];
		Cnq.pintarLocal(id);
	}
	Risk.topLayer.drawScene();
}

Cnq.repaintRival = function(){
	for(var i in UserX.rivalTerritories){
		var id =  UserX.rivalTerritories[i];
		Cnq.pintarRival(id);
	}
	Risk.topLayer.drawScene();
}

Cnq.reloadMoneyValue = function () {
	$('#moneyValue')[0].innerHTML = UserX.money;
}

Cnq.calculateMoney = function(){
	if(UserX.localTerritories.length <8){
		UserX['money'] =  UserX.localTerritories.length;
	}else if(UserX.localTerritories.length < 16){
		UserX['money'] =  Math.floor(UserX.localTerritories.length/2);
	}else{
		UserX['money'] =  Math.floor(UserX.localTerritories.length/2.6);
	}
	$('#moneyValue')[0].innerHTML = UserX.money;
}

Cnq.stopBlink = function(){
	clearInterval(Cnq.blink);
	Cnq.clearNeighbours();
	Cnq.repaintLocal();
	Cnq.repaintRival();
}

Cnq.movementRouter = function (msg){
	
	if(msg.type_move== 'conquer'){
		if(Cnq.terIsLocal(msg.idTer)){
			remove(UserX.localTerritories, msg.idTer);
			UserX.rivalTerritories.push(msg.idTer);
		}else{
			UserX.rivalTerritories.push(msg.idTer);
		}
	}
	Cnq.repaintLocal();
	Cnq.repaintRival();
	Risk.topLayer.drawScene();
}

Cnq.conquestBatle = function (id){
	var atack = getRandomInt(0,11);
	var deff = getRandomInt(0,4);
	console.log("ATAC = " +atack + " DEFF = "+  deff);
	
	if(atack > deff){
		remove( UserX['rivalTerritories'], Cnq.locationSelected);
		UserX['localTerritories'].push(id);
		Cnq.pintarLocal(id);
		Cnq.Notify("Conquista", "Has conquistado un territorio", "succes");
		return true;
	}else{
		var money = Math.floor(UserX['money'] /3);
		UserX['money']  = money;
		Cnq.Notify("Derrota", "Has perdido la batalla", "error");
		return false;
	}
}


Cnq.Notify = function (title , body ,type ){
	new PNotify({
		 title : title,
	     text : body,
	     type :type
	     
	});
}