$(function(){
   $(".login-btn").click(function(){
   	 var userid=$("#userid").val().trim();
   	 var pwd=$("#pwd").val().trim().split("").reverse().join("");
   	 pwd=hex_md5(pwd)
   	 $.ajax({
   	 	type:'POST',
   	 	data:{
   	 		userid:userid,
   	 		pwd:pwd
   	 	},
   	 	success:function(){
           window.location.href='/infochina@guanli/index'
   	 	}
   	 })
   })
})
