class Tool extends Autodesk.Viewing.ToolInterface {

    constructor(viewer) {
        super();
        this.names = ['tool'];
        this.viewer = viewer;
        this.minZoom = 15;
        this.maxZoom = 200;
        this.minAngle = 1.1;
        this.maxAngle = 2.14;
 
        this.previousDragY = null;
        this.previousPinchDistance = null;

        // Hack: delete functions defined *on the instance* of the tool.
        // We want the tool controller to call our class methods instead.
        delete this.register;
        delete this.deregister;
        delete this.activate;
        delete this.deactivate;
        delete this.getPriority;
        delete this.handleMouseMove;
        delete this.handleButtonDown;
        delete this.handleButtonUp;
        delete this.handleSingleClick;
        //delete this.handleWheelInput;
        delete this.handleGesture;
    }
 
    register() {
        console.log('DrawTool registered.');
    }
 
    deregister() {
        console.log('DrawTool unregistered.');
    }
 
    activate(name, viewer) {
        console.log('DrawTool activated.');
    }
 
    deactivate(name) {
        console.log('DrawTool deactivated.');
    }
 
    getPriority() {
        return 42; // Or feel free to use any number higher than 0 (which is the priority of all the default viewer tools)
    }
 
    update(highResTimestamp) {
        return false;
    }
 
    handleMouseMove(event) {
        return false;
    }

    handleWheelInput(delta) {
    	const deltaa = -Math.min(delta, 9);
    	const vec = this.viewer.navigation.getEyeToCenterOfBoundsVec(this.utilities.getBoundingBox());
    	const distance = vec.distanceTo(new THREE.Vector3( 0, 0, 0 ));
    	if((distance < this.maxZoom && deltaa > 0) || (distance > this.minZoom && deltaa < 0) ){
    		this.viewer.navigation.setPosition( new THREE.Vector3( -vec.x * (1 + ((deltaa / 3) / 20)), -vec.y * (1 + ((deltaa / 3) / 20)), -vec.z * (1 + ((deltaa / 3) / 20)) ) );
    		this.viewer.navigation.updateCamera();
    		this.viewer.impl.invalidate(true);
    	}
    	return true;
    };
 
 	handleGesture(event){
 		//console.log(event.type);
 		if(event.type == "pinchmove" || event.type == "pinchstart" || event.type == "pinchend"){
	    	const vec = this.viewer.navigation.getEyeToCenterOfBoundsVec(this.utilities.getBoundingBox());
	    	const distance = vec.distanceTo(this.utilities.getBoundingBox().center());
	    	let deltaa = 0;
	    	if(this.previousPinchDistance != null){
	    		deltaa = this.previousPinchDistance - event.distance;
	    	}
	    	if(event.type != "pinchend"){
	    		this.previousPinchDistance = event.distance;
	    	}else{
	    		this.previousPinchDistance = null;
	    	}
	    	if((distance < this.maxZoom && deltaa > 0) || (distance > this.minZoom && deltaa < 0) ){

	    		this.viewer.navigation.setPosition( new THREE.Vector3( -vec.x * (1 + (deltaa / 20)), -vec.y * (1 + (deltaa / 20)), -vec.z * (1 + (deltaa / 20)) ) );
	    		this.viewer.navigation.updateCamera();
	    		this.viewer.impl.invalidate(true);
	    	}
	    	return true;
 		}/*}else if(event.type == "dragstart" || event.type == "dragend" || event.type == "dragmove"){
 			
 			//console.log(event.type);

 			let delta = 0;
 			if(this.previousDragY != null){
 				delta = this.previousDragY - event.deltaY;
 			}
 			this.previousDragY = event.deltaY;
 			if(delta != 0){
 				const vec = this.viewer.navigation.getEyeToCenterOfBoundsVec(this.utilities.getBoundingBox());
	 			const angle = vec.angleTo(new THREE.Vector3( 0, 0, 1 ));
	 			if((angle > this.minAngle && delta < 0) || (angle < this.maxAngle && delta > 0)){
	 				const init = this.viewer.navigation.getPosition();
	 				this.viewer.navigation.applyRotation(init, delta / 20, this.utilities.getBoundingBox().center(), new THREE.Vector3( 1, 0, 0 ));
	 				//this.viewer.navigation.setPosition(init);
		    		this.viewer.navigation.updateCamera();
		    		this.viewer.impl.invalidate(true);
		    		//return true;
	 			}
 			}else{
 				return true;
 			}
 			
 		}*/
 		return false;
 	}
 
    handleButtonDown(event, button) {
        return false;
    }
 
    handleButtonUp(event, button) {
        return false;
    }
 
    handleSingleClick(event, button) {
        return false;
    }
 
    _update() {
        // Here we will be updating the actual geometry
    }
}

export default Tool;