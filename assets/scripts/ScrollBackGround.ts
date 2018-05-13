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

    @property([cc.Node])
    backgroundItems: cc.Node[] = [];

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    @property(cc.Camera)
    camera: cc.Camera = null;




    @property
    speed: number = 0;

    // neo1: cc.Vec2;
    // neo2: cc.Vec2;
    cameraPrevtPos: cc.Vec2;
    

    onLoad () 
    {
        //init size of backgroud items
        for (let item of this.backgroundItems) {
            item.setContentSize(this.canvas.node.getContentSize());
        }

        //set background items position
        this.backgroundItems[0].position = cc.Vec2.ZERO;
        for (let i = 1; i < this.backgroundItems.length; i++) {
            this.backgroundItems[i].x = this.backgroundItems[i - 1].x + this.backgroundItems[i - 1].width;
            this.backgroundItems[i].y = this.backgroundItems[0].y;
        }

        //get camera position
        this.cameraPrevtPos = this.camera.node.position;
    }

    start () {
        // this.neo1=this.Item1.position;
        // this.neo2=this.Item2.position;
    }

    update (dt) 
    {
        //get camera position, get distance that camera moved
        
        let movedDistance = this.camera.node.x - this.cameraPrevtPos.x;
        //console.log("DISTANCE: " + movedDistance);


        if (movedDistance >= this.canvas.node.width) {
            this.backgroundItems[0].x = this.backgroundItems[this.backgroundItems.length - 1].x + this.backgroundItems[this.backgroundItems.length - 1].width;

            //swap items
            for (let i = 1; i < this.backgroundItems.length; i++) {
                [this.backgroundItems[i], this.backgroundItems[i - 1]] = [this.backgroundItems[i - 1], this.backgroundItems[i]];
            }

            this.cameraPrevtPos.x += this.canvas.node.width;
        }


    }

}
