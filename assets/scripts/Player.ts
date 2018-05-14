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

    @property
    runSpeed: number = 0;

    @property({url: cc.AudioClip})
    jumpAudio: cc.AudioClip = null;

    @property(cc.SpriteFrame)
    jumpSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    normalSpriteFrame: cc.SpriteFrame = null;


    startVelocity: cc.Vec2;
    startPos: cc.Vec2;
    boundTime: number;
    isBound: boolean;
    isCollided: boolean;
    defaultPositionY: number;
    oldCNVGrounding = null;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));

        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
    }

  

    start () {
        this.defaultPositionY = this.node.y;
        this.isBound = false;
        this.isCollided = false;
        this.startPos = this.node.position;
        this.node.SpriteFrame = this.jumpSpriteFrame;
    }

    update (dt) {

        //check if game over
        if (this.node.y <= -this.canvas.node.height / 2) {
            if (this.canvas.getComponent("GameManager").isGameOver == false) {
                this.canvas.getComponent("GameManager").isGameOver = true;
                this.gameOver();
            }
            return;
        }

        if (this.canvas.getComponent("GameManager").isGameOver) {
            return;
        }

        if (!this.isBound) {
            this.node.y -= 2; //gravity
        }

        if (this.isBound) {
            if (this.isCollided) {
                //this.node.position.y = this.startPos.y;
                this.isBound = false;
                this.isCollided = false;
                return;
            }

            let x = this.startVelocity.x * this.boundTime;
            let y = this.startVelocity.y * this.boundTime - 0.5 * GRAVITY * this.boundTime * this.boundTime;
    
            this.node.position = this.startPos.add(new cc.Vec2(x, y));
            this.boundTime += dt;
        }

        //player run
        //this.node.x += this.runSpeed * dt;
    }

    onTouchStart (touch: cc.Event.EventTouch) {
        
    }

    onTouchMove (touch: cc.Event.EventTouch) {
        //Check game over and game pause
        let game = this.canvas.getComponent("GameManager");
        if (game.isGameOver || game.isGamePause) {
            return;
        }

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
        //check game over and game pause
        let game = this.canvas.getComponent("GameManager");
        if (game.isGameOver || game.isGamePause) {
            return;
        }
        
        //clear drawing
        let drawing: cc.Graphics = this.canvas.node.getChildByName("Drawing").getComponent("cc.Graphics");
        drawing.clear();

        //bound
        this.startVelocity = new cc.Vec2(-1 * (touch.getLocation().x - touch.getStartLocation().x), -2 * (touch.getLocation().y - touch.getStartLocation().y));
        if (this.startVelocity.y < 0) {
            return;
        }
        this.startPos = this.node.position;
        this.boundTime = 0;
        this.isBound = true;

        //change jump sprite
        this.node.getComponent(cc.Sprite).spriteFrame = this.jumpSpriteFrame;
        //play jump animation
        //let anim = this.getComponent(cc.Animation);
        //anim.play();
        cc.audioEngine.play(this.jumpAudio, false, 1);
    }

    onCollisionEnter (other, self) {
        switch (other.tag) {
            case 1: { //cnv
                this.gameOver();
            } break;

            case 2: { //score
                if (this.oldCNVGrounding != other) {
                    if (this.oldCNVGrounding != null) {
                        this.canvas.getComponent("GameManager").gainScore();
                    }
                }
                
                if (this.oldCNVGrounding != null) {
                    this.isCollided = true;    
                }
                
                this.canvas.getComponent("GameManager").spawnCNV(3, undefined);
                this.oldCNVGrounding = other;

                this.node.getComponent(cc.Sprite).spriteFrame = this.normalSpriteFrame;
                this.node.y = other.node.parent.y + other.node.parent.height / 2 + this.node.height / 2;
                other.node.parent.getComponent("CNV").fall();
                //this.node.y = other.node.y + other.node.height / 2 + this.node.height / 2;            

            } break;
        }
    }

    onCollisionStay (other, self) {
        switch (other.tag) {
            case 2: {
                this.node.y = other.node.parent.y + other.node.parent.height / 2 + this.node.height / 2;
            } break;
        }
    }


    gameOver () {
        this.canvas.getComponent("GameManager").gameOver();
    }
}
