$(function(){
	var delId=[];
	var act;
	localStorage.setItem('docooperateurl',window.location.href)
	//
	$(".delcooperate").click(function(){
		if(confirm("你确定要删除吗？")){
			delId.push($(this).attr("id"))
			doDelCoopAjax(); 
		}
	})

    //
	$(".mulDelCoop").click(function(){
		var i=0;
		$("tbody input").each(function(index,el){
			if($(this).is(':checked'))
				i++;
		})
	    if(i==0){
	     	alert("请至少选择一项！");
	     	return;
	    }else{
	     	delId=[];
	     	$('tbody input').each(function(index,el){
	     		if($(this).is(':checked'))
	     		   delId.push($(this).attr("id"))
	     	})
	        console.log(delId)
	    }
	    if(confirm("你确定要删除吗？")){
            doDelCoopAjax();
	    }
	})

	function doDelCoopAjax(){
		$.ajax({
			type:'POST',
			data:{
				id:delId,
				act:'del'
			},
			success:function(data,status){
                 alert(data);
                 window.location.reload();
			}
	    })
	}

	//搜索文章
	$(".searchBtn").click(function(){
		var searchTitle=$("#searchArt").val().trim();
		if(!searchTitle){
			alert("请输入搜索条件！");
			return;
		}
		var idArr=window.location.search.split("&")[0].split("=")
		console.log(idArr)
		var url='/infochina@guanli/dosearch?classId=1&'+idArr[0].slice(1)+
		'='+idArr[1]+'&searchTitle='+searchTitle+'&page=1&act=group'
		$.ajax({
			type:'GET',
			url:url,
			success:function(){
                 window.location.href=url
			}
		})
	})
})