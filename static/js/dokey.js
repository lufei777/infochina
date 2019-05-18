window.onload=function(){ 
    var action="";
    var currentId;
    var delId=[]
    //添加关键词
    $(".addkey").click(function(){
        $(".keyModal #columnLabel").html('添加关键词')
        action="add";
        $("#key-name").val("");
        $("#childkey-name").val("");
    })

    //修改关键词
     $(".modkey").click(function(){
        $(".keyModal #columnLabel").html('修改关键词')
        currentId=$(this).attr("id");
        editColumnAjax();
      
    })


    function editColumnAjax(){
        $.ajax({
            type:'GET',
            url:'/infochina@guanli/dokey?action=mod&id='+currentId,
            success:function(data,status){
                $("#key-name").val(data[0].parent_key);
                $("#childkey-name").val(data[0].child_key);
            }
        })
        action='mod';
    }

    //点击确定 添加/修改 
    $("#addKeyModal .sure-addkey").click(function(){
        var key=$("#key-name").val().trim();
        child_key=$("#childkey-name").val().trim();
        if(key==""|| child_key==""){
            alert("*为必填项！");
            return;
        }
        $.ajax({
            data:{
                key:key,
                child_key:child_key,
                action:action,
                id:currentId
            },
            type:'POST',
            success:function(data,status){
                  alert(data)
                  window.location.reload();
            }
        })
    })       

    //删除
    $(".delkey").click(function(){
        if(confirm('你确定要删吗？')){
            delId.push($(this).attr("id"))
            doDelKeyAjax();
        }
    })

    //
    $(".mulDelkey").click(function(){
        var i=0;
        $("tbody input").each(function(index,el){
            if($(this).is(':checked'))
                i++;
        })
        if(i==0){
            alert("请至少选择一个关键词！");
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
            doDelKeyAjax();
        }
    })

    function doDelKeyAjax(){
         $.ajax({
            type:'POST',
            data:{
                action:"del",
                delId:delId
            },
            success:function(data,status){
                alert(data);
                window.location.reload();
            }
        })
    }
} 