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
import GameOver from "./GameOver";


const DEFAULT_POOL_SIZE = 10;
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab) prefabcnv: cc.Prefab =null;
    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Node)
    camera: cc.Node = null;
    
    // LIFE-CYCLE CALLBACKS:
 
    cnvPool: cc.NodePool = null;
    scoreVal: number = 0;
    isGamePause: boolean = false;
    isGameOver: boolean = false;
    isGameStart: boolean = false;

    createCNV(parentNode: cc.Node) : cc.Node
    {
        let cnv: cc.Node = null;
        if (this.cnvPool.size() > 0) {
            cnv = this.cnvPool.get();
        } else {
            cnv = cc.instantiate(this.prefabcnv);
        }

        cnv.parent = parentNode;
        cnv.getComponent("CNV").player = this.player;
        cnv.getComponent("CNV").canvas = this.node;
        cnv.getComponent("CNV").cnvPool = this.cnvPool;
        cnv.getComponent("CNV").camera = this.camera;
        this.camera.getComponent(cc.Camera).addTarget(cnv);
        cnv.getComponent("CNV").init();
        return cnv;
    }

    onLoad () 
    {
        //init pool
        this.cnvPool = new cc.NodePool("CNV");
        for (let i = 0; i < DEFAULT_POOL_SIZE; i++) {
            let cnv = cc.instantiate(this.prefabcnv);
            this.cnvPool.put(cnv);
        }
    }

    start () 
    {
        this.spawnCNV();
    }

    update (dt) 
    {
       
    }

    spawnCNV () {
        let cnv = this.createCNV(this.node);
        cnv.x = this.player.x + this.node.width / 2 + cnv.getChildByName("cnv1").width;
    }

    gainScore () {
        this.scoreVal++;
        this.scoreLabel.string = "Score: " + this.scoreVal.toString();
    }

    gameOver () {
        this.isGameOver = true;
        
        //save score
        cc.sys.localStorage.setItem('score', this.scoreVal);

        cc.director.loadScene("GameOver", function () {
            let gameOverComponent = cc.director.getScene().getChildByName("Canvas").getComponent(GameOver);
        });
    }
}
