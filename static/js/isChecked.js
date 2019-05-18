$(function(){
       //点击全选
      $("thead input").click(function(){
        if($(this).is(':checked'))
            $("tbody input").attr("checked","checked").prop("checked",true);
        else
            $("tbody input").removeAttr("checked").prop("checked",false);   
    })

    //点击单选
    $("tbody input").click(function(){
        if($(this).is(':checked')){
            var i=0;
            $("tbody input").each(function(index,el){
                if(!$(this).is(':checked'))
                    return false;
                else i++;
            })
            if(i==$("tbody input").length){
                $("thead input").attr("checked","checked").prop("checked",true);
            }
        }else{
            $("thead input").removeAttr("checked").prop("checked",false)
        }
    }) 

})
  