[{
	name:'首页',
    ID:1,
	child_colunm:[{
		name:'name1',
		ID:9
	},{
		name:'name2',
		ID:10
	},{
		name:'name3',
		ID:11
	}]
},{
	name:'智慧城市',
	ID:2,
	child_colunm:[{
		name:'name4',
		ID:12
	},{
		name:'name5',
		ID:13
	},{
		name:'name6',
		ID:15
	}]
}]

const express=require('express');
const mysql=require('mysql');
const async=require('async')

var db=mysql.createPool({
	host:'localhost',
	user:'root',
	password:'123456',
	database:'infochina'
})

module.exports=function (){
  var router=express.Router();
  router.get('/', (req, res)=>{
  	db.query(`SELECT * FROM column_table WHERE parent_ID=0`,(err,data)=>{
        if(err){
			console.log("err1:   "+err)
			res.status(500).send('database err').end();
	    }else{
	    	var i=2;
	    	data = JSON.parse(JSON.stringify(data))
            async.eachSeries(data,function(item,callback){
                db.query(`SELECT * FROM column_table WHERE parent_ID=${i}`,(err,child_data)=>{
	    			if(err){
	    				console.log("err2:   "+err);
	    				res.status(500).send('database err').end();
	    			}else if(child_data.length==0){
                        item.child_column=[];
                        callback();
	    			}else{
	    			    item.child_column=JSON.parse(JSON.stringify(child_data))
	    			    callback()
	    			}
    		    })
    		    i++;
            },function(err){
        	    if(err)
        	    	console.log('err3:  '+err)
        	    else
                    res.render('admin/index.html',{column_data:data})
            })
	    }				
  	})
  });
  
  return router;
};





1.column_table
ID    name        parent_ID 
 1     首页           0          
 2     智慧城市       0          
 9     大数据         1     

2.article_table
ID  title   category(类目)  pic_url author publish_time publisher  content category_ID parent_ID

3.cooperate_table
 ID   name

4.docooperate_table
ID  name  category  pic_url(可空)  httpurl category_ID 



<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>中国信息界-后台管理</title>
	<link rel="stylesheet" href="../css/bootstrap/bootstrap.min.css" type="text/css">
	<link rel="stylesheet" href="../css/bootstrap/bootstrap-datetimepicker.min.css">
	<link rel="stylesheet" href="../css/bootstrap/fileinput.min.css">
	<link rel="stylesheet" href="../css/bootstrap/summernote.css">
	<link rel="stylesheet" href="../css/jquery.Jcrop.min.css">
	<link rel="stylesheet" href="../css/houtai.css">
	<script src="https://code.jquery.com/jquery-2.2.0.min.js"></script>
	<script src="http://cdn.static.runoob.com/libs/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script src="../js/bootstrap/bootstrap-datetimepicker.min.js"></script>
	<script src="../js/bootstrap/bootstrap-datetimepicker.fr.js"></script>
	<script src="../js/bootstrap/fileinput.min.js"></script>
	<script src="../js/bootstrap/zh.js"></script>
	<script src="../js/bootstrap/summernote.js"></script>
	<script src="../js/bootstrap/summernote-zh-CN.js"></script>
	<script src="../js/jquery.Jcrop.min.js"></script>
	<script src="../js/addArticle.js"></script>
