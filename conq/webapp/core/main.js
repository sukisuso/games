


var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload('resources/img/map_grey.jpg');
ASSET_MANAGER.queueDownload('resources/img/castle.png');

ASSET_MANAGER.downloadAll(function() {
	Risk.init();
	$("#overlay").fadeOut('slow');
	maskGame();
	initState();
});



function maskGame(){
	location.hash = '#openModal';
};

function unmaskGame(){
	location.hash = '#close';
};


function initState(){
	$('#modalMesage')[0].innerHTML= "<center><p>Esperando rival...</p></br><img src=resources/img/load.gif></center>";
}

function readyState(msg1, msg2){
	if(msg1 === undefined){msg1 = 'Partida preparada';}
	if(msg2 === undefined){msg2 = 'Start';}
	$('#modalMesage')[0].innerHTML= "<center><p>"+msg1+"</p></br><button class='btnBul' onclick='unmaskGame(); Cnq.yourTurn();'/>"+msg2+"</center>";
}

function waitingTurn(){
	$('#modalMesage')[0].innerHTML= "<center><p>Esperando turno...</p></br><img src=resources/img/load.gif></center>";
}

function winStage(){
	$('#modalMesage')[0].innerHTML= "<center><p>VICTORIA</p></center>";
}

function loseStage(){
	$('#modalMesage')[0].innerHTML= "<center><p>DERROTA</p></center>";
}

/*UTILS*/

function remove(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


