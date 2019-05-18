const express=require('express');
const mysql=require('mysql');
const async=require('async')
const pathLib=require('path')
const fs=require('fs')
const images=require('images')

var db=mysql.createPool({
	host:'localhost',
	user:'root',
	password:'123456',
	database:'infochina'
})

 function doGetpath(reqfiles){
      var patharr=reqfiles[0].path.split('\\')
      patharr.pop();
      var newP=patharr.join('\\')+'\\';
      picName=new Date().getTime()+pathLib.parse(reqfiles[0].originalname).ext
      var obj={
        picName:picName,
        newfileName:newP+picName
      }
      return obj
 }

  function doCutImg(req,picName){
      console.log(parseInt(req.body.imgcutX))
      images(images('./static/upload/'+picName),parseInt(req.body.imgcutX),
        parseInt(req.body.imgutY),parseInt(req.body.imgcutW),parseInt(req.body.imgcutH)).save('./static/upload/n-'+picName)
      fs.unlink('./static/upload/'+req.body.imgsrc,function(err){
        if(err)
          console.log('del original pic err:'+err)
        else
          console.log('del original pic ok')
      })
  }

module.exports=function (){
  var router=express.Router();

  router.use(function(req,res,next){
      if(!req.session['admin_id'] && req.url!='/infochina@guanlli'){//未登录
        res.redirect('/infochina@guanli');
      }else{
        next();
      }
  })
 
  router.get('/', (req, res)=>{
    console.log(req.query)
    switch(req.query.class){
      case '0':
          db.query(`SELECT * FROM column_table WHERE parent_ID=0`, (err, data)=>{
          if(err){
            console.error("list-column err:"+err);
            res.status(500).send('list column err').end();
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
                     data.classId=req.query.class
                     if(req.query.act=='mod'){
                        db.query(`SELECT * FROM article_table \
                          WHERE ID=${req.query.id}`, (err, articleData)=>{
                            if(err){
                              console.log("find article err:"+err);
                              res.status(404).send("no this data").end();
                            }else{
                                 articleData = JSON.parse(JSON.stringify(articleData))
                                 articleData[0].isEdit=true
                                 articleData[0].classId=req.query.class
                                 res.render('admin/addArticle.html',{data:data,articleData:articleData[0]})
                            }
                        })
                     }else if(req.query.act=="add"){
                         db.query(`SELECT MAX(ID) AS maxID FROM article_table`,(err,maxID)=>{
                            if(err){
                              console.log('find maxid  err:'+err);
                              res.status(500).send('db err').end();
                            }else{
                              maxID = JSON.parse(JSON.stringify(maxID))
                              articleData={
                                 title:"",
                                 content:"",
                                 author:"",
                                 publish_time:"",
                                 isEdit:false,
                                 classId:req.query.class,
                                 weight:parseInt(maxID[0].maxID)+1
                              }
                                res.render('admin/addArticle.html',{data:data,articleData:articleData}) 
                            }
                        })  
                     }else if(req.query.act=='recycle'){
                       db.query(`SELECT * FROM dorecycle_table \
                        WHERE ID=${req.query.id} AND classId=${req.query.class}`, (err, articleData)=>{
                            if(err){
                              console.log("find recycle err:"+err);
                              res.status(500).send("db err").end();
                            }else if(articleData.length==0){
                                console.log("参数错误");
                                res.status(404).send("参数错误").end();
                            }else{
                                 articleData = JSON.parse(JSON.stringify(articleData))
                                 articleData[0].isEdit=true
                                 articleData[0].classId=req.query.class
                                 articleData[0].isView=true;
                                 res.render('admin/addArticle.html',{data:data,articleData:articleData[0]})
                            }
                        })
                     }        
                }
            })       
          }
        });
         break;
      case '1':
           db.query(`SELECT * FROM cooperate_table`, (err, data)=>{
              if(err){
                console.error("list-column err:"+err);
                res.status(500).send('list column err').end();
              }else{ 
                     data = JSON.parse(JSON.stringify(data))
                     data.classId=req.query.class
                     if(req.query.act=='mod'){
                      db.query(`SELECT * FROM docooperate_table WHERE \
                        ID=${req.query.id}`, (err, articleData)=>{
                            if(err){
                              console.log("find cooperate err:"+err);
                              res.status(404).send("no this data").end();
                            }else{
                                 articleData = JSON.parse(JSON.stringify(articleData))
                                 articleData[0].isEdit=true
                                 articleData[0].classId=req.query.class
                                 res.render('admin/addArticle.html',{data:data,articleData:articleData[0]})
                            }
                        })
                     }else if(req.query.act=="add"){
                      db.query(`SELECT MAX(ID) AS maxID FROM docooperate_table`,(err,maxID)=>{
                            if(err){
                              console.log('find maxid  err:'+err);
                              res.status(500).send('db err').end();
                            }else{
                              maxID = JSON.parse(JSON.stringify(maxID))
                              articleData={
                                 title:"",
                                 httpurl:"",
                                 isEdit:false,
                                 classId:req.query.class,
                                 weight:parseInt(maxID[0].maxID)+1
                              }
                                res.render('admin/addArticle.html',{data:data,articleData:articleData}) 
                            }
                        })  
                     }else if(req.query.act=='recycle'){
                        db.query(`SELECT * FROM dorecycle_table WHERE \
                          ID=${req.query.id} AND classId=${req.query.class}`, (err, articleData)=>{
                              if(err){
                                console.log("find recycle err:"+err);
                                res.status(500).send("db err").end();
                              }else if(articleData.length==0){
                                  console.log("参数错误");
                                  res.status(404).send("参数错误").end();
                              }else{
                                   articleData = JSON.parse(JSON.stringify(articleData))
                                   articleData[0].isEdit=true
                                   articleData[0].classId=req.query.class
                                   articleData[0].isView=true;
                                   console.log(articleData[0])
                                   res.render('admin/addArticle.html',{data:data,articleData:articleData[0]})
                              }
                        })
                     }            
              }
            });
          break;
      default:
         break;
    }   
  });

  router.post('/',(req,res)=>{
    console.log(req.body)
    console.log(req.files)
    if(req.body.classId=="0"){
       if(req.body.isEdit=="false"){
        if(req.files.length==0){
             db.query(`INSERT INTO article_table \
                    (title,category,author,\
                    publish_time,publisher,content,weight,category_ID,parent_ID) \
                    VALUES('${req.body.title}','${req.body.category}',\
                    '${req.body.author}','${req.body.publishtime}','${req.body.publisher}',\
                    '${req.body.content}','${req.body.weight}',\
                    '${req.body.category_ID}','${req.body.parent_ID}')`,(err,data)=>{
                     if(err){
                        console.log("insert article err:"+err)
                        res.status(500).send('database err').end();
                     }else{
                        res.status(200).send("添加成功！").end();
                     }
            })   
        }else{
          var picParams=doGetpath(req.files)
          fs.rename(req.files[0].path,picParams.newfileName,function(err){
              if(err){
                console.log('失败')
                return;
                res.status(500).send('上传图片失败！').end();
              }else{
                    if(req.body.imgcutW && req.body.imgcutH){
                    doCutImg(req,picParams.picName)
                    picParams.picName='n-'+picParams.picName
                   }
                   db.query(`INSERT INTO article_table \
                    (title,category,pic_url,author,\
                    publish_time,publisher,content,weight,category_ID,parent_ID) \
                    VALUES('${req.body.title}','${req.body.category}','${picParams.picName}',\
                    '${req.body.author}','${req.body.publishtime}','${req.body.publisher}',\
                    '${req.body.content}','${req.body.weight}',\
                    '${req.body.category_ID}','${req.body.parent_ID}')`,(err,data)=>{
                         if(err){
                            console.log("insert article err:"+err)
                            res.status(500).send('database err').end();
                         }else{
                            res.status(200).send("添加成功！").end();
                         }
                    })          
                }
        })
      }  
    }else{
         if(req.files.length!=0){
            var picParams=doGetpath(req.files)
            fs.rename(req.files[0].path,picParams.newfileName,function(err){
              if(err){
                console.log('失败')
                return;
                res.status(500).send('上传图片失败！').end();
              }else{
                    if(req.body.imgcutW && req.body.imgcutH){
                        doCutImg(req,picParams.picName)
                        fs.unlink(picParams.newfileName,function(err){
                          if(err)
                             console.log('delete-img err: '+err)
                          else 
                             console.log('delete img ok');
                        })
                        picParams.picName='n-'+picParams.picName      
                    }       
              }
               db.query(`UPDATE article_table \
                    SET title='${req.body.title}', category='${req.body.category}', \
                    author='${req.body.author}', \
                    publish_time='${req.body.publishtime}', publisher='${req.body.publisher}', \
                    content='${req.body.content}', category_ID='${req.body.category_ID}', \
                    parent_ID='${req.body.parent_ID}', \
                    pic_url='${picParams.picName}', weight='${req.body.weight}' WHERE \
                    ID=${req.body.id}`,(err,data)=>{
                 if(err){
                    console.log("update article err:"+err)
                    res.status(500).send('database err').end();
                 }else{
                    res.status(200).send("修改成功！").end();
                 }
              })  
            })
         }else{
            var picParams={
              picName:req.body.imgsrc
            }
            if(req.body.imgcutW && req.body.imgcutH){
               doCutImg(req,picParams.picName)
               picParams.picName='n-'+req.body.imgsrc
            }
            db.query(`UPDATE article_table \
                  SET title='${req.body.title}', category='${req.body.category}', \
                  author='${req.body.author}', \
                  publish_time='${req.body.publishtime}', publisher='${req.body.publisher}', \
                  content='${req.body.content}', category_ID='${req.body.category_ID}', \
                  parent_ID='${req.body.parent_ID}', \
                  pic_url='${picParams.picName}', weight='${req.body.weight}' WHERE \
                  ID=${req.body.id}`,(err,data)=>{
               if(err){
                  console.log("update article err:"+err)
                  res.status(500).send('database err').end();
               }else{
                  res.status(200).send("修改成功！").end();
               }
            })      
         }
        // console.log(2,picParams.picName)
         
      }  
    }else if(req.body.classId=="1"){
        if(req.body.isEdit=="false"){ //tianjia
          if(req.files.length==0){
             db.query(`INSERT INTO docooperate_table \
                  (name,httpurl,category,category_ID,weight) \
                  VALUES('${req.body.title}',\
                  '${req.body.httpurl}','${req.body.category}',\
                  '${req.body.category_ID}','${req.body.weight}')`,(err,data)=>{
                       if(err){
                          console.log("insert cooperate err:"+err)
                          res.status(500).send('database err').end();
                       }else{
                          res.status(200).send("添加成功！").end();
                       }
                })  

          }else{
            var picParams=doGetpath(req.files)
            fs.rename(req.files[0].path,picParams.newfileName,function(err){
                if(err){
                  console.log('失败')
                  return;
                  res.status(500).send('上传图片失败！').end();
                }else{
                      if(req.body.imgcutW && req.body.imgcutH){
                      doCutImg(req,picParams.picName)
                      picParams.picName='n-'+picParams.picName
                    }
                    db.query(`INSERT INTO docooperate_table \
                        (name,httpurl,category,category_ID,pic_url,weight) \
                        VALUES('${req.body.title}',\
                        '${req.body.httpurl}','${req.body.category}',
                        '${req.body.category_ID}','${picParams.picName}',\
                        '${req.body.weight}')`,(err,data)=>{
                             if(err){
                                console.log("insert cooperate err:"+err)
                                res.status(500).send('database err').end();
                             }else{
                                res.status(200).send("添加成功！").end();
                             }
                      })        
                  }
           })
         }
      }else{
         //编辑
          if(req.files.length!=0){
            var picParams=doGetpath(req.files)
            fs.rename(req.files[0].path,picParams.newfileName,function(err){
                if(err){
                  console.log('失败')
                  res.status(500).send('上传图片失败！').end();
                  return;
                }else{
                    if(req.body.imgcutW && req.body.imgcutH){
                       doCutImg(req,picParams.picName)
                        picParams.picName='n-'+picParams.picName
                         fs.unlink(picParams.newfileName,function(err){
                          if(err)
                             console.log('delete-img err: '+err)
                          else 
                             console.log('delete img ok');
                        })
                     }     
                }
            })
         }else{
            var picParams={
               picName:req.body.imgsrc
            }
            if(req.body.imgcutW && req.body.imgcutH){
               doCutImg(req,picParams.picName)
               picParams.picName='n-'+req.body.imgsrc
            }
        }
         db.query(`UPDATE docooperate_table \
              SET name='${req.body.title}', category='${req.body.category}', \
              category_ID='${req.body.category_ID}', \
              httpurl='${req.body.httpurl}', pic_url='${picParams.picName}', \
              weight='${req.body.weight}' WHERE ID=${req.body.id}`,(err,data)=>{
             if(err){
                console.log("update article err:"+err)
                res.status(500).send('database err').end();
             }else{
                res.status(200).send("修改成功！").end();
             }
         }) 
    }
   }
  })
  return router;
};