</head>
<body>
	<% include components/head.html %>
    <div class="main">
    	<% include components/left.html %>
	    <div class="right">
	        <div class="addarticlebox">
	        <a class="btn btn-danger" style="float: right">返回</a>
	        <a class="btn btn-info sure-addArticle" id="<%=articleData.isEdit%>" style="float: right;margin-right: 10px;">确定</a>
	        <%if(data.classId==0){%>
	            <form class="form-horizontal" style="width:80%;">
	        	  <div class="form-group">
				    <label for="imgurl" class="col-sm-2 control-label">缩略图:</label>
				    <div class="col-sm-8">
				      <!-- <input type="file" id="imgurl" style="float: left;" onchange="changepic(this)">
				      <img src="" id="showimg" width="200" height="150">  -->
				      <input type="file" id="imgurl" style="float: left;">
				      <img  src="" id="showimg" width="200" height="150">
				    </div>
				  </div>
				  <div class="form-group">
				    <label for="title" class="col-sm-2 control-label">标题:</label>
				    <div class="col-sm-8">
				      <input type="text" class="form-control" id="title" value="<%=articleData.title%>">
				    </div>
				  </div>
				  <div class="form-group">
				    <label for="publisher" class="col-sm-2 control-label">发布人:</label>
				    <div class="col-sm-4">
				      <input type="text" class="form-control" id="publisher" value="admin">
				    </div>
				  </div>
				  <div class="form-group">
				    <label for="author" class="col-sm-2 control-label">作者:</label>
				    <div class="col-sm-6">
				      <input type="text" class="form-control" id="author" value="<%=articleData.author%>">
				    </div>
				  </div>
				  <div class="form-group">
				 		<label  class="col-sm-2 control-label">类别:</label>
				 		 <div class="col-sm-4">
				 		 	<div class="dropdown">
							  <button class="btn btn-default dropdown-toggle" type="button" id="category" data-toggle="dropdown" >
							    首页
							  </button>
	                          <ul class="dropdown-menu" aria-labelledby="category">
					 				<%for(var i=0;i< data.length;i++){%>
					 					<li>
					 						<a id="0-<%=data[i].ID%>"><%=data[i].name%></a>
					 						<ul>  
					 							<%for(var j=0;j< data[i].child_column.length;j++){%>
                                                     <li><a id="<%=data[i].ID%>-<%=data[i].child_column[j].ID%>" style="margin-left: 40px;"><%=data[i].child_column[j].name%></a></li>
					 							<%}%>
					 						</ul>
					 					</li>
					 				<%}%>
					 			</ul>
						    </div>
				        </div>
				   </div>
				  <div class="form-group">
				  	<label for="publishtime" class="col-sm-2 control-label">时间:</label>
				  	<div class="col-sm-4">
				      <input type="text" class="form-control" id="publishtime" value="<%=articleData.publish_time%>"> 
					</div>
				  </div>
				  <div class="form-group">
				  	<label for="content" class="col-sm-2 control-label">内容:</label>
				  	<div class="col-sm-10" >
				      <div id="summernote"></div>
				    </div>
				  </div>
			    </form>
	         <%}else if(data.classId==1){%>
	         <form class="form-horizontal" style="width:80%">
	         	<div class="form-group">
				    <label for="imgurl" class="col-sm-2 control-label">缩略图:</label>
				    <div class="col-sm-8">
				      <input type="file" id="imgurl" style="float: left;">
				    </div> 
				  </div>
				  <div class="form-group">
				    <label for="title" class="col-sm-2 control-label">合作/广告名称:</label>
				    <div class="col-sm-6">
				      <input type="text" class="form-control" id="title">
				    </div>
				  </div>
				  <div class="form-group">
				 		<label  class="col-sm-2 control-label">类别:</label>
				 		 <div class="col-sm-4">
				 		 	<div class="dropdown">
							  <button class="btn btn-default dropdown-toggle" type="button" id="category" data-toggle="dropdown" >
							    合作单位
							  </button>
	                          <ul class="dropdown-menu" aria-labelledby="category">
					 				<%for(var i=0;i< data.length;i++){%>
					 					<li>
					 						<a id="0-<%=data[i].ID%>"><%=data[i].name%></a>
					 					</li>
					 				<%}%>
					 			</ul>
						    </div>
				        </div>
				   </div>
				   <div class="form-group">
				    <label for="httpurl" class="col-sm-2 control-label">网址:</label>
				    <div class="col-sm-6">
				      <input type="text" class="form-control" id="httpurl">
				    </div>
				  </div>
	         </form>
	         <%}%>
	        </div>	
	    </div>
    </div>
<script>
  var articleData= <%- JSON.stringify(articleData) %>;
  if(articleData.isEdit){
     $("#category").html(articleData.category)
     $("#summernote").summernote('code',articleData.content)
  }else{
	  	
  }
  $("#imgurl").change(function(){
	   $("#showimg").attr("src",URL.createObjectURL($(this)[0].files[0]));
  });
   
</script>
</body>
</html>



