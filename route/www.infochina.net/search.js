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
    console.log(req.query)
    var indexData={
      column_data:{},
      news_data:{},
      random_data:[],
      hzxg_data:{},
      youcelb_data:[],
      rightlsh_data:{},
      keyword:[],
      searchData:[]
    }

    var querystr=""
    var flag=false
    db.query(`SELECT * FROM column_table WHERE parent_ID=0`,(err,data)=>{
        if(err){
          console.log("err1:   "+err)
          res.status(500).send('database err').end();
        }else{
              data = JSON.parse(JSON.stringify(data))
              async.eachSeries(data,function(item,callback){
              //查询所有栏目
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
                   //查询合作相关
                   db.query(`SELECT * FROM docooperate_table \
                    ORDER BY weight DESC`,(err,hzxg_data)=>{
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
                        //查询理事会
                        db.query(`SELECT * FROM  article_table WHERE \
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
                             //搜索
                               db.query(`SELECT * FROM key_table WHERE parent_key \
                                LIKE '%${req.query.keyword}%'`,(err,keydata)=>{
                                  if(err){
                                    console.log("find key err:"+err);
                                    res.status(500).send("db err").end();
                                  }else if(keydata.length==0){
                                    console.log("未找到相关信息")
                                    res.render('web/search.html',{indexData:indexData})
                                  }else{
                                     keydata = JSON.parse(JSON.stringify(keydata));
                                     var child_key=keydata[0].child_key.split(" ")                                   
                                      async.eachSeries(child_key,function(item,callback){
                                        db.query(`SELECT * FROM article_table \
                                          WHERE title LIKE '%${item}%'`,(err,searchdata)=>{
                                            if(err){
                                              console.log("find key article err:"+err);
                                              res.status(500).send("db err").end()
                                            }else{
                                              console.log(item)
                                               searchdata=JSON.parse(JSON.stringify(searchdata))
                                               indexData.keyword.push(item);
                                               indexData.searchData=searchdata
                                               callback();
                                            }
                                        })
                                     },function(err){
                                         if(err){
                                          console.log(err)
                                         }else{
                                          var json={}, search_data=[]
                                          console.log(indexData.searchData.length)
                                          for(var i=0;i<indexData.searchData.length;i++){
                                            console.log(indexData.searchData[i].ID)
                                            if(!json[indexData.searchData[i].ID]){
                                              console.log(2)
                                                 json[indexData.searchData[i].ID]=true;
                                                 indexData.searchData[i].shortContent=
                                                 indexData.searchData[i].content.replace(/<[^<>]+?>/g,'').replace(/&nbsp;/g,"  ").slice(0,100)+"..."
                                                 search_data.push(indexData.searchData[i])
                                            }
                                          }
                                          indexData.searchData=search_data
                                          res.render('web/search.html',{indexData:indexData})
                                        }
                                     })
                                  }
                               })
                               
                          }
                     })
                   
               }
                  })  
                }//第一个callback结束
            })//第一个异步结束
        }       
      })
  });

  router.post('/',(req,res)=>{
  })
  return router;
};