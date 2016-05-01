


var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload('resources/img/map_grey.jpg');
ASSET_MANAGER.queueDownload('resources/img/castle.png');

ASSET_MANAGER.downloadAll(function() {
	Risk.init();
	$("#overlay").fadeOut('slow');
	maskGame();
});



function maskGame(){
	$( "body" ).addClass( "mask" );
};

function unmaskGame(){
	
};

