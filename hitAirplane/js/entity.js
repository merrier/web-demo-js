//自身的对象
var selfPlane={
	x:0,
	y:0,
	score:0,
	e:null,
	init:function(){
		this.x=(Util.windowWidth-Util.selfPlaneElement.width)/2;//相对于父窗体的x偏移(css:left)
		this.y=Util.windowHeight-Util.selfPlaneElement.height;//相对于父窗体的y偏移(css:top)
		this.e=Util.selfPlaneElement;//对应的dom元素
		Util.selfPlaneElement.style.left=this.x+"px";
		Util.selfPlaneElement.style.top=this.y+"px";
		Util.parentElement.appendChild(this.e);
	},
	move:function(moveX,moveY){
		var x=this.x+moveX;
		var y=this.y+moveY;
		
		if(x<0-this.e.width/2||x>Util.windowWidth-this.e.width/2){
			return ;
		}
		if(y<0-this.e.height/2||y>Util.windowHeight-this.e.height/2){
			return ;
		}
		this.x=x;
		this.y=y;
		
		this.e.style.left=this.x+"px";
		this.e.style.top=this.y+"px";
	},
	moveTo:function(x,y){
		
		if(x<0-this.e.width/2||x>Util.windowWidth-this.e.width/2){
			return ;
		}
		if(y<0-this.e.height/2||y>Util.windowHeight-this.e.height/2){
			return ;
		}
		this.x=x;
		this.y=y;
		
		this.e.style.left=this.x+"px";
		this.e.style.top=this.y+"px";
	}
}


//敌机的类
var enemyPlane=function(x,y,speed){
	this.x=x;
	this.y=y;
	this.e=Util.enemyPlaneElement.cloneNode(true);
	this.e.style.left=x;
	this.e.style.top=y;
	this.e.style.display="none";
	Util.parentElement.appendChild(this.e);
	this.e.style.display="block";
	this.speed=speed;
	this.isDied=false;
}
//prototype:原型
enemyPlane.prototype.move=function(moveX,moveY){
	this.x+=moveX;
	this.y+=moveY;
	this.e.style.left=this.x+"px";
	this.e.style.top=this.y+"px";
}
//敌人复活
enemyPlane.prototype.restore=function(){
	this.x=Math.random()*(Util.windowWidth-Util.enemyPlaneElement.width);
	this.y=-Math.random()*Util.windowHeight-Util.enemyPlaneElement.height;
	this.speed=2+Math.random()*4;
	this.e.style.left=this.x+"px";
	this.e.style.top=this.y+"px";
	this.isDied=false;
}
//敌机工厂
var enemyPlaneFactory={
	enemys:[],
	creatEnemyPlane:function(n){
		for(var i=0;i<n;i++){
			//0~1 乘以窗口宽度，得到的就是从0~窗口宽度的一个随机x值
			var x=Math.random()*(Util.windowWidth-Util.enemyPlaneElement.width);
			var y=-Math.random()*Util.windowHeight-Util.enemyPlaneElement.height;
			var speed=2+Math.random()*4;
			var ep=new enemyPlane(x,y,speed);
			this.enemys.push(ep);
		}
	}
}
//子弹
var bullet=function(x,y,speed){
	this.x=x;
	this.y=y;
	this.speed=speed;
	this.e=Util.bulletElement.cloneNode(true);
	this.e.style.left=this.x+"px";
	this.e.style.top=this.y+"px";
	Util.parentElement.appendChild(this.e);
	this.isUsed=false;
}

bullet.prototype.move=function(moveX,moveY){
	this.x+=moveX;
	this.y+=moveY;
	this.e.style.left=this.x+"px";
	this.e.style.top=this.y+"px";
}
bullet.prototype.moveTo=function(X,Y){
	this.x=X;
	this.y=Y;
	this.e.style.left=this.x+"px";
	this.e.style.top=this.y+"px";
}


//子弹恢复
bullet.prototype.restore=function(){
	this.x=Main.self
	this.y=-Math.random()*Util.windowHeight-Util.enemyPlaneElement.height;
	this.speed=2+Math.random()*4;
	this.e.style.left=this.x+"px";
	this.e.style.top=this.y+"px";
}
//子弹工厂
var bulletFactory={
	bullets:[],
	creatBullet:function(n){
		for(var i=0;i<n;i++){
			var b=new bullet(0,-Util.bulletElement.height,20);
			this.bullets.push(b);
		}
	}
}