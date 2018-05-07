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
import CNV from './CNV';
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab) prefabcnv: cc.Prefab =null;
    // LIFE-CYCLE CALLBACKS:
    delay: number;
    newCNV()
    {
        
        var obj =  cc.instantiate(this.prefabcnv);
        this.node.addChild(obj);
        var cnv = obj.getComponent(CNV);
        
    }
    onLoad () 
    {
    }

    start () 
    {
        this.delay=0;
        
    }

    update (dt) 
    {
        this.delay=this.delay+dt;
        if(this.delay>3)
        {
            this.delay=0;
            this.newCNV();
        }
    }
}
