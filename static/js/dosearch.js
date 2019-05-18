$(function(){
    var delId=[];
	var act;
	var delOrRestoreId=[];
	var classArr=window.location.search.split("&")[0].split("=")
     
    function int(){
    	var str='';
    	var searchMsg=article_data.searchMsg
    	if(article_data.classId=="0"){
    		var category=searchMsg.parentName?
    		        searchMsg.parentName:article_data.items[0].category
    		if(searchMsg.title && !searchMsg.starttime && !searchMsg.endtime){
    		    str="搜索条件:<a style='color:red'>"+category+"</a>类目下标题包含<a style='color:red'>"+
    		    searchMsg.title+"</a>"
    		}else if(!searchMsg.title && searchMsg.starttime && !searchMsg.endtime){
    			str="搜索条件:<a style='color:red'>"+category+"</a>类目下时间大于<a style='color:red'>"+
    		    searchMsg.starttime+"</a>"
    		}else if(!searchMsg.title && searchMsg.endtime && !searchMsg.starttime){
    			str="搜索条件:<a style='color:red'>"+category+"</a>类目下时间小于<a style='color:red'>"+
    		    searchMsg.endtime+"</a>"
    		}else if(!searchMsg.title && searchMsg.endtime && searchMsg.starttime){
    			str="搜索条件:<a style='color:red'>"+category+"</a>类目下时间在<a style='color:red'>"+
    		    searchMsg.starttime+"--"+searchMsg.endtime+"</a>之间"
    		}else{
    			str="搜索条件:<a style='color:red'>"+category+"</a>类目下标题包含<a style='color:red'>"+
    			searchMsg.title+"</a>时间在<a style='color:red'>"+
    		    searchMsg.starttime+"--"+searchMsg.endtime+"</a>之间"
    		} 		
    	}else if(article_data.classId=="1"){
    		str="搜索条件:<a style='color:red'>"+article_data.items[0].category+"</a>类目下标题包含<a style='color:red'>"+
    		    searchMsg.title+"</a>"
    	}else if(article_data.classId=="2"){
    		if(searchMsg.title){
    			str="搜索条件:标题包含<a style='color:red'>"+searchMsg.title+"</a>"
    		}else if(searchMsg.starttime && searchMsg.endtime){
    			str="搜索条件:时间在<a style='color:red'>"+
    		    searchMsg.starttime+"--"+searchMsg.endtime+"</a>之间"
    		}else{
    			var pORc=searchMsg.category?searchMsg.category:searchMsg.parentName
    			str="搜索条件:<a style='color:red'>"+pORc+"</a>类目"
    		}
    		
    	}
    	$(".searchspan").html(str)
    }

    int()
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
		 var url=window.location.search;
		 var urlparams=url.split("&page")[0]
		 console.log(urlparams)
		 var sendurl='/infochina@guanli/dosearch'+urlparams+'&page='+id+'&act='+act;
		 console.log(sendurl)
		$.ajax({
			type:'GET',
			url:url,
			success:function(){
				window.location.href=sendurl
			}
		})
	}

	//删除文章
	$(".delArticle").click(function(){
		if(confirm("你确定要删除吗？")){
				delId[0]=$(this).attr("id")
				doDelArticleAjax();
		}
	})

	//删除合作
	$(".delcooperate").click(function(){
		if(confirm("你确定要删除吗？")){
			delId[0]=$(this).attr("id")
			doDelCooperateAjax(); 
		}
	})

	//删除回收站
	$(".delrecycle").click(function(){
		var idArr=$(this).attr("id").split("-")
		if(confirm("你确定要删除吗？")){
			delOrRestoreId.push({
                classId:idArr[0],
	     		id:idArr[1]
			})
			act='del'
			doDelCoopOrRestoreAjax(); 
		}
	})

    //批量删除
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
	    	if(classArr[1]!="2"){
	    		delId=[];
		     	$('tbody input').each(function(index,el){
		     		if($(this).is(':checked'))
		     		   delId.push($(this).attr("id"))
		     	})
	    	}else{
	            delOrRestoreId=[];
		     	$('tbody input').each(function(index,el){
		     		var idArr=$(this).attr("id").split("-")
		     		if($(this).is(':checked'))
		     		   delOrRestoreId.push({
		     		   	 classId:idArr[0],
		     		   	 id:idArr[1]
		     		   })
		     	})
		     	act="del"
	    	}
	    }
	    if(confirm("你确定要删除吗？")){
            if(classArr[1]=="0"){
				doDelArticleAjax();
			}else if(classArr[1]=="1"){
			    doDelCooperateAjax();
	     	}else if(classArr[1]=="2"){
	     		doDelCoopOrRestoreAjax()
	     	}
	    }
	})

	//还原
	$(".restore").click(function(){
		var idArr=$(this).attr("id").split("-")
		if(confirm("你确定要还原吗？")){
			delOrRestoreId.push({
                classId:idArr[0],
	     		id:idArr[1]
			})
			act="restore"
			doDelCoopOrRestoreAjax(); 
		}
	})

	//批量
	$(".mulRestore").click(function(){
		var i=0;
		$("tbody input").each(function(index,el){
			if($(this).is(':checked'))
				i++;
		})
	    if(i==0){
	     	alert("请至少选择一项！");
	     	return;
	    }else{
	     	delOrRestoreId=[];
	     	$('tbody input').each(function(index,el){
	     		var idArr=$(this).attr("id").split("-")
	     		if($(this).is(':checked'))
	     		   delOrRestoreId.push({
	     		   	 classId:idArr[0],
	     		   	 id:idArr[1]
	     		   })
	     	})
	    }
		act='restore'
	    if(confirm("你确定要还原吗？")){
            doDelCoopOrRestoreAjax();
	    }
	})

	function doDelArticleAjax(){
		$.ajax({
			type:'POST',
			url:'/infochina@guanli/doArticle',
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

	function doDelCooperateAjax(){
		$.ajax({
			type:'POST',
			url:'/infochina@guanli/docooperate',
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

	function doDelCoopOrRestoreAjax(){
		$.ajax({
			type:'POST',
			url:'/infochina@guanli/dorecycle',
			data:{
				delOrRestoreId:delOrRestoreId,
				act:act
			},
			success:function(data,status){
                 alert(data);
                 window.location.reload();
			}
	    })
	}

	$(".toback").click(function(){
		
		if(classArr[1]=='0'){
			window.location.href=localStorage.getItem('doarticleurl')
		}else if(classArr[1]=='1'){
			console.log(1)
			window.location.href=localStorage.getItem('docooperateurl')
		}else if(classArr[1]=='2'){
			window.location.href=localStorage.getItem('dorecycle')
		}
		
	})
})
