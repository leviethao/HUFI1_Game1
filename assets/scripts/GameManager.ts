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

    @property({url: cc.AudioClip})
    scoreAudio: cc.AudioClip = null;

    @property({url: cc.AudioClip})
    backgroundAudio: cc.AudioClip = null;

    @property({url: cc.AudioClip})
    gameOverAudio: cc.AudioClip = null;
    

    @property(cc.SpriteFrame)
    safeSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    unsafeSpriteFrame: cc.SpriteFrame = null;

    @property(cc.Prefab)
    scoreColliderPrefab: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:
 
    cnvPool: cc.NodePool = null;
    scoreVal: number = 0;
    isGamePause: boolean = false;
    isGameOver: boolean = false;
    isGameStart: boolean = false;
    backgroundAudioID: number;
    prevCNVPosit: cc.Vec2;

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
        cnv.getComponent(CNV).scoreColliderPrefab = this.scoreColliderPrefab;
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

        this.backgroundAudioID = cc.audioEngine.play(this.backgroundAudio, true, 0.5);
    }

    start () 
    {
        this.prevCNVPosit = cc.Vec2.ZERO;
        this.spawnCNV(1, true);
        for (let i = 0; i < 3; i++) {
            this.spawnCNV(3, undefined);
        }
    }

    update (dt) 
    {
    }

    spawnCNV (count: number, isSafe: boolean) {
        //random safe cnv
        let safeRand = isSafe? 0 : Math.floor(Math.random() * count);
        for (let i = 0; i < count; i++) {

            let cnv = this.createCNV(this.node);
            //set safe cnv
            cnv.getComponent(cc.Sprite).spriteFrame = (i == safeRand) ? this.safeSpriteFrame : this.unsafeSpriteFrame;

            let sizeRand = Math.random() - 0.3;
            sizeRand = sizeRand < 0.3 ? 0.3 : sizeRand;
            
            cnv.width = 0.1 * this.node.width;
            cnv.height = sizeRand * this.node.height;
            if (cnv.height - this.player.y - this.player.height / 2 > this.player.height * 2 + this.node.height / 2) {
                cnv.height = this.player.y + this.player.height / 2 + this.player.height * 2 + this.node.height / 2;
            }
            cnv.y = -this.node.height / 2 + cnv.height / 2;

            //set position
            let rand = Math.random() - 0.5;
            if (rand < 0.1) {
                rand = 0.1;
            }

            if (count == 1 && isSafe) {
                cnv.x = this.player.x;
                this.player.y = cnv.y + cnv.height / 2 + this.player.height / 2;
            } else {
                cnv.x = cnv.width + this.prevCNVPosit.x + rand * cnv.width;
                this.prevCNVPosit = cnv.position;
            }
            
           

            cnv.getComponent(CNV).init();
            if (i == safeRand) {
                cnv.getComponent(CNV).enableScoreCollider();
            } 


        }
    }

    gainScore () {
        this.scoreVal++;
        this.scoreLabel.string = "Score: " + this.scoreVal.toString();
        cc.audioEngine.play(this.scoreAudio, false, 1);
    }

    gameOver () {
        this.isGameOver = true;
        
        //stop background audio
        cc.audioEngine.stop(this.backgroundAudioID);

        //play gameover audio
        cc.audioEngine.play(this.gameOverAudio, false, 1);

        //save score
        cc.sys.localStorage.setItem('score', this.scoreVal);

        this.node.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(function () {
            cc.director.loadScene("GameOver");
        })));
    }
}
