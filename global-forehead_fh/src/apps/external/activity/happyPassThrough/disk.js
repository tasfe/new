"use strict";


require('./index.scss');
require('./awardRotate');
var HappyPassThroughView = Base.ItemView.extend({

    template: require('./disk.html'),

    events: {
        'click .pointer':'drawLotteryHandler'
    },
    turnplate :{
        restaraunts:[],				//大转盘奖品名称
        colors:[],					//大转盘奖品区块对应背景颜色
        outsideRadius:160,			//大转盘外圆的半径
        textRadius:130,				//大转盘奖品位置距离圆心的距离
        insideRadius:40,			//大转盘内圆的半径
        startAngle:0,				//开始角度

        bRotate:false				//false:停止;ture:旋转
    },

    initialize: function() {

    },
    onRender: function() {
        var self = this;
        this.turnplate.restaraunts = ["谢谢参与", "现金", "Iwatch", "Ipad", "Iphone 7", "Iphone 7 Plus"];
        this.turnplate.colors = ["#fdb012","#d69104", "#fdb012", "#d69104", "#fdb012","#d69104"];
        this.drawRouletteWheel();
    },

    rotateFn:function (item, txt){
        var self = this;
        var angles = item * (360 / this.turnplate.restaraunts.length) - (360 / (this.turnplate.restaraunts.length*2));
        if(angles<270){
            angles = 270 - angles;
        }else{
            angles = 360 - angles + 270;
        }
        $('#wheelcanvas').stopRotate();
        $('#wheelcanvas').rotate({
            angle:0,
            animateTo:angles+1800,
            duration:8000,
            callback:function (){
                $('#mark').fadeIn();
                //alert(txt);
                self.turnplate.bRotate = !self.turnplate.bRotate;
                $('#mark').click(function(){
                    $(this).hide();
                });

            }
        });
    },

    rnd:function(n, m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
    },

    drawLotteryHandler:function () {
        if(this.turnplate.bRotate)return;
        this.turnplate.bRotate = !this.turnplate.bRotate;
        //获取随机数(奖品个数范围内)
        var item = this.rnd(1,this.turnplate.restaraunts.length);
        //奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
        this.rotateFn(item, this.turnplate.restaraunts[item-1]);
    },

     drawRouletteWheel:function() {
        var self = this;
        var canvas = document.getElementById("wheelcanvas");
        if (canvas.getContext) {
            //根据奖品个数计算圆周角度
            var arc = Math.PI / (this.turnplate.restaraunts.length/2);
            var ctx = canvas.getContext("2d");
            //在给定矩形内清空一个矩形
            ctx.clearRect(0,0,390,390);
            //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
            ctx.strokeStyle = "#FFBE04";
            //font 属性设置或返回画布上文本内容的当前字体属性
            ctx.font = 'bold 18px Microsoft YaHei';
            for(var i = 0; i < this.turnplate.restaraunts.length; i++) {
                var angle = this.turnplate.startAngle + i * arc;
                ctx.fillStyle = this.turnplate.colors[i];
                ctx.beginPath();
                //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
                ctx.arc(195, 195, this.turnplate.outsideRadius, angle, angle + arc, false);
                ctx.arc(195, 195, this.turnplate.insideRadius, angle + arc, angle, true);
                ctx.stroke();
                ctx.fill();
                //锁画布(为了保存之前的画布状态)
                ctx.save();

                //改变画布文字颜色
                var b = i+2;
                if(b%2){
                    ctx.fillStyle = "#8c3501";
                }else{
                    ctx.fillStyle = "#8c3501";
                };

                //----绘制奖品开始----


                var text = this.turnplate.restaraunts[i];
                var line_height = 17;
                //translate方法重新映射画布上的 (0,0) 位置
                ctx.translate(195 + Math.cos(angle + arc / 2) * this.turnplate.textRadius, 195 + Math.sin(angle + arc / 2) * this.turnplate.textRadius);

                //rotate方法旋转当前的绘图
                ctx.rotate(angle + arc / 2 + Math.PI / 2);

                /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
                if(text.indexOf("盘")>0){//判断字符进行换行
                    var texts = text.split("盘");
                    for(var j = 0; j<texts.length; j++){
                        ctx.font = j == 0?'bold 20px Microsoft YaHei':'bold 18px Microsoft YaHei';
                        if(j == 0){
                            ctx.fillText(texts[j]+"盘", -ctx.measureText(texts[j]+"盘").width / 2, j * line_height);
                        }else{
                            ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height*1.2); //调整行间距
                        }
                    }
                }else if(text.indexOf("盘") == -1 && text.length>8){//奖品名称长度超过一定范围
                    text = text.substring(0,8)+"||"+text.substring(8);
                    var texts = text.split("||");
                    for(var j = 0; j<texts.length; j++){
                        ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                    }
                }else{

                    //在画布上绘制填色的文本。文本的默认颜色是黑色

                    //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
                }

                //添加对应图标

                if(text.indexOf(this.turnplate.restaraunts[0])>=0){
                    var img1= document.getElementById("smile-img");
                    img1.onload=function(){
                        ctx.drawImage(img1,170,90);
                    };
                    ctx.drawImage(img1,170,90);
                };
                if(text.indexOf(this.turnplate.restaraunts[1])>=0){
                    var img2= document.getElementById("cash-img");
                    img2.onload=function(){
                        ctx.drawImage(img2,250,130);
                    };
                    ctx.drawImage(img2,250,130);
                };
                if(text.indexOf(this.turnplate.restaraunts[2])>=0){
                    var img3= document.getElementById("iwatch-img");
                    img3.onload=function(){
                        ctx.drawImage(img3,180,120);
                    };
                    ctx.drawImage(img3,180,120);
                };
                if(text.indexOf(this.turnplate.restaraunts[3])>=0){
                    var img4= document.getElementById("ipad-img");
                    img4.onload=function(){
                        ctx.drawImage(img4,170,140);
                    };
                    ctx.drawImage(img4,170,140);
                };
                if(text.indexOf(this.turnplate.restaraunts[4])>=0){
                    var img5= document.getElementById("iphone-img");
                    img5.onload=function(){
                        ctx.drawImage(img5,150,120);
                    };
                    ctx.drawImage(img5,150,120);
                };
                if(text.indexOf(this.turnplate.restaraunts[5])>=0){
                    var img6= document.getElementById("iphone7-img");
                    img6.onload=function(){
                        ctx.drawImage(img6,150,100);
                    };
                    ctx.drawImage(img6,150,100);
                };


                //把当前画布返回（调整）到上一个save()状态之前
                ctx.restore();
                //----绘制奖品结束----
            }
        }
    }






});

module.exports = HappyPassThroughView;
