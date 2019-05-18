const crypto=require('crypto')
module.exports={
	pageFn:function(data,page){
		  var result={
		  	totalCount:0,
		  	totalPages:0,
		  	pageArr:[]
		  }
		  result.totalCount=data[0].totalCount;
	      result.totalPages=result.totalCount%15==0?result.totalCount/15:Math.ceil(result.totalCount/15);  
	      if(result.totalPages-page>=5){
	         for(var i=page;i<=parseInt(page)+4;i++){
	            result.pageArr.push(i);
	         }
	      }else{
	         if(page==1||result.totalPages<=5){
	            for(var i=1;i<=result.totalPages;i++){
	               result.pageArr.push(i)
	            }
	         }else{
	           	for(var i=4;i>=0;i--){
	              result.pageArr.push(result.totalPages-i)
	             }         
	         }            
	      }
         return result;
	},
	dogroup:function(result,data,req){
		console.log(data,req.query)
		  var returnData=this.pageFn(data,req.query.page)
		  result.totalCount=returnData.totalCount;
		  result.totalPages=returnData.totalPages
		  result.pageArr=returnData.pageArr;
		  console.log(returnData)
		 // console.log(result)
    },
    dosingle:function(result,data,req){
		  result.totalCount=data[0].totalCount
		  result.totalPages=result.totalCount%15==0?result.totalCount/15:Math.ceil(result.totalCount/15); 
		  var arr=req.query.act.split(",")
		  for(var i=0;i<arr.length;i++){
		     result.pageArr.push(arr[i])
		  }
    },
    queryColumnData:function(db,req,indexData,res,htmlpage){
		    var queryPageStr=""
		    var queryStr=""
		    if(req.query.categoryId){
		      queryPageStr="SELECT COUNT(*) AS totalCount FROM article_table WHERE category_ID="+req.query.categoryId
		      queryStr="SELECT * FROM article_table WHERE category_ID="+req.query.categoryId+
		      " ORDER BY weight DESC LIMIT "+indexData.startNum+",15";
		    }else if(req.query.parentId){
		       queryPageStr="SELECT COUNT(*) AS totalCount FROM article_table WHERE parent_ID="+req.query.parentId
		       queryStr="SELECT * FROM article_table WHERE parent_ID="+req.query.parentId+
		      " ORDER BY weight DESC LIMIT "+indexData.startNum+",15";
		    }
		    db.query(queryPageStr,(err,data)=>{
		       if(err){
		          console.log("find 总条数 err:"+err);
		          res.status(500).send('db err').end()
		       }else{
		          data = JSON.parse(JSON.stringify(data))                       
		          req.query.act=="group"?this.dogroup(indexData,data,req):this.dosingle(indexData,data,req)
		       }
		    })

		    db.query(queryStr,(err,data)=>{
		       if(err){
		        console.log("find querydata err:"+err);
		        res.status(500).send('db err').end()
		       }else{
		            data = JSON.parse(JSON.stringify(data))                     
		            for(var i=0;i<data.length;i++){
		              var str= data[i].content.replace(/<[^<>]+?>/g,'').replace(/&nbsp;/g,"  ");
		              data[i].shortContent=str.slice(0,60)+"..."
		            }
		            if(data.length!=0 && data[0].parent_ID==2){
		                 indexData.zhzx_data=data
		            }else if(data.length!=0 && data[0].parent_ID==3){
		                 indexData.yxal_data=data
		            }else if(data.length!=0 && data[0].parent_ID==4){
		                 indexData.pphd_data=data
		            }
		            db.query(`SELECT * FROM docooperate_table ORDER BY weight DESC`,(err,hzxg_data)=>{
                         if(err){
                          console.log("find 合作相关 err:"+err);
                          res.status(500).send('db err').end()
                         }else{
                              hzxg_data = JSON.parse(JSON.stringify(hzxg_data))
                              indexData.hzxg_data=hzxg_data;
                               for(var i=0;i<hzxg_data.length;i++){
                                 if(hzxg_data[i].category_ID==4)
                                   indexData.youcelb_data.push(hzxg_data[i])
                              }
                              db.query(`SELECT * FROM  article_table WHERE category_ID=5 ORDER BY weight \
                                DESC LIMIT 0,1`,(err,rightlsh_data)=>{
                                    if(err){
                                       console.log("find right lishihui err:"+err);
                                       res.status(500).send("db err").end();
                                    }else{
                                         rightlsh_data = JSON.parse(JSON.stringify(rightlsh_data))
                                         var str=rightlsh_data[0].content.replace(/<[^<>]+?>/g,'').replace(/&nbsp;/g,"  ");
                                         rightlsh_data.shortContent=str.slice(0,60)+".....";
                                         indexData.rightlsh_data=rightlsh_data;
                                         res.render(htmlpage,{indexData:indexData})
                                    }
                               })
                              
                         }
                    })
		        }
		    })
    }
}