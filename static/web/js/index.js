$(function(){
	for(var i=0;i<$(".example").length;i++){
		if(i%3==0){
			$(".example").eq(i).css({marginLeft:0})
		}
	}

	$(".bannerIn a").eq(0).addClass("Ona")
})