// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var heroPlaneID = require("heroPlaneID").heroPlaneID;

//var aaa = require("heroPlaneDatas").heroPlaneData;
var globalEnemyPlaneData = require("enemyPlaneDatas").enemyPlaneData;
var globalStageData = require("enemyPlaneDatas").stageData;

var generateType = require("enemyPlaneDatas").generateType;

var globalDropJinBiCount = require("enemyPlaneDatas").dropJinBiCount;
var globalJinBiCount = require("enemyPlaneDatas").jinBiCount;


var globalJiSuTiSu = require("enemyPlaneDatas").jiSuTiSu;
var globalJiSuTime = require("enemyPlaneDatas").jiSuTime;






cc.Class({
    extends: cc.Component,

    properties: {

        enemyPlane0: {
            default: null,
            type: cc.Prefab,
        },
        enemyPlane1: {
            default: null,
            type: cc.Prefab,
        },
        enemyPlane2: {
            default: null,
            type: cc.Prefab,
        },
        enemyPlane3: {
            default: null,
            type: cc.Prefab,
        },
        enemyPlane4: {
            default: null,
            type: cc.Prefab,
        },


        heroPlane0: {
            default: null,
            type: cc.Prefab,
        },
        heroPlane1: {
            default: null,
            type: cc.Prefab,
        },
        heroPlane2: {
            default: null,
            type: cc.Prefab,
        },


        bloodBar: {
            default: null,
            type: cc.Prefab,
        },


        prizeJinBi: {
            default: null,
            type: cc.Prefab,
        },
        prizeWuDiChongCi: {
            default: null,
            type: cc.Prefab,
        },
        prizeXinJiaXue: {
            default: null,
            type: cc.Prefab,
        },
        prizeJiSuSheSu: {
            default: null,
            type: cc.Prefab,
        },
        prizeHuoJianPao: {
            default: null,
            type: cc.Prefab,
        },


        prizeTeXiao: {
            default: null,
            type: cc.Prefab,
        },

        // teXiao:null,
        enemyBullet1: cc.Prefab,
        enemyBullet2: cc.Prefab,
        enemyBullet3: cc.Prefab,

        bulletIntelval: 2000,
        //enemys : [],

        stage: 0, //数据表中第几层
        realStage:0,//真实的层数，消灭一次加一层 用于增加敌机属性
        checkStageCount: 0,

        //beginY: 400,
        enemyMoveTime: 1,
        enemyBulletMoveTime: 4,

        enemyCount: -1,//存储当前游戏的敌机个数，来实现stage切换。
        player: null,
        //无敌骨骼动画
        // wudiTeXiao:null,

        bombSprite: cc.Node,
        bombNo: 0,
        bombLabel: cc.Label,

        shieldSprite: cc.Node,
        shieldNo: 0,
        shieldLabel: cc.Label,

        touchBeginPoint: null,
        touchMovePoint: null,
        //players:null,

        dazhaoPlane: {
            default: null,
            type: cc.Prefab,
        },
        dazhaoPlanes: null,
        dazhaoPlanes1: null,

        fireBoost: {
            default: null,
            type: cc.Node,
        },

        settingButton: null,

        // soundSetting: {
        //     default: null,
        //     type: cc.Prefab,
        // },

        buttonAudio: {
            default: null,
            url: cc.AudioClip
        },

        baozouWenZi: {
            default: null,
            type: cc.Prefab,
        },

        baozouAni: null,

        baozouHuDun: {
            default: null,
            type: cc.Prefab,
        },
        baozouHuDunAni: null,

        huDunTeXiao: {
            default: null,
            type: cc.Prefab,
        },
        hudunPartice: null,

        baozouFlag: false,//当前是否暴走，在大招里面释放

        baozouInterval: 0,//暴走效果间隔

        baozouPossession: 0.0,//暴走持续时间 比大招的5秒稍长点

        sself: null,

        lifeLabel: {
            default: null,
            type: cc.Node,
        },//label外的node

        spriteLife: {
            default: null,
            type: cc.Node,
        },//label外的node

        jinbiPool: null,
        hudunPool: null,
        jisuPool: null,
        dazhaoPool: null,
        jinbiPoolSize: 30,
        hudunPoolSize: 3,
        jisuPoolSize: 5,
        dazhaoPoolSize: 3,
        //为了性能做成成员变量
        coinLabel:null,
        defenLabel:null,



        backGround:{
            default:null,
            type:cc.Node
        },

        //摧毁敌机数，也就是现在的分数 
        fenshu:0,
        //为了性能做的 最优分数缓存，
       
        bestScore:0,
        newRecord:null,
        
        //用这个变量来记录本局获得的金币数量。
        _jinBiCount:0,


        //复活弹窗
        reviveAlert:{
            default: null,
            type: cc.Prefab,
        }
    },




    onLoad() {
        //广告复活标记
        cc.sys.localStorage.setItem("GuangGaoFuhuoFlag",1);//可以广告复活

        this.jinbiPoolSize=50,
        this.hudunPoolSize=3,
        this.jisuPoolSize=5,
        this.dazhaoPoolSize= 3,
        
        this.baozouInterval = 35,
        this.baozouPossession = 7,


        cc.sys.localStorage.setItem('killedEnemyCount', 0);

        let wx = cc.director.getVisibleSize().width * 0.5;
        let hy = cc.director.getVisibleSize().height * 0.5;

        let newRecordLabel = this.node.getChildByName("score").getChildByName("newRecord");
        newRecordLabel.active = false;
        this.node.getChildByName("score").setPosition(0, hy - 30 - newRecordLabel.getContentSize().height - this.node.getChildByName("score").getContentSize().height / 2);//锚点0.5  0.5


        let sjbw = this.node.getChildByName("kuangti_jinbi").getContentSize().width;
        let sjbh = this.node.getChildByName("kuangti_jinbi").getContentSize().height;

        this.node.getChildByName("kuangti_jinbi").setPosition(-wx + sjbw / 2, hy - sjbh / 2);
        
        //金币不显示 
        this.node.getChildByName("kuangti_jinbi").active = false;

        this.node.getChildByName("score").setLocalZOrder(100);


        // this.settingButton = this.node.getChildByName("soundSetting");
        // this.settingButton.setPosition(this.settingButton.getContentSize().width / 2 - wx, hy - sjbh - 10 - (this.settingButton.getContentSize().height / 2));



        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //debug绘制
        // manager.enabledDebugDraw = true;

        cc._initDebugSetting(cc.DebugMode.INFO);


        //根据globalHeroPlaneID来加载不同的预制体
        //var player = null;
        let dddd = cc.sys.localStorage.getItem('globalHeroPlaneID');
        if (dddd == null) {
            dddd = 0;
        }
        D.globalHeroPlaneID = dddd;

        //模板精灵
        // let  moBanSprite = null;

        if (dddd == heroPlaneID.heroPlane0) {
            this.player = cc.instantiate(this.heroPlane0);

            //  moBanSprite = this.node.getChildByName("lifeSprite0");
        }
        else if (dddd == heroPlaneID.heroPlane1) {
            this.player = cc.instantiate(this.heroPlane1);

            //  moBanSprite = this.node.getChildByName("lifeSprite1");
        }
        else if (dddd == heroPlaneID.heroPlane2) {
            this.player = cc.instantiate(this.heroPlane2);

            //moBanSprite = this.node.getChildByName("lifeSprite2");
        }
        else if (dddd == heroPlaneID.heroPlane3) {
            this.player = cc.instantiate(this.heroPlane3);
        }
        else if (dddd == heroPlaneID.heroPlane4) {
           
            this.player = cc.instantiate(this.heroPlane4);
          
        }
        else if (dddd == heroPlaneID.heroPlane5) {
            this.player = cc.instantiate(this.heroPlane5);
        }



        // //适配生命条
        // moBanSprite.scale = 60/moBanSprite.getContentSize().height;
        // moBanSprite.setPosition(-moBanSprite.getContentSize().width*moBanSprite.scale*0.5,-hy+moBanSprite.getContentSize().height*moBanSprite.scale*0.5);

      //  this.spriteLife.setPosition(-wx + this.spriteLife.getContentSize().width / 2, hy - sjbh - 10 - (this.spriteLife.getContentSize().height / 2));
      this.spriteLife.setPosition(-wx + this.spriteLife.getContentSize().width / 2, hy - 10 - (this.spriteLife.getContentSize().height / 2));
        // let lifeLabel =  this.node.getChildByName("lifeLabel");

        // lifeLabel.setPosition(cc.v2(0,moBanSprite.getPosition().y));
        this.lifeLabel.getComponent(cc.Label).string = cc.sys.localStorage.getItem('planeLifeCount');


        this.node.addChild(this.player);
        this.player.setPosition(0, this.player.getContentSize().height - this.node.getContentSize().height / 2);//(0, -241)

        this.stage = 0;
        this.realStage = 0;
        this.runStage();


        this.bombNo = parseInt(cc.sys.localStorage.getItem('dazhaoCount'));
        this.bombSprite.on('touchstart', this.bombOnclick, this);
        this.bombLabel.string = this.bombNo;
        //this.bombSprite.setPosition(wx - this.bombSprite.getContentSize().width/2, -hy + this.bombSprite.getContentSize().height/2);

        this.bombSprite.setPosition(-wx + this.bombSprite.getContentSize().width * this.bombSprite.scale * 0.5, -hy + this.bombSprite.getContentSize().height * this.bombSprite.scale * 0.5);


        this.shieldNo = parseInt(cc.sys.localStorage.getItem('hudunCount'));

        //   this.shieldSprite.on('touchstart', this.shieldOnclick, this); //废弃的功能
        this.shieldLabel.string = this.shieldNo;
        this.shieldSprite.setPosition(wx - this.shieldSprite.getContentSize().width * this.shieldSprite.scale * 0.5, -hy + this.shieldSprite.getContentSize().height * this.shieldSprite.scale * 0.5);




        this.node.on('touchmove', this.dragMove, this);
        this.node.on('touchstart', this.dragStart, this);


      // this.goBaoZou();
        
      this.goNewBaoZou();


        // this.node.runAction(cc.rotateTo(10,90));


        if (this.shieldNo > 0) {
            this.shieldTeXiao();
        }



        //奖品池
        this.jinbiPool = new cc.NodePool();
        for (let i = 0; i < this.jinbiPoolSize; i++) {
            let bl = cc.instantiate(this.prizeJinBi);
            this.jinbiPool.put(bl);
        }

        this.hudunPool = new cc.NodePool();
        for (let i = 0; i < this.hudunPoolSize; i++) {
            let bl = cc.instantiate(this.prizeWuDiChongCi);
            this.hudunPool.put(bl);
        }
        this.jisuPool = new cc.NodePool();
        for (let i = 0; i < this.jisuPoolSize; i++) {
            let bl = cc.instantiate(this.prizeJiSuSheSu);
            this.jisuPool.put(bl);
        }
        this.dazhaoPool = new cc.NodePool();
        for (let i = 0; i < this.dazhaoPoolSize; i++) {
            let bl = cc.instantiate(this.prizeHuoJianPao);
            this.dazhaoPool.put(bl);
        }


      //  this.coinLabel = this.node.getChildByName("kuangti_jinbi").getChildByName("jinbi").getComponent(cc.Label);

        this.defenLabel = this.node.getChildByName("score").getComponent(cc.Label);

        this.bestScore =  parseInt( cc.sys.localStorage.getItem('bestScore'));
        this.newRecord = this.node.getChildByName("score").getChildByName("newRecord");

    },

    goNewPlane: function () {
        //从飞机生命数中扣除1辆
        //创建 飞入 然后可以操作
        let lifeCount = parseInt(cc.sys.localStorage.getItem('planeLifeCount'));
        if(lifeCount >0) { //等于0的话 还能复活 说明是点了复活按钮 不能再扣生命值了 否则用户下次买了 还填不满这坑
            lifeCount = lifeCount - 1;
            cc.sys.localStorage.setItem('planeLifeCount', lifeCount);
        }
       
        

        // let lifeLabel =  this.node.getChildByName("lifeLabel");
        this.lifeLabel.getComponent(cc.Label).string = lifeCount;


        let dddd = cc.sys.localStorage.getItem('globalHeroPlaneID');
        if (dddd == null) {
            dddd = 0;
        }


        if (dddd == heroPlaneID.heroPlane0) {
            this.player = cc.instantiate(this.heroPlane0);

        }
        else if (dddd == heroPlaneID.heroPlane1) {
            this.player = cc.instantiate(this.heroPlane1);

        }
        else if (dddd == heroPlaneID.heroPlane2) {
            this.player = cc.instantiate(this.heroPlane2);
        }
        else if (dddd == heroPlaneID.heroPlane3) {
            this.player = cc.instantiate(this.heroPlane3);
        }
        else if (dddd == heroPlaneID.heroPlane4) {
            //cc.log('zhixing111111');
            this.player = cc.instantiate(this.heroPlane4);
            //cc.log(player);
        }
        else if (dddd == heroPlaneID.heroPlane5) {
            this.player = cc.instantiate(this.heroPlane5);
        }
        this.node.addChild(this.player);
        this.player.setPosition(0, -500);
      
        // this.node.off('touchmove', this.dragMove, this);
        // this.node.off('touchstart', this.dragStart, this);


        let seq = cc.sequence(cc.moveTo(0.8, cc.v2(0, 50 + this.player.getContentSize().height - this.node.getContentSize().height / 2)).easing(cc.easeOut(3.0)), cc.callFunc(this.newPlaneMoved, this));
        this.player.runAction(seq);
        
        this.getShield();

    },

    newPlaneMoved: function () {
        // this.node.on('touchmove', this.dragMove, this);
        // this.node.on('touchstart', this.dragStart, this);
      //  this.goBaoZou();
        this.goNewBaoZou();
    },

    goNewBaoZou:function() {
        this.unschedule(this.newBaozouProcessing);
        this.schedule(this.newBaozouProcessing, this.baozouInterval);
    },

  

    closeBaoZou: function () {
        this.unschedule(this.baozouProcessing);
    },

    shieldTeXiao: function () {
        this.hudunPartice = cc.instantiate(this.huDunTeXiao);

        let armatureDisplay = this.hudunPartice.getComponent(dragonBones.ArmatureDisplay);

        armatureDisplay.playAnimation("hudun");

        this.player.addChild(this.hudunPartice);
        this.hudunPartice.setPosition(cc.v2(0, 0));
    },

    bazouWenZidOver: function () {
        this.baozouAni.destroy();
    },


    newBaozouProcessing: function () {

        //开始暴走！ 1，暴走提示动画，2，玩家飞机属性更改，3，大招释放，4，定时器关闭暴走。
        // 1
        // let anim = this.baozouWenZi.getComponent(cc.Animation);
        // anim.play();//可能还要加入别的特效，在暴走结束时关闭

        this.baozouAni = cc.instantiate(this.baozouWenZi);
        let armatureDisplay = this.baozouAni.getComponent(dragonBones.ArmatureDisplay);

        armatureDisplay.playAnimation("baozou");

        this.node.addChild(this.baozouAni);
        armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.bazouWenZidOver, this);

        this.baozouHuDunAni = cc.instantiate(this.baozouHuDun);
        let armatureDisplay1 = this.baozouHuDunAni.getComponent(dragonBones.ArmatureDisplay);

        armatureDisplay1.playAnimation("chongci");

        this.player.addChild(this.baozouHuDunAni);


      
        //1 调用player保存当前状态。
     //   this.player.getComponent("Player").savePlayerState();
      //  this.player.getComponent("Player").baozouState();

        //2关闭所有子弹
     //   this.player.getComponent("Player").closeAllBullet();
        //3提高背景速度

        this.backGround.getComponent("background").speedFactor = 6;
        this.backGround.getComponent("background").speedYUNFactor = 9;
        
        // 4 标记暴走状态 飞机若和敌机相撞 则逻辑改变标记
        this.baozouFlag = true;
       
        // 5 设置暴走结束时刻 以及回调
        this.scheduleOnce(this.closeBaozou, this.baozouPossession);
    },


    

    //关闭暴走
    closeBaozou: function () {
        //1 关闭 暴走的那些特效， 现在还不清楚
        //2 恢复飞机属性
     //   this.player.getComponent("Player").repairPlayerState();
        this.baozouHuDunAni.destroy();

        this.backGround.getComponent("background").speedFactor = 1;
        this.backGround.getComponent("background").speedYUNFactor = 1;
        this.baozouFlag = false;
        //3 应该没了
    },

    dragStart: function (event) {
        // cc.log("game dragStart");
        this.touchBeginPoint = event.getLocation();
    },

    dragMove: function (event) {
        //cc.log("game dragMove");
        this.touchMovePoint = event.getLocation();
        let dx = this.touchMovePoint.x - this.touchBeginPoint.x;
        let dy = this.touchMovePoint.y - this.touchBeginPoint.y;

        let location = this.player.getPosition();

        location.x += dx;
        location.y += dy;

        //飞机不移出屏幕 
        let minX = -this.node.width / 2;
        let maxX = -minX;
        let minY = -this.node.height / 2;
        let maxY = -minY;
        if (location.x < minX) {
            location.x = minX;
        }
        if (location.x > maxX) {
            location.x = maxX;
        }
        if (location.y < minY) {
            location.y = minY;
        }
        if (location.y > maxY) {
            location.y = maxY;
        }

        this.player.setPosition(location);

        this.touchBeginPoint = this.touchMovePoint;

    },

    hongzha: function () {

        //必须让按钮先不能点，否则将引发bug！
        this.bombSprite.off('touchstart', this.bombOnclick, this);
        //生成大招飞机，加入game层，设置位置，摆设动画，动画回调继续动画撞击，
        //动画回调，按钮可点击
        //若没敌方飞机，飞出屏幕，回调，按钮可点击
        this.dazhaoPlanes = new Array();
        for (let i = 0; i < 8; i++) {
            this.dazhaoPlanes[i] = cc.instantiate(this.dazhaoPlane);
            //  cc.log(this.dazhaoPlanes[i]);
            //this.dazhaoPlanes[i].setPosition(-140+70*i,-250);
            this.node.addChild(this.dazhaoPlanes[i]);
            this.dazhaoPlanes[i].setPosition(0, -600);

        }

        this.dazhaoPlanes[0].runAction(cc.moveTo(1.5, cc.v2(-140, -200)).easing(cc.easeOut(3.0)));
        this.dazhaoPlanes[1].runAction(cc.moveTo(1.5, cc.v2(140, -200)).easing(cc.easeOut(3.0)));
        this.dazhaoPlanes[2].runAction(cc.moveTo(1.5, cc.v2(-70, -170)).easing(cc.easeOut(3.0)));
        this.dazhaoPlanes[3].runAction(cc.moveTo(1.5, cc.v2(70, -170)).easing(cc.easeOut(3.0)));
        this.dazhaoPlanes[4].runAction(cc.moveTo(1.5, cc.v2(0, -140)).easing(cc.easeOut(3.0)));
        this.dazhaoPlanes[5].runAction(cc.moveTo(1.5, cc.v2(0, -220)).easing(cc.easeOut(3.0)));
        this.dazhaoPlanes[6].runAction(cc.moveTo(1.5, cc.v2(-70, -250)).easing(cc.easeOut(3.0)));
        this.dazhaoPlanes[7].runAction(cc.moveTo(1.5, cc.v2(70, -250)).easing(cc.easeOut(3.0)));
        this.scheduleOnce(this.dazhaoPlaneOver, 5.0);
    },


    hongzha1: function () {
        //必须让按钮先不能点，否则将引发bug！
        this.bombSprite.off('touchstart', this.bombOnclick, this);
        //生成大招飞机，加入game层，设置位置，摆设动画，动画回调继续动画撞击，
        //动画回调，按钮可点击
        //若没敌方飞机，飞出屏幕，回调，按钮可点击
        this.dazhaoPlanes1 = new Array();
        for (let i = 0; i < 8; i++) {
            this.dazhaoPlanes1[i] = cc.instantiate(this.dazhaoPlane);

            this.node.addChild(this.dazhaoPlanes1[i]);
            this.dazhaoPlanes1[i].setPosition(0, -600);

        }

        this.dazhaoPlanes1[0].runAction(cc.moveTo(1.5, cc.v2(-140, -200)).easing(cc.easeOut(3.0)));
        this.dazhaoPlanes1[1].runAction(cc.moveTo(1.5, cc.v2(140, -200)).easing(cc.easeOut(3.0)));
        this.dazhaoPlanes1[2].runAction(cc.moveTo(1.5, cc.v2(-70, -170)).easing(cc.easeOut(3.0)));
        this.dazhaoPlanes1[3].runAction(cc.moveTo(1.5, cc.v2(70, -170)).easing(cc.easeOut(3.0)));
        this.dazhaoPlanes1[4].runAction(cc.moveTo(1.5, cc.v2(0, -140)).easing(cc.easeOut(3.0)));
        this.dazhaoPlanes1[5].runAction(cc.moveTo(1.5, cc.v2(0, -220)).easing(cc.easeOut(3.0)));
        this.dazhaoPlanes1[6].runAction(cc.moveTo(1.5, cc.v2(-70, -250)).easing(cc.easeOut(3.0)));
        this.dazhaoPlanes1[7].runAction(cc.moveTo(1.5, cc.v2(70, -250)).easing(cc.easeOut(3.0)));

        this.scheduleOnce(this.dazhaoPlaneOver1, 5.0);
    },

    bombOnclick: function () {
       
        if (this.bombNo > 0) {
            this.bombLabel.string = this.bombNo - 1;
            this.bombNo -= 1;
            cc.sys.localStorage.setItem('dazhaoCount', this.bombNo);

            this.hongzha();
        } else {
            console.log('没有子弹');

        }
    },

    dazhaoPlaneOver: function () {

        for (let i = 0; i < this.dazhaoPlanes.length; i++) {
            this.dazhaoPlanes[i].runAction(cc.moveTo(1.5, cc.v2(800, 500)).easing(cc.easeIn(3.0)));
            this.dazhaoPlanes[i].getComponent("dazhaoPlane").closeBullet();

            let dx = 800 - this.dazhaoPlanes[i].x;
            let dy = 500 - this.dazhaoPlanes[i].y;
            //cc.log("angel!!!!! ---> ", cc.pToAngle(cc.v2(dx,dy)));
            //this.dazhaoPlanes[i].runAction(cc.rotateBy(0.5,cc.pToAngle(cc.v2(dx,dy))));
            this.dazhaoPlanes[i].runAction(cc.rotateBy(0.5, cc.pToAngle(cc.v2(dx, dy)) * 180 / 3.1415926));
        }
        this.scheduleOnce(this.dazhaoButtonEnable, 1.6);
        //先不实现这么复杂的逻辑
        // let cs = this.node.children;
        // let cc = this.node.childrenCount;
        // for (let i = 0; i < cc; i++) {
        //     if (this.node.children[i].group === 'enemy') {
        //       //  this.node.children[i].getComponent('enemy').enemyBoomAni();
        //     }
        // }
    },

    dazhaoPlaneOver1: function () {

        for (let i = 0; i < this.dazhaoPlanes1.length; i++) {
            this.dazhaoPlanes1[i].runAction(cc.moveTo(1.5, cc.v2(800, 500)).easing(cc.easeIn(3.0)));
            this.dazhaoPlanes1[i].getComponent("dazhaoPlane").closeBullet();

            let dx = 800 - this.dazhaoPlanes1[i].x;
            let dy = 500 - this.dazhaoPlanes1[i].y;

            this.dazhaoPlanes1[i].runAction(cc.rotateBy(0.5, cc.pToAngle(cc.v2(dx, dy)) * 180 / 3.1415926));
        }
        this.scheduleOnce(this.dazhaoButtonEnable1, 1.6);

    },

    dazhaoButtonEnable: function () {
        this.bombSprite.on('touchstart', this.bombOnclick, this);
        for (let i = 0; i < this.dazhaoPlanes.length; i++) {
            this.dazhaoPlanes[i].destroy();

        }

        this.dazhaoPlanes = null;
    },

    dazhaoButtonEnable1: function () {
        this.bombSprite.on('touchstart', this.bombOnclick, this);
        for (let i = 0; i < this.dazhaoPlanes1.length; i++) {
            this.dazhaoPlanes1[i].destroy();

        }

        this.dazhaoPlanes1 = null;
    },


    _bulletToCoinAndRun:function() {
        let cs = this.node.children;
        let cc = this.node.childrenCount;
        for (let i = 0; i < cc; i++) {
            if (this.node.children[i].group === 'eBullet') {
                this.node.children[i].getComponent('enemyBullet').bulletToCoinAndRun();
            }
        }
    },

    shieldOnclick: function () {

        if(this.baozouFlag) {
            this._bulletToCoinAndRun();
            return;
        }
        


        if (this.shieldNo > 0) {
            this.shieldLabel.string = this.shieldNo - 1;
            this.shieldNo -= 1;
            if (this.shieldNo == 0) {
                //
                this.hudunPartice.destroy();
            }


            this._bulletToCoinAndRun();

        } else {
            console.log('没有护盾');

        }
    },



    //一个敌人被消除就会调用这个函数，所以 enemyCount要先缩减。
    checkNextStage: function () {

        this.enemyCount--;
        cc.log("enemyCount  " + this.enemyCount);

        if (this.enemyCount === 0) {//没有敌机，进入下一stage
            if (this.stage < globalStageData.length - 1) {//范围内 下一stage 若超出 重复最后的数据
                this.stage++;
            }
            this.realStage++;//永远都加
        
            this.unschedule(this.runStage);
            this.scheduleOnce(this.runStage,1);
           
        }
    },

    runStage() {


        this.enemyCount = globalStageData[this.stage].length;

        var enemy;
    
        for (var i = 0; i < globalStageData[this.stage].length; i++) {
            var enemyID = globalStageData[this.stage][i].enemyID;
            if (enemyID === 0) {
                enemy = cc.instantiate(this.enemyPlane0);
            } else if (enemyID === 1) {
                enemy = cc.instantiate(this.enemyPlane1);
            }
            else if (enemyID === 2) {
                enemy = cc.instantiate(this.enemyPlane2);
            }
            else if (enemyID === 3) {
                enemy = cc.instantiate(this.enemyPlane3);
            }
            else if (enemyID === 4) {
                enemy = cc.instantiate(this.enemyPlane4);
            }
            if (enemy.getComponent("enemy") != undefined) {
                enemy.getComponent("enemy").enemyID = enemyID;
                enemy.getComponent("enemy").blood = globalEnemyPlaneData[enemyID].blood + this.realStage;

                enemy.getComponent("enemy").shootingSpeed = globalEnemyPlaneData[enemyID].shootingSpeed + 0.02*this.realStage;
                enemy.getComponent("enemy").flyingSpeed = globalEnemyPlaneData[enemyID].flyingSpeed;
                enemy.getComponent("enemy").bulletType = globalEnemyPlaneData[enemyID].bulletType;
                enemy.getComponent("enemy").damage = globalEnemyPlaneData[enemyID].damage;
                enemy.getComponent("enemy").dropProbability = globalEnemyPlaneData[enemyID].dropProbability;
                enemy.getComponent("enemy").fallingObject = globalEnemyPlaneData[enemyID].fallingObject;
                enemy.getComponent("enemy").enemyID = globalEnemyPlaneData[enemyID].enemyID;

                enemy.getComponent("enemy").bulletTrack = globalEnemyPlaneData[enemyID].bulletTrack;
                enemy.getComponent("enemy").enemyTrack = globalEnemyPlaneData[enemyID].enemyTrack;
            }

            this.node.addChild(enemy);


            let w = cc.director.getVisibleSize().width;
            let h = cc.director.getVisibleSize().height / 2 - enemy.getContentSize().height / 2;

            var zzz = new Array();
            zzz[0] = 0;
            zzz[1] = w / 4;
            zzz[2] = -w / 4;

            var yzzz = new Array();

            yzzz[0] = (h / 5) * 2;
            yzzz[1] = (h / 5) * 3;
            yzzz[2] = (h / 5) * 4;
            // let beginRandomX = -w +(2*w)*Math.random(); //-width----width
            // let beginRandomY = cc.director.getVisibleSize().height / 2 +30+100*Math.random(); //h/2+30-----h/2+130
            let beginRandomX = -w / 2 + enemy.getContentSize().width / 2 + (w - enemy.getContentSize().width) * Math.random();
            let beginRandomY = cc.director.getVisibleSize().height / 2 + 80;
            //  enemy.setPosition(0, cc.director.getVisibleSize().height * 0.5 + 100);
            enemy.setPosition(beginRandomX, beginRandomY);

            var pos = enemy.getPosition();
            pos.x = beginRandomX;
            pos.y = 60 + (cc.director.getVisibleSize().height / 2 - 60) * Math.random();
            // pos.x = zzz[Math.floor(Math.random() * 3)];
            // pos.y = yzzz[Math.floor(Math.random() * 3)];
            var callback = cc.callFunc(enemy.getComponent("enemy").enterCallback, enemy.getComponent("enemy"));
            // var seq = cc.sequence(cc.moveTo(1, pos).easing(cc.easeIn(3.0)), callback);
            var seq = cc.sequence(cc.moveTo(1, pos), callback);
            enemy.runAction(seq);

            // let pos = enemy.getPosition();
            // let kkk = 50 + Math.random() * (w - 100);//(50~w-50)
            // pos.x = kkk - (w / 2);//(-w/2+50,w/2-50)
            // let kkk1 = 50 + Math.random() * (h / 2 - 100);//(50~h/2-50)

            // pos.y = kkk1;
            // var callback = cc.callFunc(enemy.getComponent("enemy").enterCallback, enemy.getComponent("enemy"));
            // var seq = cc.sequence(cc.moveTo(1, pos).easing(cc.easeIn(3.0)), callback);

            // enemy.runAction(seq);


        }

    },

    jinbiSanKaiOver: function (pf) {
        pf.getComponent("prize").jinbiRunFlag = true;
    },
    generatePrize: function (enemyID, prizePosition) {
        var r = Math.random();
        //  cc.log("random dropProbability  " + r);
        if (r <= globalEnemyPlaneData[enemyID].dropProbability) {
            let pf = null;
            switch (globalEnemyPlaneData[enemyID].fallingObject) {
                case generateType.jinbi:
                    cc.log("jinbi!");
                    let jinBiCount = Math.floor(Math.random() * 8);
                    for (let i = 0; i < jinBiCount; i++) {

                        if (this.jinbiPool.size() > 0) {
                            pf = this.jinbiPool.get();
                        } else {
                            pf = cc.instantiate(this.prizeJinBi);
                        }

                        pf.getComponent("prize").prizePool = this.jinbiPool;


                        this.node.addChild(pf);
                        pf.setPosition(prizePosition);
                        pf.getComponent("prize").prizeType = generateType.jinbi;
                        //!!先不调用自己的update函数，先自己做一个动作，在动作结束后，再置为true
                        pf.getComponent("prize").jinbiRunFlag = false;
                        let ramPosX = Math.random() * 60;
                        let ramPosY = Math.random() * 60
                        if (Math.random() > 0.5) {
                            ramPosX = -ramPosX;
                        }
                        if (Math.random() > 0.5) {
                            ramPosY = -ramPosY;
                        }
                        let p = cc.v2(pf.getPosition().x + ramPosX, pf.getPosition().y + ramPosY);

                        let act1 = cc.moveTo(1, p).easing(cc.easeOut(3.0));
                        let act2 = cc.callFunc(this.jinbiSanKaiOver, this, pf);
                        pf.runAction(cc.sequence(act1, act2));

                    }


                    break;
                case generateType.wudichongci:
                    cc.log("wudichongci!");

                    if (this.hudunPool.size() > 0) {
                        pf = this.hudunPool.get();
                    } else {
                        pf = cc.instantiate(this.prizeWuDiChongCi);
                    }
                    pf.getComponent("prize").prizePool = this.hudunPool;

                    this.node.addChild(pf);
                    pf.setPosition(prizePosition);
                    pf.getComponent("prize").prizeType = generateType.wudichongci;
                    pf.runAction(cc.moveTo(5, this.player.getPosition()));
                    break;
                case generateType.xinjiaxue:
                    cc.log("xinjiaxue!");
                    pf = cc.instantiate(this.prizeXinJiaXue);
                    this.node.addChild(pf);
                    pf.setPosition(prizePosition);
                    pf.getComponent("prize").prizeType = generateType.xinjiaxue;
                    pf.runAction(cc.moveTo(5, this.player.getPosition()));
                    break;
                case generateType.jisushesu:
                    cc.log("jisushesu!");

                    if (this.jisuPool.size() > 0) {
                        pf = this.jisuPool.get();
                    } else {
                        pf = cc.instantiate(this.prizeJiSuSheSu);
                    }
                    pf.getComponent("prize").prizePool = this.jisuPool;

                    this.node.addChild(pf);
                    pf.setPosition(prizePosition);
                    pf.getComponent("prize").prizeType = generateType.jisushesu;
                    pf.runAction(cc.moveTo(5, this.player.getPosition()));
                    break;
                case generateType.huojianpao:
                    cc.log("huojianpao!");
                    if (this.dazhaoPool.size() > 0) {
                        pf = this.dazhaoPool.get();
                    } else {
                        pf = cc.instantiate(this.prizeHuoJianPao);
                    }
                    pf.getComponent("prize").prizePool = this.dazhaoPool;

                    this.node.addChild(pf);
                    pf.setPosition(prizePosition);
                    pf.getComponent("prize").prizeType = generateType.huojianpao;
                    pf.runAction(cc.moveTo(5, this.player.getPosition()));
                    break;
            }
            //写在这里则所有奖品的动画都是一样的，将来可能要分别实现


            //     let jumpDuration = 5;
            //     //let jumpHeight = 50;
            //     let down = -50;


            //    // let jumpUp = cc.moveTo(jumpDuration, cc.p(0, pf.getPosition().y+jumpHeight));
            //     let jumpDown = cc.moveBy(jumpDuration, cc.p(0, down));
            //     //let seq1 = cc.sequence(jumpUp, jumpDown);

            //     let moveRight = cc.moveTo(jumpDuration/2, cc.p(-this.node.width/2+pf.width/2, pf.getPosition().y));
            //     let moveLeft = cc.moveTo(jumpDuration/2, cc.p(this.node.width/2-pf.width/2    , pf.getPosition().y));
            //     let seq2 = cc.sequence(moveRight, moveLeft);

            //     let sp1 = cc.spawn(jumpDown,seq2);

            //     pf.runAction(cc.repeatForever(sp1));

        }
    },

    fireBoostAni: function () {
        // this.fireBoost
        cc.log("火力提升");
        let anim = this.fireBoost.getComponent(cc.Animation);
        anim.play();

    },

    generateJinBi: function (pos) {
        //    let pf = cc.instantiate(this.prizeJinBi);
        let pf = null;
        if (this.jinbiPool.size() > 0) {
            pf = this.jinbiPool.get();
        } else {
            pf = cc.instantiate(this.prizeJinBi);
        }

        pf.getComponent("prize").prizePool = this.jinbiPool;



        this.node.addChild(pf);
        pf.setPosition(pos);
        pf.getComponent("prize").prizeType = generateType.jinbi;

    },


    getJinBi: function () {

        // var c = cc.sys.localStorage.getItem('jinBiCount');

        // var newC = parseInt(c) + globalDropJinBiCount;

        // cc.sys.localStorage.setItem('jinBiCount', newC);

       //let jinbilabel = this.node.getChildByName("kuangti_jinbi").getChildByName("jinbi").getComponent(cc.Label);

      //  this.coinLabel.string = parseInt(this.coinLabel.string) + globalDropJinBiCount;
      this._jinBiCount +=globalDropJinBiCount;

    },
    // getWuDiChongCi:function() {
    //     cc.log("getWuDiChongCi");

    // },
    getHuoJianPao: function () {
        this.bombNo += 1;
        cc.sys.localStorage.setItem('dazhaoCount', this.bombNo);
        this.bombLabel.string = this.bombNo;
    },

    getShield: function () {
        if (this.shieldNo == 0) {
            this.shieldTeXiao();
        }
        this.shieldNo += 1;
        cc.sys.localStorage.setItem('hudunCount', this.shieldNo);

        this.shieldLabel.string = this.shieldNo;
    },




    gameOver() {
        //防止在复活页面等待时 出现bug
        this.unscheduleAllCallbacks();

        var currentScore = parseInt(this.defenLabel.string);
        var bestScore = cc.sys.localStorage.getItem('bestScore');
        if (currentScore > bestScore) {
            cc.sys.localStorage.setItem('bestScore', currentScore);
        }
      
        cc.sys.localStorage.setItem("currentScore", currentScore);

        var c = cc.sys.localStorage.getItem('jinBiCount');
     //   var d = this.node.getChildByName("kuangti_jinbi").getChildByName("jinbi").getComponent(cc.Label).string;
        var d = this._jinBiCount;
        var newC = parseInt(c) + parseInt(d);
        cc.sys.localStorage.setItem('jinBiCount', newC);
        cc.sys.localStorage.setItem("getJinBiCount",d);

        //cc.director.loadScene('end');

        //弹出复活框  或许将来是根据 当前免费广告观看次数 以及 复活卡数量 来选择是直接结束 还是弹窗
        cc.eventManager.pauseTarget(this.node, true);
        let ss = cc.instantiate(this.reviveAlert);
        ss.setPosition(0, 0);

        ss.setLocalZOrder(100);

        ss.getComponent("reviveAlert").onWho = this.node;
        this.node.addChild(ss);
    },


    // addScore(fenshu) {
    //    // return;
    //     if(this.defenLabel == null) {
    //         return;
    //     }
    //     let fs = fenshu + parseInt(this.defenLabel.string);
    //     this.defenLabel.string = fs;
    //     if (fs > cc.sys.localStorage.getItem('bestScore')) {
    //         this.node.getChildByName("score").getChildByName("newRecord").active = true;
    //     }
    // },

    addScore(fshu) {
       
        this.fenshu = this.fenshu+fshu;
         this.defenLabel.string = this.fenshu;
         if (this.fenshu > this.bestScore) {
             this.newRecord.active = true;
         }
     },


    onSoundButtonClick: function () {
        cc.audioEngine.playEffect(this.buttonAudio, false);

        cc.eventManager.pauseTarget(this.node, true);
        let ss = cc.instantiate(this.soundSetting);
        ss.setPosition(0, 0);

        ss.getComponent("sound").onWho = this.node;



        //  cc.director.pause();
        //  this.player.active = true;


        this.node.addChild(ss);

    },




    // update (dt) {},
});
