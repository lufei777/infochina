$(function(){
	$(".searchBtn").click(function(){
		var keyword=$(".search-keyword").val().trim();
		var url="/www.infochina.net/search?keyword="+keyword
		$.ajax({
			url:url,
			type:'GET',
			success:function(data,status){
				window.location.href=url;
			}
		})
	})	
})