class V_filterMenuUtils{

	static teamsDisplayed = [];
	static layersDisplayed = [];
	static teams = [];

	static filters = [];

	static addFilter(filter){
		this.filters.push(filter);
	}

	static setAllTeams(teams){
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
		for( let t in this.teamsDisplayed){
			if(this.teamsDisplayed[t] != null && t == teamId) {
				V_filterMenuUtils.setTeamDisplayed(this.teamsDisplayed[t], bool);
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

	/**
		Add layer displayed to the list
		@param {TaskTeam} team  
		@param {bool}
		@static
	*/
	static setLayerDisplayed(layer, bool){
		if(bool){
			this.layersDisplayed[layer] = {
				layer : layer,
			};
		}else{
			delete this.layersDisplayed[layer];
		}
		for(let f in this.filters){
			this.filters[f].setLayersSelected(this.layersDisplayed);
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

}
export default V_filterMenuUtils;