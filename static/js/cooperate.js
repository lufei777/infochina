window.onload=function(){
    
    var act="";
    var currentId;
    //添加栏目
    $(".addparent").click(function(){
        $(".columnModal #columnLabel").html('添加栏目');
        act='add';
        $("#column-name").val("");
    })

    //修改栏目
     $(".editParent").click(function(){
        $(".columnModal #columnLabel").html('修改栏目')
        currentId=$(this).attr("id");
        $.ajax({
            type:'GET',
            url:'/infochina@guanli/cooperate?act=mod&id='+currentId,
            success:function(data,status){
                $("#column-name").val(data);
            }
        })
        act='mod';    
    })

    //点击确定 添加/修改栏目
    $("#addColumnModal .sure-addcolumn").click(function(){
        var name=$("#column-name").val().trim();
        if(name==""){
            alert("*为必填项！");
            return;
        }
        $.ajax({
            data:{
                name:name,
                act:act,
                id:currentId
            },
            type:'POST',
            success:function(data,status){
                  alert(data);
                  window.location.reload();
            }
        })
    })       

    //删除栏目
    $(".removecolumn").click(function(){
        if(confirm('你确定要删吗？')){
            var id=$(this).attr("id");
            $.ajax({
                type:'GET',
                url:'/infochina@guanli/cooperate?act=del&id='+id,
                success:function(data,status){
                    alert(data);
                    window.location.reload();
                }
            })
        }   
    })
    
    $(".closebtn").click(function(){
        $(".columnModal").modal('hide')
    })
} 