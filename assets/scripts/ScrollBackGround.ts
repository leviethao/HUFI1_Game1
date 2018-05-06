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
    @property(cc.Node) Item1: cc.Node=null;
    @property(cc.Node) Item2: cc.Node=null;
    public MoveWidth(x:number)
    {
        var move =cc.moveBy(0,x,0);
        return move;
    }
    onLoad () 
    {
    }

    start () {
        
    }

    update (dt) 
    {
        if(this.Item1.position.x>-639/2)
        {
            this.Item1.runAction(this.MoveWidth(-5));
        }
        if(this.Item2.position.x>-639/2)
        {
            
            this.Item2.runAction(this.MoveWidth(-5));
            cc.log("TEst item2:"+this.Item2.position.x);
        }
        if(this.Item1.position.x<=-639/2)
        {
            this.Item1.runAction(this.MoveWidth(600));
            cc.log("TEst item1:"+this.Item1.position.x);
        }
        if(this.Item2.position.x<=-639/2)
        {
            this.Item2.runAction(this.MoveWidth(660));
            cc.log("TEst item2:"+this.Item2.position.x);
        }
    }
}
