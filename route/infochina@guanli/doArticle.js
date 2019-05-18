const express=require('express');
const mysql=require('mysql');
const async=require('async');
const common=require('../../libs/common')

var db=mysql.createPool({
	host:'localhost',
	user:'root',
	password:'123456',
	database:'infochina'
})

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
      var result={
        currentPage:req.query.page,
        totalCount:"",
        totalPages:0,
        startNum:(req.query.page-1)*15,
        pageArr:[],
        items:[]
      }
      var querystr='';
      var querypagestr='';
      if(req.query.parentId){
        querypagestr="SELECT COUNT(*) AS totalCount FROM article_table WHERE parent_ID="+
        req.query.parentId;
        querystr="SELECT * FROM article_table WHERE parent_ID="+req.query.parentId+
        " ORDER BY weight DESC LIMIT "+result.startNum+",15";
      }else{
        querypagestr="SELECT COUNT(*) AS totalCount FROM article_table WHERE category_ID="+
        req.query.categoryId
        querystr="SELECT * FROM article_table WHERE category_ID="+req.query.categoryId+
        " ORDER BY weight DESC LIMIT "+result.startNum+",15";
      } 
      db.query(querypagestr,(err,data)=>{
         data = JSON.parse(JSON.stringify(data))
         req.query.act=="group"?common.dogroup(result,data,req):common.dosingle(result,data,req)
      })  
      
      db.query(querystr,(err,data)=>{
        if(err){
          console.log('do article err');
          res.status(500).send('db err').end();
        }else{
           data = JSON.parse(JSON.stringify(data))
           result.items=data;
           res.render('admin/doArticle.html',{article_data:result})
        }  
      })        
  });

  router.post('/',(req,res)=>{
      console.log(req.body)
      var result={
        currentPage:req.query.page,
        totalCount:"",
        totalPages:0,
        startNum:(req.query.page-1)*15,
        pageArr:[],
        items:[]
      }
      switch(req.body.act){
        case 'del':
          async.eachSeries(req.body.id,function(item,callback){
                db.query(`SELECT * FROM article_table WHERE ID=${item}`,(err,data)=>{
                    if(err){
                        console.log("del-find-article err:   "+err);
                        res.status(500).send('database err').end();
                    }else{
                        data = JSON.parse(JSON.stringify(data))[0]
                        db.query(`INSERT INTO dorecycle_table \
                        (ID,title,category,pic_url,author,\
                        publish_time,publisher,content,category_ID,parent_ID,classId,weight) \
                        VALUES('${data.ID}','${data.title}','${data.category}','${data.pic_url}',\
                        '${data.author}','${data.publish_time}','${data.publisher}',\
                        '${data.content}','${data.category_ID}',\
                        '${data.parent_ID}',0,'${data.weight}')`,(err,data)=>{
                          if(err){
                            console.log('insert recycle article-err:  '+err);
                          }else{
                                db.query(`DELETE FROM article_table WHERE ID=${item}`,(err)=>{
                                      if(err){
                                        console.log("del-article err:   "+err);
                                        res.status(500).send('database err').end();
                                      }else{
                                          callback()
                                      }
                                })
                          }
                        })
                    }
                })
                },function(err){
                  if(err){
                    console.log('del-article-callback-err:  '+err)
                  }else{
                      res.send("删除成功！").end();
                  }
          })
          break;
      }
  })
  
  return router;
};