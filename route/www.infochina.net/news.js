const express=require('express');
const mysql=require('mysql');
const async=require('async')

var db=mysql.createPool({
  host:'localhost',
  user:'root',
  password:'123456',
  database:'infochina',
  connectionLimit:100
})
module.exports=function (){
  var router=express.Router();
  router.get('/', (req, res)=>{
    var indexData={
      column_data:{},
      news_data:{},
      random_data:[],
      hzxg_data:{},
      youcelb_data:[],
      rightlsh_data:{}
    }

    var querystr=""

    db.query(`SELECT * FROM column_table WHERE parent_ID=0`,(err,data)=>{
        if(err){
          console.log("err1:   "+err)
          res.status(500).send('database err').end();
        }else{
              data = JSON.parse(JSON.stringify(data))
              async.eachSeries(data,function(item,callback){
                  db.query(`SELECT * FROM column_table WHERE \
                    parent_ID=${item.ID}`,(err,child_data)=>{
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
              },function(err){
                if(err){
                  console.log('err3:  '+err)
                }else{
                   indexData.column_data=data
                   db.query(`SELECT * FROM article_table WHERE category_ID=${req.query.categoryId} \
                        AND ID=${req.query.id}`,(err,data)=>{
                          if(err){
                            console.log('find article err:'+err);
                            res.status(500).send('db err').end();
                          }else{

                              data = JSON.parse(JSON.stringify(data))
                              for(var i=0;i<indexData.column_data.length;i++){
                                  if(indexData.column_data[i].ID==data[0].parent_ID){
                                     data[0].parentName=indexData.column_data[i].name
                                     data[0].parentHref=indexData.column_data[i].href
                                 }
                              }
                              indexData.news_data=data[0]   
                          }//查news的else
                  })//查news结束
                  //
                  db.query(`SELECT * FROM article_table WHERE parent_ID=2`,(err,data)=>{
                        data=JSON.parse(JSON.stringify(data))
                        var maxId=0,idArr=[],randomArr=[];
                        for(var i=0;i<data.length;i++){
                           idArr.push(data[i].ID)
                           if(data[i].ID>maxId)
                             maxId=data[i].ID
                        }
                        while(randomArr.length<5){
                          var n=Math.floor(Math.random()*maxId)
                          if(idArr.indexOf(n)!=-1 && randomArr.indexOf(n)==-1){
                            randomArr.push(n)
                          }
                        }
                        for(var i=0;i<randomArr.length;i++){
                          for(var j=0;j<data.length;j++){
                              if(randomArr[i]==data[j].ID){
                                data[j].shortContent=data[j].content.replace(/<[^<>]+?>/g,'').replace(/&nbsp;/g,"  ").slice(0,58)+"..."
                                indexData.random_data.push(data[j])
                              }
                         }  
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
                              db.query(`SELECT * FROM  article_table WHERE 
                                category_ID=5 ORDER BY weight \
                                DESC LIMIT 0,1`,(err,rightlsh_data)=>{
                                    if(err){
                                       console.log("find right lishihui err:"+err);
                                       res.status(500).send("db err").end();
                                    }else{
                                         rightlsh_data = JSON.parse(JSON.stringify(rightlsh_data))
                                         var str=rightlsh_data[0].content.replace(/<[^<>]+?>/g,'').replace(/&nbsp;/g,"  ");
                                         rightlsh_data.shortContent=str.slice(0,60)+".....";
                                         indexData.rightlsh_data=rightlsh_data;
                                         res.render('web/news.html',{indexData:indexData})
                                    }
                               })
                             
                         }
                  })     
                  })//查找推荐数据结束
                }//第一个callback结束
            })//第一个异步结束
        }       
      })
  });

  router.post('/',(req,res)=>{
  })
  return router;
};