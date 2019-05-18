$(function(){
	var delOrRestoreId=[];
	var act;
	var queryParams={}

    localStorage.setItem('dorecycle',window.location.href)
	$("#oncategory").click(function(){
		$(".titlediv,.timediv").addClass('hide')
		$(".categorydiv").removeClass('hide');
		$(this).attr("checked","true")
		$("#ontitle, #ontime").removeAttr("checked");
	})

	$("#ontitle").click(function(){
		$(".categorydiv,.timediv").addClass('hide')
		$(".titlediv").removeClass('hide');
		$(this).attr("checked","true")
		$("#oncategory, #ontime").removeAttr("checked");
	})

	$("#ontime").click(function(){
		$(".categorydiv, .titlediv").addClass('hide')
		$(".timediv").removeClass('hide');
		$(this).attr("checked","true")
		$("#oncategory, #ontitle").removeAttr("checked");
	})

	function init(){
		var $radio=$("input[name='inlineRadioOptions']");
		$("#oncategory").attr("checked","true")
		queryParams.parent_ID=1
		queryParams.category_ID=1
		queryParams.category="首页"
		queryParams.classId=0
		if($("#oncategory").is(':checked')){
			$(".titlediv,.timediv").addClass("hide")
			$(".categorydiv").removeClass("hide");
		}else if($("#ontitle").is(':checked')){
			$(".categorydiv,.timediv").addClass("hide")
			$(".titlediv").removeClass("hide");
		}else if($("#ontime").is(':checked')){
			$(".categorydiv, .titlediv").addClass("hide")
			$(".timediv").removeClass("hide");
		}

		if(!$(".titlediv").hasClass("hide")){
			$radio.removeAttr("checked").eq(1).attr("checked","true")
			$radio.eq(1).prop("checked",true)
		}else if(!$(".timediv").hasClass('hide')){
            $radio.removeAttr("checked").eq(2).attr("checked","true")
            $radio.eq(2).prop("checked",true)
		}

	}

	init()

	//删除文章
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

    //批量删除文章
	$(".mulDelCoop").click(function(){
		mulOperate()
		act='del'
	    if(confirm("你确定要删除吗？")){
            doDelCoopOrRestoreAjax();
	    }
	})

	//还原文章
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

	//批量还原文章
	$(".mulRestore").click(function(){
		mulOperate()
		act='restore'
	    if(confirm("你确定要还原吗？")){
            doDelCoopOrRestoreAjax();
	    }
	})

	function mulOperate(){
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
	        console.log(delOrRestoreId)
	    }
	}
     
	function doDelCoopOrRestoreAjax(){
		$.ajax({
			type:'POST',
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
  
    $('#starttime,#endtime').datetimepicker({
		format: 'yyyy-mm-dd hh:ii:ss',//显示格式
		todayHighlight: 1,//今天高亮
		minView: "hour",//设置只显示到月份
		startView:2,
		forceParse: 0,
		showMeridian: 1,
		autoclose: 1//选择后自动关闭
	});

	$(".dropdown-menu li a").click(function(){
    	$("#category").html($(this).html())
    	var idArr=$(this).attr("id").split("-")
    	queryParams.category=$(this).html();
    	if(idArr[0]==0 && idArr[1]==0){
    		queryParams.category_ID=parseInt(idArr[2]);
    		queryParams.parent_ID=parseInt(idArr[2]);
    		queryParams.classId=0	
    	}else if(idArr[0]==0 && idArr[1]!=0){
            queryParams.category_ID=parseInt(idArr[2]);
    		queryParams.parent_ID=parseInt(idArr[1]);
    		queryParams.classId=0
    	}else if(idArr[0]==1){
    		queryParams.category_ID=parseInt(idArr[2])
    		queryParams.parent_ID=0
    		queryParams.classId=1
    	}
    	console.log(queryParams)
    })

    $(".searchBtn").click(function(){
    	url=getUrl();
    	if(url){
    		$.ajax({
	    		type:'GET',
	    		url:url,
	    		success:function(){
	    			window.location.href=url
	    		}
    	   })
    	}	
    })

    function getUrl(){
    	var url
    	if($("#oncategory").is(':checked')){
    		console.log(1)
    		url='/infochina@guanli/dosearch?classId=2&classid='+
            	queryParams.classId+'&categoryId='+queryParams.category_ID+
    	       '&category='+queryParams.category+'&parentId='+queryParams.parent_ID+'&page=1&act=group'
        }else if($("#ontitle").is(':checked')){
        	var title=$("#searchArt").val().trim();
        	if(title==""){
        		alert("请输入名称！");
        		return false;
        	}
        	url='/infochina@guanli/dosearch?classId=2&title='+title+'&page=1&act=group'
        }else if($("#ontime").is(':checked')){
        	var starttime=$("#starttime").val().trim();
    	    var endtime=$("#endtime").val().trim();
        	if(starttime=="" || endtime==""){
        		alert("请将时间段填写完整！");
        		return false;
        	}
        	url='/infochina@guanli/dosearch?classId=2&starttime='+starttime+
    		'&endtime='+endtime+'&page=1&act=group'
        }
        return url;
    }
})