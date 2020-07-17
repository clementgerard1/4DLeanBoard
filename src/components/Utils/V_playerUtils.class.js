class V_playerUtils{

	static players = [];

	static addPlayer(player){
		this.players.push(player);
	}

	
	static displayMilestones(bool){
		for(let p in this.players){
			this.players[p].displayMilestones(bool);
		}
	}

}
export default V_playerUtils;
