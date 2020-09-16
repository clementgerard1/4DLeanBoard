class V_filterMenuUtils{

	static teamsDisplayed = [];
	static layersDisplayed = [];
	static teams = [];

	static filters = [];

	static addFilter(filter){
		this.filters.push(filter);
	}

	static setAllTeams(teams){
		this.teams = teams;
		for(let t in teams){
			this.teamsDisplayed[teams[t].getId()] = teams[t];
		}
	}

	/**
		Add team displayed to the list by id
		@param {uint} teamId id of the taskTeam
		@param {bool}
		@static
	*/
	static setTeamDisplayedById(teamId, bool){
		for( let t in this.teams){
			if(this.teams[t].getId() == teamId) {
				V_filterMenuUtils.setTeamDisplayed(this.teams[t], bool);
			}
		}
	}

	/**
		Add team displayed to the list
		@param {TaskTeam} team  
		@param {bool}
		@static
	*/
	static setTeamDisplayed(team, bool){
		if(bool){
			this.teamsDisplayed[team.getId()] = {
				team : team,
			};
		}else{
			delete this.teamsDisplayed[team.getId()];
		}
		for(let f in this.filters){
			this.filters[f].setTeamsSelected(this.teamsDisplayed);
		}
		
	}

	static setCameraLocked(bool){
		for(let f in this.filters){
			this.filters[f].setCameraLocked(bool);
		}
	}



	/**
		Change menu ifc choices
		@param {bool} archi
		@param {bool} struct
		@param {bool} mep
		@param {bool} construction
	*/
	static setIfcMenuChange(archi, struct, mep, construction){
		for(let f in this.filters){
			this.filters[f].setIfcMenuChange(archi, struct, mep, construction);
		}
	}

	/**
		Change menu planning choice
		@param {int} choice
	*/
	static setPlanningMenuChange(choice){
		for(let f in this.filters){
			this.filters[f].setPlanningMenuChange(choice);
		}
	}

	/**
		Change display menu choice (basic or team)
		@param {int} choice
	*/
	static setDisplayMenuChange(choice){
		for(let f in this.filters){
			this.filters[f].setDisplayMenuChange(choice);
		}
	}

	static setLayerDisplayed(layer, bool){
		for(let f in this.filters){
			this.filters[f].setLayerDisplayed(layer, bool);
		}
	}

	static setZoneDisplayed(zone, bool){
		console.log(zone, bool);
		for(let f in this.filters){
			this.filters[f].setZoneDisplayed(zone, bool);
		}
	}

	static setConstructionStateDisplayed(constructionState, bool){
		for(let f in this.filters){
			this.filters[f].setConstructionStateDisplayed(constructionState, bool);
		}
	}

}
export default V_filterMenuUtils;