var Risk = {

    /**
     * Settings Object, holding application wide settings
     */
    Settings :{
        globalScale: 1,
        colors: {yellow: '#ff0', green: '#0f0', blue: '#00f', red: '#f00', purple: '#f0f', cyan: '#00ffe4'},
    },

    /**
     * Our main Territories object
     * It looks like:
     * Territories: {
     *     Alaska: {path: Object, color: String, name: 'Alaska', ...},
     *     ... 
     *  }
     */
    Territories: {},

    stage: null,
    mapLayer: null,
    topLayer:  null,
    backgroundLayer: null,

    init: function() {
        //Initiate our main Territories Object, it contains essential data about the territories current state
        
        Risk.setUpTerritoriesObj();

        //Initiate a Kinetic stage
        Risk.stage = new Kinetic.Stage({
            container: 'map',
            width: 1920,
            height: 1080
        });

        Risk.mapLayer = new Kinetic.Layer({
            scale: Risk.Settings.globalScale
        });

        Risk.topLayer = new Kinetic.Layer({
            scale: Risk.Settings.globalScale
        });

        Risk.drawBackgroundImg();
        Risk.drawTerritories();

        Risk.stage.add(Risk.backgroundLayer);
        Risk.stage.add(Risk.mapLayer);
        Risk.stage.add(Risk.topLayer);

        Risk.mapLayer.draw();

        Risk.divideTerritories();
    },

    /**
     * Initiate the  Risk.Territories Object, this will contain essential informations about the territories 
     */
    setUpTerritoriesObj: function() {
        for(id in TerritoryNames) {

            var pathObject = new Kinetic.Path({
                data: TerritoryPathData[id].path,
                id: id //set a unique id --> path.attrs.id
            });

            //Using a sprite image for territory names
            //see: drawImage() -- https://developer.mozilla.org/en-US/docs/Canvas_tutorial/Using_images , and see Kinetic.Image() docs for more
            var sprite = new Image();
            sprite.src = 'resources/img/names.png';
            var territoryNameImg = new Kinetic.Image({
                //image: sprite,
                x: FontDestinationCoords[id].x,
                y: FontDestinationCoords[id].y,
                width: FontSpriteCoords[id].sWidth, //'destiantion Width' 
                height: FontSpriteCoords[id].sHeight, //'destination Height'
                crop: [FontSpriteCoords[id].sx, FontSpriteCoords[id].sy, FontSpriteCoords[id].sWidth, FontSpriteCoords[id].sHeight]

            });

            Risk.Territories[id] = {
                name: TerritoryNames[id],
                path: pathObject,
                nameImg: territoryNameImg,
                color: null,
                neighbours: Neighbours[id],
                armyNum: null
            };
        }
        
    },

    drawBackgroundImg: function() {
        Risk.backgroundLayer = new Kinetic.Layer({
            scale: Risk.Settings.globalScale
        });
        var imgObj = new Image();
        imgObj.src = 'resources/img/map_grey.jpg';
        
        var img = new Kinetic.Image({
            image: imgObj,
            alpha: 0.7
        });
        Risk.backgroundLayer.add(img);
    },

    drawTerritories: function() {
        for (t in Risk.Territories) {
            
            var path = Risk.Territories[t].path;
            var nameImg = Risk.Territories[t].nameImg;
            var group = new Kinetic.Group();

            //We have to set up a group for proper mouseover on territories and sprite name images 
            group.setId("primaryGroup")
            group.add(path);
            group.add(nameImg);
            Risk.mapLayer.add(group);
        
            //Basic animations 
            //Wrap the 'path', 't' and 'group' variables inside a closure, and set up the mouseover / mouseout events for the demo
            //when you make a bigger application you should move this functionality out from here, and maybe put these 'actions' in a seperate function/'class'
            (function(path, t, group) {
                group.on('mouseover', function() {
                	Cnq.onTerritoryOver(path, group);
                });

                group.on('mouseout', function() {
                	Cnq.onTerritoryOut(path, group);
                });

                group.on('click', function() {
                   Cnq.onTerritoryClick(path, group);
                });
            })(path, t, group);
        }               
    },

    divideTerritories: function() {

        fillRandomColors();

      /*  for(var id in Risk.Territories) {
            var color = Risk.Territories[id].color;
            
            var neighbours = Risk.Territories[id].neighbours;

            //a VERY simple algorithm to make the map more equal
           /* var similarNeighbours = 0;
            for(var i = 0; i < neighbours.length; i++) {

                var currNeighbour = neighbours[i];
                if (Risk.Territories[currNeighbour].color == color) {
                    similarNeighbours++;
                }
            }*/

            //how many similar neighbours we allow
           /* if (similarNeighbours > 2) {
                var newColor = getRandomColor();
               // while (color == newColor) {
                 //   var newColor = getRandomColor();
                //}
                Risk.Territories[id].color = 'yellow';

                Risk.Territories[id].path.setFill('yellow'/*Risk.Settings.colors[newColor]);
              /*  Risk.Territories[id].path.setOpacity(0.4);              
            }
        }*/

        Risk.mapLayer.draw();

        function fillRandomColors() {
            for(var id in Risk.Territories) {
                //var color = getRandomColor();
                Risk.Territories[id].color = 'yellow';
                Risk.Territories[id].path.setFill('yellow'/*Risk.Settings.colors[color]*/);
                Risk.Territories[id].path.setOpacity(0.4);          

            }
        }

        /**
         * Returns a color name like 'yellow'
                 function getRandomColor() {
            var colors = ['yellow', 'red', 'blue'];
            //Math.random() returns between [0, 1), so don't worry
            var randomNum = Math.floor(Math.random()*(colors.length)); 
            return colors[randomNum];
        }*/

    }
}


function AssetManager() {
	this.downloadQueue = [];
	this.successCount  = 0;
	this.errorCount    = 0;
	this.cache = {};
}

AssetManager.prototype.queueDownload = function(path) {
	this.downloadQueue.push(path); 
}

AssetManager.prototype.downloadAll = function(downloadCallback) {
	//if no assets
	if (this.downloadQueue.length === 0) {
	    downloadCallback();
	}

	for (var i = 0; i < this.downloadQueue.length; i++) {
		var path = this.downloadQueue[i];
		var img  = new Image();
		var that = this;
		img.addEventListener("load", function(){
			that.successCount += 1;
			if (that.isDone()) {
				downloadCallback();
			}
		}, false);
		img.addEventListener("error", function(){
			that.errorCount += 1;
			if (that.isDone()) {
				downloadCallback();
			}
		}, false);
		img.src = path;
		this.cache['path'] = img;
	};
};

AssetManager.prototype.isDone = function() {
	return (this.downloadQueue.length == this.successCount + this.errorCount);
};

AssetManager.prototype.getAsset = function(path) {
	return this.cache[path];
};

