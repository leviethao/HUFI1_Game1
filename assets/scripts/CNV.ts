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
const CNV_MIN_HEIGHT = 250;
@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node) Item1: cc.Node=null;
    @property(cc.Node) Item2: cc.Node=null;

    player: cc.Node = null;
    canvas: cc.Node = null;
    cnvPool: cc.NodePool = null;
    camera: cc.Node = null;

    onLoad () 
    {
        
        // this.Item1.position=this.Item1.position.add(new cc.Vec2(360,-50));
        // this.Item2.position=this.Item2.position.add(new cc.Vec2(360,-300));
        // cc.log("Test")
        
     

    }


    init () {

        
        let cnvHeight = this.canvas.height - this.player.height * 3;
        let random = Math.random();
        if (random < 0.3) {
            random = 0.3;
        }

        if (random > 0.7) {
            random = 0.7;
        }

        //set item's height
        this.Item2.height = Math.max(cnvHeight * random, CNV_MIN_HEIGHT);
        this.Item1.height = cnvHeight - this.Item2.height;

        //set item's position
        this.Item1.y = this.canvas.height / 2 - this.Item1.height / 2;
        this.Item2.y = -this.canvas.height / 2 + this.Item2.height / 2;


        //set score collider position
        this.node.getComponent(cc.BoxCollider).offset.y = this.Item2.y + this.Item2.height / 2 + this.player.height * 1.5;
        //set score collider height
        this.node.getComponent(cc.BoxCollider).size = cc.size(10, this.player.height * 3);

        //set item1 cnv size
        this.Item1.getComponent(cc.BoxCollider).size = this.Item1.getContentSize(); 

        //set item2 cnv size
        this.Item2.getComponent(cc.BoxCollider).size = this.Item2.getContentSize();
    }

    start () 
    {
    }

     update (dt) 
     {
        
        if ((this.player.x - this.player.width / 2) - (this.node.x + this.Item1.width / 2) > this.canvas.width / 2) {
            //remove target of camera
            this.camera.getComponent(cc.Camera).removeTarget(this.node);
            this.canvas.getComponent("GameManager").spawnCNV();

            this.cnvPool.put(this.node);
        }
        
     }

    reuse () {
    }

    unuse () {
    }

}
