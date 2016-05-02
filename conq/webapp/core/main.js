


var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload('resources/img/map_grey.jpg');
ASSET_MANAGER.queueDownload('resources/img/castle.png');

ASSET_MANAGER.downloadAll(function() {
	Risk.init();
	$("#overlay").fadeOut('slow');
	maskGame();
	initState()
});



function maskGame(){
	location.hash = '#openModal';
};

function unmaskGame(){
	location.hash = '#close';
};


function initState(){
	$('#modalMesage')[0].innerHTML= "<center><p>Esperando rival...</p></br><img src=resources/img/load.gif></center>"
}

function readyState(){
	$('#modalMesage')[0].innerHTML= "<center><p>Partida preparada</p></br><button class='btnBul'/>Start</center>"
}