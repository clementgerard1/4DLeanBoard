import Utils from "../../../class/Utils.class.js";
import Memory from "./Memory.class.js";

class Camera{

    #id;
    #target;

    constructor(id = Utils.getId("forgeCamera")) {
        this.#target = Memory.getViewer().navigation.getPivotPoint();
    }

    setTarget(tar) {
        Memory.getViewer().navigation.setPivotPoint(tar);
    }

    getTarget() {
        return this.#target;
    }
}
export default Camera;