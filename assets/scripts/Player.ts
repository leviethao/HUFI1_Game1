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
const GRAVITY = 1500;


@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    startVelocity: cc.Vec2;
    startPos: cc.Vec2;
    boundTime: number;
    isBound: boolean;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    }

    start () {
        this.isBound = false;
        this.startPos = this.node.position;
    }

    update (dt) {
        if (this.isBound) {
            let x = this.startVelocity.x * this.boundTime;
            let y = this.startVelocity.y * this.boundTime - 0.5 * GRAVITY * this.boundTime * this.boundTime;
    
            this.node.position = this.startPos.add(new cc.Vec2(x, y));
            this.boundTime += dt;
            if (this.node.position.y + 1 <= this.startPos.y) {
                this.node.position.y = this.startPos.y;
                this.isBound = false;
            }
        }
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
        //clear drawing
        let drawing: cc.Graphics = this.canvas.node.getChildByName("Drawing").getComponent("cc.Graphics");
        drawing.clear();

        //bound
        this.startVelocity = new cc.Vec2(-1 * (touch.getLocation().x - touch.getStartLocation().x), -2 * (touch.getLocation().y - touch.getStartLocation().y));
        this.startPos.x = this.node.position.x;
        this.boundTime = 0;
        this.isBound = true;
    }

}
