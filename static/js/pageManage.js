$(function(){
	if($(".current0").html()==1){
    	$("#lastgroup").addClass("disabled")
    }

    if($(".pagea:last").html()==$(".totalpage i").html()){
    	$("#nextgroup").addClass("disabled")
    }

    $("#nextgroup").click(function(){
		var id=parseInt($(".current4").html())+1
		if(id<$(".totalpage i").html())
			 ChosePageAjax(id,"group");			
	})

	$("#lastgroup").click(function(){
		var id=parseInt($(".current0").html())-5
		if(id>0)
		   ChosePageAjax(id,"group")
	})

	$(".firstPage").click(function(){
		ChosePageAjax(1,"group")
	})

	$(".lastPage").click(function(){
		var id=$(this).attr("id");
		ChosePageAjax(id,"group")
	})

	$(".clickpage").click(function(){
		var id=$(this).attr("id");
		var arr=[];
		for(var i=0;i<$(".clickpage").length;i++){
			arr.push($(".clickpage a").eq(i).html())
		}
		ChosePageAjax(id,arr)
	})

	function ChosePageAjax(id,act){
		var wholeurl=window.location.href
		if(wholeurl.indexOf("doArticle") != -1){
			var urlparam=window.location.search.substr(1).split("&")[0];
			var url='/infochina@guanli/doArticle?'+urlparam+'&page='+id+'&act='+act
			$.ajax({
				type:'GET',
				url:url,
				success:function(data,status){
	                window.location.href=url
				}
			})
		}else if(wholeurl.indexOf("docooperate") != -1){
			var urlparam=window.location.search.substr(1).split("&")[0];
			var url='/infochina@guanli/docooperate?'+urlparam+'&page='+id+'&act='+act
			$.ajax({
				type:'GET',
				url:url,
				success:function(data,status){
	                window.location.href=url
				}
			})
		}else if(wholeurl.indexOf("dorecycle") != -1){
			var url='/infochina@guanli/dorecycle?'+'&page='+id+'&act='+act
			$.ajax({
				type:'GET',
				url:url,
				success:function(data,status){
	                window.location.href=url
				}
			})
		}else if(wholeurl.indexOf('zhihuizixun')!=-1){
			var categoryArr=window.location.search.split("&")[2].split("=")
			var url='/www.infochina.net/zhihuizixun?page='+id+'&act='+act+
			"&"+categoryArr[0]+"="+categoryArr[1];
			$.ajax({
				type:'GET',
				url:url,
				success:function(data,status){
					window.location.href=url
				}
			})
		}else if(wholeurl.indexOf('dokey')!=-1){
			var url='/infochina@guanli/dokey?page='+id+'&act='+act
			$.ajax({
				type:'GET',
				url:url,
				success:function(data,status){
					window.location.href=url
				}
			})
		}else if(wholeurl.indexOf('youxiuanli')!=-1){
			var categoryArr=window.location.search.split("&")[2].split("=")
			var url='/www.infochina.net/youxiuanli?page='+id+'&act='+act+
			"&"+categoryArr[0]+"="+categoryArr[1];
			$.ajax({
				type:'GET',
				url:url,
				success:function(data,status){
					window.location.href=url
				}
			})
		}else if(wholeurl.indexOf('pinpaihuodong')!=-1){
			var categoryArr=window.location.search.split("&")[2].split("=")
			var url='/www.infochina.net/pinpaihuodong?page='+id+'&act='+act+
			"&"+categoryArr[0]+"="+categoryArr[1];
			$.ajax({
				type:'GET',
				url:url,
				success:function(data,status){
					window.location.href=url
				}
			})
		}		
	}
})