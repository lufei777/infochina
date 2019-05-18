window.onload=function(){

	 var sendMsg={};
     var jcropObj="";
     var imgData={}
 
     function init(){
        if(articleData.isEdit){
            $("#category").html(articleData.category)
            $("#summernote").summernote('code',articleData.content)
            if(articleData.pic_url && articleData.pic_url!="null"){               
                $("#showimg").attr("src","/upload/"+articleData.pic_url)
                $(".cropimg").attr("src","/upload/"+articleData.pic_url)
            }
            if(articleData.httpurl=="undefined"){
                $("#httpurl").val("");
            }
        sendMsg=articleData;
        }else{

            sendMsg={
                classId:articleData.classId,
                category:articleData.classId=="0"?'首页':'合作单位',
                category_ID:1,
                parent_ID:1
            }
        }

        if(articleData.isView){
            $("#imgurl,.cropBtn,#title,#publisher,#author,#category,#publishtime,#httpurl").attr("disabled","disabled")
            $('#summernote').summernote('disable');
        }
    }

    init();
      
	$("#imgurl").change(function(){
        if($(this)[0].files[0]){
            $("#showimg").attr("src",URL.createObjectURL($(this)[0].files[0]));
            $(".cropimg").attr("src",URL.createObjectURL($(this)[0].files[0]));
        }
	  });
    
	$(".cropBtn").click(function(){
        if($(this).attr("disabled"))
            return;
		if(!$(".cropimg").attr("src")){
			alert("请先选择图片！")
			return;
		}
		$(".cropbox").show();
        var $pcnt = $('.previewBox');
        var $pimg=$("#showimg")
        var xsize = $pimg.width(), ysize = $pimg.height(); 
        //var xsize = $pcnt.width(), ysize = $pcnt.height(); 
		jcropObj=$.Jcrop('.cropimg',{
			aspectRatio: xsize/ysize,
            onSelect:updatePreview //当选中区域的时候，执行对应的回调函数 
		})
	})
    
    function updatePreview(c) {  
        var bounds=jcropObj.getBounds();
        imgData.x=c.x;
        imgData.y=c.y;
        imgData.w=c.w;
        imgData.h=c.h;
        var $pcnt = $('.previewBox');
        var $pimg=$("#showimg")
        var xsize = $pcnt.width(), ysize = $pcnt.height();    
        // 设置预览  
        if (parseInt(c.w) > 0) {  
            var rx = xsize / c.w;  
            var ry = ysize / c.h;  
            $pimg.css({  
                width : Math.round(rx * bounds[0]) + 'px',  
                height : Math.round(ry * bounds[1]) + 'px',  
                marginLeft : '-' + Math.round(rx * c.x) + 'px',  
                marginTop : '-' + Math.round(ry * c.y) + 'px'  
            });  
        }
    };

    $("#surecropBtn").click(function(){
    	$(".cropbox").hide()
    	jcropObj.destroy();
    })

     $(".cancelBtn").click(function(){
        $(".cropbox").hide()
        jcropObj.destroy();
        $("#showimg").css({
            width:'250px',
            height: '170px',
            marginLeft :0,  
            marginTop :0
        })
        imgData.x=0;
        imgData.y=0;
        imgData.w=0;
        imgData.h=0;

    })


	$('#publishtime').datetimepicker({
		format: 'yyyy-mm-dd hh:ii:ss',//显示格式
		todayHighlight: 1,//今天高亮
		minView: "hour",//设置只显示到月份
		startView:2,
		forceParse: 0,
		showMeridian: 1,
		autoclose: 1//选择后自动关闭
	});

    $('#summernote').summernote({
    	height:800,
        tabsize: 2,
        lang: 'zh-CN',
        callbacks:{
            onImageUpload:function(files, editor, $editable){
                sendFile();
            }
        }
    });
    

    $(".mydropdown li a").click(function(){
    	$("#category").html($(this).html())
    	var idArr=$(this).attr("id").split("-")
    	sendMsg.category=$(this).html();
    	if(idArr[0]==0){
    		sendMsg.category_ID=parseInt(idArr[1]);
    		sendMsg.parent_ID=parseInt(idArr[1]);
    	
    	}else{
            sendMsg.category_ID=parseInt(idArr[1]);
    		sendMsg.parent_ID=parseInt(idArr[0]);
    	}
    })

    $(".sure-addArticle").click(function(){
       var formData = new FormData($('#uploadform')[0]); 
       if(checkParams()) {
            getParams(formData);
            console.log(sendMsg)
        		$.ajax({
                    type:'POST',
                    data:formData,
                    processData:false,
                    contentType : false,  
                    success:function(data,status){
                       alert(data)  
                    }
        	   })
      }
    })

    function checkParams(){
        if(articleData.classId=='0'){
            var ptime=$("#publishtime").val().trim();
            var date=new Date(ptime);
            if(date=="Invalid Date"){
                alert("时间格式不正确！");
                return;
            }
            if($("#title").val().trim()=="" || 
                $("#author").val().trim()=="" || 
                $("#publishtime").val().trim()==""||
                $("#weight").val().trim()=="" ||
                $("#summernote").summernote('isEmpty')){
                 alert("*为必填项！");
                 return false;
            }
            return true;
        }else if(articleData.classId=="1"){
            if($("#title").val().trim()==""){
                alert("*为必填项！");
                return false;
            }
            return true;
        }
    }

    function getParams(formData){
       formData.append("category",sendMsg.category)
       formData.append("category_ID",sendMsg.category_ID)
       formData.append("parent_ID",sendMsg.parent_ID)
       formData.append("imgcutX",imgData.x||"")
       formData.append("imgcutY",imgData.y||"")
       formData.append("imgcutW",imgData.w||"")
       formData.append("imgcutH",imgData.h||"")
        if(articleData.classId=="0"){
           sendMsg.content=$("#summernote").summernote('code')
           formData.append("content",sendMsg.content)
        } 
        if(articleData.isEdit){
            formData.append("imgsrc",articleData.pic_url)
        }	
    }
   
}