/**
 * 
 */
var TerritoryNames = ['Alaska', 'North West Territory', 'Alberta', 'Ontario','Greenland', 'Quebec','Western United States', 'Eastern United States', 'Central America',
                      'Peru', 'Brazil', 'Venezuela', 'Argentina','North Africa', 'Egypt', 'Congo','East Africa', 'South Africa','Iceland', 'Great Britain','Western Europe',
                       'Northern Europe', 'Southern Europe', 'Scandinavia', 'Madagascar', 'Middle East', 'Afghanistan', 'Ural', 'India','Siam', 'China','Mongolia',
                       'Irkutsk','Yakutsk', 'Siberia', 'Kamchatka','Indonesia', 'New Guinea', 'Western Australia', 'Eastern Australia'];


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