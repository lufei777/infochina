$(function(){
    var delId=[];
	var act;
	localStorage.setItem('doarticleurl',window.location.href)

	$('#starttime,#endtime').datetimepicker({
		format: 'yyyy-mm-dd hh:ii:ss',//显示格式
		todayHighlight: 1,//今天高亮
		minView: "hour",//设置只显示到月份
		startView:2,
		forceParse: 0,
		showMeridian: 1,
		autoclose: 1//选择后自动关闭
	});

	//删除文章
	$(".delArticle").click(function(){
		if(confirm("你确定要删除吗？")){
			delId.push($(this).attr("id"))
			doDelArticleAjax(); 
		}
	})

    //批量删除文章
	$(".mulDelArticle").click(function(){
		var i=0;
		$("tbody input").each(function(index,el){
			if($(this).is(':checked'))
				i++;
		})
	    if(i==0){
	     	alert("请至少选择一篇文章！");
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
            doDelArticleAjax();
	    }
	})

	function doDelArticleAjax(){
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
		var starttime=$('#starttime').val().trim();
		var endtime=$('#endtime').val().trim();
		if(!searchTitle && !starttime && !endtime){
			alert("请输入搜索条件！");
			return;
		}
		var url;
		var idArr=window.location.search.split("&")[0].split("=")
		url='/infochina@guanli/dosearch?classId=0&'+idArr[0].slice(1)+'='+idArr[1]+'&searchTitle='+searchTitle+
		    '&starttime='+starttime+'&endtime='+endtime+'&page=1&act=group'
		 console.log(url);  
		$.ajax({
			type:'GET',
			url:url,
			success:function(){
                 window.location.href=url
			}
		})
	})
})
