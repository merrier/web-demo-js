// JavaScript Document
var Main={
	init:function(){
		Util.init();
	},
	_totalEnemies:8,
	start:function(){
		//初始化敌机
		enemyPlaneFactory.creatEnemyPlane(this._totalEnemies);
		
		//初始化自己
		selfPlane.init();
		
		//初始化子弹
		bulletFactory.creatBullet(100);
		//开始渲染画面
		this._render();
		//开始射击子弹
		this._startShoot();
		
		//初始化键盘事件响应
		this._initEvent();
	},
	
	//渲染定时器
	_render_t:null,
	_render:function(){
		this._render_t=setInterval(function(){
			var enemys=enemyPlaneFactory.enemys;
			for(var i in enemys){
				var enemy=enemys[i];
				enemy.move(0,enemy.speed);
				
				if(enemy.x+enemy.e.width>selfPlane.x+10
					&&enemy.x<selfPlane.x+selfPlane.e.width-10
					&&enemy.y+enemy.e.height>selfPlane.y+selfPlane.e.height/2
					&&enemy.y<selfPlane.y+selfPlane.e.height){
						enemy.isDied=true;
						clearInterval(Main._render_t);
						clearInterval(Main._startShoot_t);
						var b=window.confirm("对不起，您已经挂了，是否重玩?")
						if(b){
							window.location.reload();
						}
				}
				
				if(enemy.y>Util.windowHeight||enemy.isDied){
					enemy.restore();
				}
			}
			
			var bullets=bulletFactory.bullets;
			for(var i in bullets){
				var bullet=bullets[i];
				bullet.move(0,-bullet.speed);
				
				for(var i in enemys){
					var enemy=enemys[i];
					//判断子弹是否击中敌机，如果击中则隐藏子弹，杀死敌机,增加积分..
					if(bullet.y>10
						&&bullet.x>enemy.x
						&&bullet.x<enemy.x+enemy.e.width
						&&bullet.y<enemy.y+enemy.e.height){
							enemy.isDied=true;
							bullet.e.style.top=-bullet.e.height;
							selfPlane.score+=50;
							Util.scoreSpan.innerHTML=selfPlane.score+"";
					}
				}
			}
			
			
		},1000/15);
	},
	//射击定时器
	_startShoot_t:null,
	_startShoot:function(){
		var i=0;
		var bullets=bulletFactory.bullets;
		var bulletsCount=bullets.length;
		this._startShoot_t=setInterval(function(){
			if(i>=bulletsCount){
				i=0;
			}
			var bullet=bullets[i];
			bullet.moveTo(selfPlane.x+selfPlane.e.width/2-bullet.e.width/2,selfPlane.y-bullet.e.height-3);
			i++;
		},300);
	},
	keyMove:10,
	_initEvent:function(){
		window.onkeydown=function(e){
			/*
			37:左
			38:上
			39:右
			40:下
			*/
			var keynum;
			var left=37,up=38,right=39,down=40;

			if(window.event){// IE
			  keynum = e.keyCode
			}else if(e.which) {// Netscape/Firefox/Opera
			  keynum = e.which
			}
			
			switch(keynum){
				case left:
				selfPlane.move(-Main.keyMove,0);
				break;
				case up:
				selfPlane.move(0,-Main.keyMove);
				break;
				case right:
				selfPlane.move(Main.keyMove,0);
				break;
				case down:
				selfPlane.move(0,Main.keyMove);
				break;
				
				default:
				break;
			}
			
			//console.log(keynum);
		}
		
	}
	
	
}