class V_blockUtils{


	static blocks = {};
	
	static addBlock(blockPage){
		if(blockPage != null){
			this.blocks[blockPage._uid] = blockPage;
		}
	}

	static setDisplay(bool){
		for(let b in this.blocks){
			this.blocks[b].setDisplay(bool);
		}
	}

}
export default V_blockUtils;