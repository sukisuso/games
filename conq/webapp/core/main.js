

PNotify.prototype.options.delay = 2500;
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


function loadUserCenter(){
	 maskGame();
	var menu = "<center> <div><table style='width:100%'><tr>" +
			"<td><button class='btnBul' onclick=''/> Bank </button></td>" +
			"<td><button class='btnBul' onclick=''/> Tower </button></td>" +
			"<td><button class='btnBul' onclick=''/> Totem </button> </td>" +
			"<tr><td class='numbertitle'>2</td><td class='numbertitle'>3</td><td class='numbertitle'>4</td></tr>" +
			"</tr></table></div></center> ";
	
	$('#closeHtm')[0].innerHTML= '<a id="closableIcon" href="#close" title="Close" class="close" style="visibility: visible;">X</a>';
   $('#modalMesage')[0].innerHTML= menu;
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


