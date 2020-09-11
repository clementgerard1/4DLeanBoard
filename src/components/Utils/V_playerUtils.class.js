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

	static highlightTask(task, display){
		for(let p in this.players){
			this.players[p].highlightTask(task, display);
		}
	}

	static displayMilestoneInfo(milestoneId, bool){
		for(let p in this.players){
			this.players[p].displayMilestoneInfo(milestoneId, bool);
		}
	}

}
export default V_playerUtils;
