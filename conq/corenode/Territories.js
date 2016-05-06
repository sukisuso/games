/**
 * 
 */
var TerritoryNames = ['Alaska', 'NorthWestTerritory', 'Alberta', 'Ontario','Greenland', 'Quebec','WesternUnitedStates', 'EasternUnitedStates', 'CentralAmerica',
                      'Peru', 'Brazil', 'Venezuela', 'Argentina','NorthAfrica', 'Egypt', 'Congo','EastAfrica', 'SouthAfrica','Iceland', 'GreatBritain','WesternEurope',
                       'NorthernEurope', 'SouthernEurope', 'Scandinavia', 'Madagascar', 'MiddleEast', 'Afghanistan', 'Ural', 'India','Siam', 'China','Mongolia',
                       'Irkutsk','Yakutsk', 'Siberia', 'Kamchatka','Indonesia', 'NewGuinea', 'WesternAustralia', 'EasternAustralia'];


var getCoupleTerritories = function (){
	var one = Math.floor(Math.random() * (TerritoryNames.length-1));
	var two = Math.floor(Math.random() * (TerritoryNames.length-1));
	var couple = [];
	
	if(one == two){
		if(two == TerritoryNames.lenthg-1){
			two --;
		}else {
			two ++;
		}
	}

	couple.push(TerritoryNames[one]);
	couple.push(TerritoryNames[two]);
	
	return couple;
}

module.exports.randomTer = getCoupleTerritories;