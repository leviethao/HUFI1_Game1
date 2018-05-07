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
    neo1: cc.Vec2;
    neo2: cc.Vec2;
    public MoveWidth(x:number)
    {
        var move =cc.moveBy(0,x,0);
        return move;
    }
    onLoad () 
    {
    }

    start () {
        this.neo1=this.Item1.position;
        this.neo2=this.Item2.position;
    }

    update (dt) 
    {
        if(this.Item1.position.x>-this.neo1.x)
        {
            this.Item1.position = this.Item1.position.add(new cc.Vec2(-5, 0));
            this.Item2.position = this.Item2.position.add(new cc.Vec2(-5, 0));            
        }
        if(this.Item1.position.x<=-this.neo1.x)
        {
            this.Item1.position=this.Item1.position.add(new cc.Vec2(this.Item2.width*2,0));
        }
        if(this.Item2.position.x<=-this.neo1.x)
        {
            this.Item2.position=this.Item2.position.add(new cc.Vec2(this.Item1.width*2,0));
        }
    }
}
