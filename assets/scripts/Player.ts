// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    }

    start () {

    }

    update (dt) {

    }

    onTouchStart (touch: cc.Event.EventTouch) {
    }

    onTouchMove (touch: cc.Event.EventTouch) {
        let drawing: cc.Graphics = this.canvas.node.getChildByName("Drawing").getComponent("cc.Graphics");
        let startLoc = this.canvas.node.convertToWorldSpace(touch.getStartLocation());
        startLoc = drawing.node.convertToNodeSpaceAR(startLoc);
        let curLoc = this.canvas.node.convertToWorldSpace(touch.getLocation());
        curLoc = drawing.node.convertToNodeSpaceAR(curLoc);
        
        drawing.clear();
        //drawing.lineWidth = 6;
        drawing.moveTo(startLoc.x, startLoc.y);
        drawing.lineTo(curLoc.x, curLoc.y);
        //drawing.strokeColor = cc.Color.RED;
        drawing.stroke();
    }

    onTouchEnd (touch: cc.Event.EventTouch) {
        let drawing: cc.Graphics = this.canvas.node.getChildByName("Drawing").getComponent("cc.Graphics");
        drawing.clear();
    }

}
