window.onload=function(){
	//显示时间
	  setInterval("document.getElementById('time').innerHTML=new Date().toLocaleString()+' 星期'+'日一二三四五六'.charAt(new Date().getDay());",1000);
 //屏幕滚动时导航条固定
  setInterval(function(){
   if($(document).scrollTop()>110)
   {
    $(".menuIn").addClass("Nownav");
	$("#menu").addClass("Nowmenu");
   }
   else
   {
     $(".menuIn").removeClass("Nownav");
	 $("#menu").removeClass("Nowmenu");
   }
  },1);
 //导航下拉菜单
  $(".pul li").hover(function(){
    $(this).children(".cul").show();
  },function(){
    $(this).children(".cul").hide();
  })

  $(".cul").mouseenter(function(){
	$(this).parent().children("a").addClass("current");	  
  })
//右侧图片切换
var curIndex=0
function fn2(){
	if(curIndex<$(".bannerIn img").length-1)
	{curIndex=curIndex+1;}
	else{
			 curIndex=1;
			 $(".bannerIn").css({left:0});
         } 
	$(".bannerIn").animate({left:-234*curIndex},500);
}
timer2=setInterval(fn2,3000);

//右侧图片移入停止
$(".bannerOut").mouseenter(function(){clearInterval(timer2)});
$(".bannerOut").mouseleave(function(){timer2=setInterval(fn2,3000)});
//关闭3个定位
    $(".closeImg").click(function(){
		$(this).parents(".pos1").hide();})
	$(".close2").click(function(){
		$(this).parents(".pos2").hide();})
//中间图片轮播
var n=0;
function fn1(){
	if(n<$(".picIn img").length-1)
	{n=n+1;}
	else{
			 n=1;
			 $(".picIn").css({left:0});
         } 
	$(".picIn").animate({left:-764*n},500);
	 if(n==$(".picIn img").length-1)
		 { $(".carousel-indicators li").removeClass("active").eq(0).addClass("active");}
		 else
		 { $(".carousel-indicators li").removeClass("active").eq(n).addClass("active"); }
}
	 timer=setInterval(fn1,5000);
 //鼠标进入停止
      ControlTimer(".Rbtn");
	  ControlTimer(".Lbtn");
	  ControlTimer(".carousel-indicators li"); 
//li点击
 	$(".carousel-indicators li").click(function(){
		n=$(this).index();
		//document.title=n;
		$(".picIn").animate({left:-764*n},500);
		$(".carousel-indicators li").removeClass("active").eq(n).addClass("active");
		})  
//左右箭头点击	

$(".Rbtn").click(function(){
     
	 if(n<$(".picIn img").length-2)
	 { 
	  n=n+1;
	 // document.title=n;
	 $(".picIn").animate({left:-764*n},500);
	 $(".carousel-indicators li").removeClass("active").eq(n).addClass("active");
	 }
	 else
	 {  n=0;
	   //document.title=n;
	   $(".carousel-indicators li").removeClass("active").eq(0).addClass("active");
	   $(".picIn").css({left:0});
	   
	 }
 })
 
 $(".Lbtn").click(function(){
	 if(n>0)
	 {
		n=n-1;
	 //  document.title=n;
	   $(".picIn").animate({left:-764*n},500);
	  $(".carousel-indicators li").removeClass("active").eq(n).addClass("active");
	 }
	 else
	 { 
	   n=4;
	  // document.title=n;
	   $(".picIn").css({left:-3820});
	    $(".carousel-indicators li").removeClass("active").eq(n).addClass("active");}
	 })
	 //搜索
	$("#search a").click(function(){
	  
	})
function changeTo(num)
{
	$(".bannerIn a").removeClass("Ona").hide().eq(num).fadeIn().addClass("Ona");
	$(".bannerul li").removeClass("currentli").eq(num).addClass("currentli");
}
function ControlTimer(container){
     $(container).mouseenter(function(){
	  clearInterval(timer);})
	 $(container).mouseleave(function(){
	  timer=setInterval(fn1,5000);})
}
}