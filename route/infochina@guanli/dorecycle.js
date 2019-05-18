const express=require('express');
const mysql=require('mysql');
const async=require('async');
const fs=require('fs')
const common=require('../../libs/common')

var db=mysql.createPool({
	host:'localhost',
	user:'root',
	password:'123456',
	database:'infochina'
})

module.exports=function (){//
  var router=express.Router();

  router.use(function(req,res,next){
      if(!req.session['admin_id'] && req.url!='/infochina@guanlli'){//未登录
        res.redirect('/infochina@guanli');
      }else{
        next();
      }
  })
  router.get('/', (req, res)=>{
    var result={
        currentPage:req.query.page,
        totalCount:"",
        totalPages:0,
        startNum:(req.query.page-1)*15,
        pageArr:[],
        items:[]
     }
     if(req.query.act=="group"){
            db.query(`SELECT  COUNT (*) AS totalCount FROM dorecycle_table`,(err,data)=>{
                data = JSON.parse(JSON.stringify(data))
                var returnData=common.pageFn(data,req.query.page)
                result.totalCount=returnData.totalCount;
                result.totalPages=returnData.totalPages
                result.pageArr=returnData.pageArr;
              })
      }else{
          db.query(`SELECT  COUNT (*) AS totalCount FROM dorecycle_table`,(err,data)=>{
              data = JSON.parse(JSON.stringify(data))
              result.totalCount=data[0].totalCount;
              result.totalPages=result.totalCount%15==0?result.totalCount/15:Math.ceil(result.totalCount/15); 
              var arr=req.query.act.split(",")
              for(var i=0;i<arr.length;i++){
                 result.pageArr.push(arr[i])
              } 
          })
      }

    db.query(`SELECT ID,title,name,category,classId FROM dorecycle_table \
      ORDER BY ID DESC limit ${result.startNum},15`,(err,data)=>{
      if(err){
        console.log('select dorecycle err:  '+err)
        res.status(500).send('database err');
      }else{
        data = JSON.parse(JSON.stringify(data))
        result.items=data;
        var listData;
        db.query(`SELECT * FROM column_table WHERE parent_ID=0`,(err,listdata)=>{
            if(err){
              console.error("list-column err:"+err);
              res.status(500).send('list column err').end();
            }else{
              listdata = JSON.parse(JSON.stringify(listdata))
              async.eachSeries(listdata,function(item,callback){
                    db.query(`SELECT * FROM column_table WHERE \
                      parent_ID=${item.ID}`,(err,child_data)=>{
                          if(err){
                            console.log("err2:   "+err);
                            res.status(500).send('database err').end();
                          }else if(child_data.length==0){
                                      item.child_column=[];
                                      item.classId=0
                                      callback();
                          }else{
                              item.child_column=JSON.parse(JSON.stringify(child_data))
                              item.classId=0
                              callback()
                          }
                    })
                },function(err){
                      listData=listdata
                      db.query(`SELECT * FROM cooperate_table`,(err,data)=>{
                        if(err){
                          console.log('dorecycle cooperate list err:'+err);
                          res.status(500).end('db err');
                        }else{
                             data = JSON.parse(JSON.stringify(data))
                             for(var i=0;i<data.length;i++){
                                data[i].classId=1
                                data[i].child_column=[]
                             }
                             listData=listData.concat(data);
                            res.render('admin/dorecycle.html',{data:result,listData:listData})
                        }
                      })
                })
            }
        })
        
      }
    })
  });

  router.post('/',(req,res)=>{
     console.log(req.body);
     switch(req.body.act){
        case 'del' :
            async.eachSeries(req.body.delOrRestoreId,function(item,callback){
              db.query(`SELECT pic_url FROM dorecycle_table WHERE ID=${item.id} \
                AND classId=${item.classId}`,(err,picData)=>{
                if(err){
                  console.log('find recycle data err:'+err);
                }else{
                  picData = JSON.parse(JSON.stringify(picData))
                  console.log(picData)
                  if(picData){
                    fs.unlink('./static/upload/'+picData[0].pic_url,function(err){
                      if(err){
                        console.log('unlink picurl err:'+err)
                      }
                    })
                  }
                  db.query(`DELETE FROM dorecycle_table WHERE ID=${item.id} \
                    AND classId=${item.classId}`,(err)=>{
                      if(err){
                          console.log("del-article err:   "+err);
                          res.status(500).send('database err').end();
                        }else{
                            callback()
                        }
                  })
                }
              })
            },function(err){
                  if(err){
                    console.log('del-cooperate-callback-err:  '+err)
                  }else{
                      res.send("删除成功！").end();
                  }
            })
          break;
        case 'restore' :
          async.eachSeries(req.body.delOrRestoreId,function(item,callback){
                db.query(`SELECT * FROM dorecycle_table WHERE ID=${item.id} \
                  AND classId=${item.classId}`,(err,data)=>{
                  if(err){
                    console.log('find recycle data err:'+err);
                  }else{
                    data = JSON.parse(JSON.stringify(data))[0]
                    if(item.classId=='0'){
                      db.query(`INSERT INTO article_table \
                        (ID,title,category,pic_url,author,\
                        publish_time,publisher,content,category_ID,parent_ID,weight) \
                        VALUES('${data.ID}','${data.title}','${data.category}','${data.pic_url}',\
                        '${data.author}','${data.publish_time}','${data.publisher}',\
                        '${data.content}','${data.category_ID}',\
                        '${data.parent_ID}','${data.weight}')`,(err,data)=>{
                          if(err){
                            console.log('restore article err:  '+err);
                          }else{
                                db.query(`DELETE FROM dorecycle_table WHERE \
                                  ID=${item.id} AND classId=${item.classId}`,(err)=>{
                                      if(err){
                                        console.log("del-restore-recycle err:   "+err);
                                        res.status(500).send('database err').end();
                                      }else{
                                          callback()
                                      }
                                })
                          }
                        })
                    }else if(item.classId=='1'){
                        db.query(`INSERT INTO docooperate_table \
                          (ID,name,category,pic_url,category_ID,httpurl,weight) \
                          VALUES('${data.ID}','${data.name}','${data.category}','${data.pic_url}',\
                          '${data.category_ID}','${data.http_url}','${data.weight}')`,(err,data)=>{
                            if(err){
                              console.log('restore recycle cooperate err:  '+err);
                            }else{
                                  db.query(`DELETE FROM dorecycle_table WHERE \
                                    ID=${item.id} AND classId=${item.classId}`,(err)=>{
                                        if(err){
                                          console.log("restore cooperate err:   "+err);
                                          res.status(500).send('database err').end();
                                        }else{
                                            callback()
                                        }
                                  })
                            }
                        })
                    }
                  }
                })
              },function(err){
                    if(err){
                      console.log('restore-callback-err:  '+err)
                    }else{
                        res.send("还原成功！").end();
                    }
              })
          break;

     }
  })
  return router;
};