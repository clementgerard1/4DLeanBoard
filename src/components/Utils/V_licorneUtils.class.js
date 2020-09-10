import V_audioUtils from "./V_audioUtils.class.js";
import Config from "../../../config.js";

class V_licorneUtils{

	static timeout = null;
	static active = false;

	static init(control){

		const createButton = ()=>{
			this.active = true;
			control.addControl(button);
			V_audioUtils.play("licorne1");
		};

		const button = new Autodesk.Viewing.UI.Button("licorne");
		button.setIcon("licorneButton");
		button.onClick = ()=>{
			control.removeControl(button);
			const div = document.createElement('div');
			div.style = "z-index:10000; position : absolute; top: 0px; display :flex; justify-content : center; align-items : center; background-color : rgba(255,255,255,0.7); width : 100%; height: 100%";
			const video = document.createElement('video');
			video.src = "/video/licorne.mp4";
			video.play();
			video.loop = true;
			div.appendChild(video);
			document.body.appendChild(div);

			div.addEventListener("click", ()=>{
				this.active = false;
				video.pause();
				document.body.removeChild(div);
				this.timeout = setTimeout(createButton, Config.licorne * 1000 * 60);
			});
		};

		let rotate = 0;
		const that = this;
		function step(timestamp) {
			if(that.active){
				document.body.style.filter = 'hue-rotate(' + (rotate % 360) + 'deg)';
				rotate = rotate + 10;
			}else{
				document.body.style.filter = 'hue-rotate(0deg)';
			}
		  window.requestAnimationFrame(step);
		}
		window.requestAnimationFrame(step);

		this.timeout = setTimeout(()=>{
			control.addControl(button);
			V_audioUtils.play("licorne1");
		}, Config.licorne * 1000 * 60);

		const handler = () => {
			if(this.timeout != null) clearTimeout(this.timeout);
			if(!this.active){
				this.timeout = setTimeout(createButton, Config.licorne * 1000 * 60);
			}
		}

		document.addEventListener("mousemove", handler);
		document.addEventListener("touchmove", handler);
	}


}
export default V_licorneUtils;