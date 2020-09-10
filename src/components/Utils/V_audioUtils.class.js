class V_audioUtils{

	static sounds = {
		"licorne1" : "/sounds/licorne1.mp3",
	}

	static play(name){
		const audio = document.createElement('audio');
		audio.src = this.sounds[name];
		audio.volume = 0.1;
		audio.play();
	}

}
export default V_audioUtils;