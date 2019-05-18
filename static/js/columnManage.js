window.onload=function(){
     var edit=false;
    //折叠
    $(".ico-i").click(function(){
    	var id=$(this).attr("id")
    	if($(this).hasClass("ico-i")){
    		$(this).removeClass("ico-i").addClass("ico-click-i")
    		$(".child-column-table-"+id).removeClass("child-column-table")
    	}else{
    		$(this).removeClass("ico-click-i").addClass("ico-i")
    		$(".child-column-table-"+id).addClass("child-column-table")
    	} 
    })
    
    var act="";
    var currentId;
    //添加顶级栏目
    $(".addparent").click(function(){
        $(".columnModal #columnLabel").html('添加顶级栏目');
        $(".addchildformgroup").removeClass("hide")
        act="add";
        $("#column-name").val("");
        $("#column-href").val("");
    })

    //修改顶级栏目
     $(".editParent").click(function(){
        $(".columnModal #columnLabel").html('修改顶级栏目')
        $(".addchildformgroup").removeClass("hide")
        currentId=$(this).attr("id");
        editColumnAjax();
      
    })

    //修改子级栏目
    $(".editChild").click(function(){
        $(".columnModal #columnLabel").html('修改子级栏目')
         $(".addchildformgroup").addClass("hide")
        currentId=$(this).attr("id");
        editColumnAjax();
    })

    function editColumnAjax(){
        $.ajax({
            type:'GET',
            url:'/infochina@guanli/index?act=mod&id='+currentId,
            success:function(data,status){
                $("#column-name").val(data[0].name);
                $("#column-href").val(data[0].href);
            }
        })
        act='mod';
    }

    //增加子级栏目
    $(".addchild").click(function(){
        currentId=$(this).attr("id");
        $("#column-name").val("");
        $(".addchildformgroup").addClass("hide")
        act='addchild';
        $(".columnModal #columnLabel").html('添加子级栏目')
    })

    

    //点击确定 添加/修改 顶级/子级栏目
    $("#addColumnModal .sure-addcolumn").click(function(){
        var name=$("#column-name").val().trim();
        var href=$("#column-href").val().trim();
        if((name==""|| href=="") && !$(".addchildformgroup").hasClass("hide")){
            alert("*为必填项！");
            return;
        }else if(name=="" && $(".addchildformgroup").hasClass("hide")){
            alert("*为必填项！");
            return;
        }
        if($("#column-name").val())
        $.ajax({
            data:{
                name:name,
                href:href,
                act:act,
                id:currentId
            },
            type:'POST',
            success:function(data,status){
                  alert(data)
                  window.location.reload();
            }
        })
    })       

    //删除顶级/子级栏目
    $(".remove-parent-column").click(function(){
        if(confirm('你确定要删吗？')){
            var id=$(this).attr("id");
            $.ajax({
                type:'GET',
                url:'/infochina@guanli/index?act=delparent&id='+id,
                success:function(data,status){
                    alert(data);
                    window.location.reload();
                }
            })
        }   
    })

    $(".remove-child-column").click(function(){
        if(confirm('你确定要删吗？')){
            var id=$(this).attr("id");
            $.ajax({
                type:'GET',
                url:'/infochina@guanli/index?act=delchild&id='+id,
                success:function(data,status){
                    alert(data);
                    window.location.reload();
                }
            })
        }   
    })
} 