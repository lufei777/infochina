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
     
      var querytotalstr="SELECT  COUNT (*) AS totalCount FROM docooperate_table WHERE category_ID="+
      req.query.id
      var querystr="SELECT * FROM docooperate_table WHERE category_ID="+req.query.id+
      " ORDER BY ID DESC LIMIT "+result.startNum+",15"
       db.query(querytotalstr,(err,data)=>{
          if(err){
            console.log("count cooperate err:"+err);
          }else{
            data = JSON.parse(JSON.stringify(data))
              req.query.act=="group"?common.dogroup(result,data,req):common.dosingle(result,data,req)
          }    
        })
      db.query(querystr,(err,data)=>{
            if(err){
              console.log("docooperate err:"+err);
              res.status(500).send("database err").end();
            }else{
              data = JSON.parse(JSON.stringify(data))
              result.items=data;
              res.render('admin/docooperate.html',{article_data:result})
            }
      })
  });

  router.post('/',(req,res)=>{
      console.log(req.body)
      switch(req.body.act){
        case 'del':
          async.eachSeries(req.body.id,function(item,callback){
                     db.query(`SELECT * FROM docooperate_table WHERE ID=${item}`,(err,data)=>{
                        if(err){
                          console.log("find del-cooperate err:   "+err);
                          res.status(500).send('database err').end();
                        }else{
                          data = JSON.parse(JSON.stringify(data))[0]
                          db.query(`INSERT INTO dorecycle_table \
                          (ID,name,category,pic_url,category_ID,http_url,classId,weight) \
                          VALUES('${data.ID}','${data.name}','${data.category}','${data.pic_url}',\
                          '${data.category_ID}','${data.http_url}',\
                          1,'${data.weight}')`,(err,data)=>{
                            if(err){
                              console.log('insert recycle article-err2:  '+err);
                            }else{
                                  db.query(`DELETE FROM docooperate_table WHERE ID=${item}`,(err)=>{
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
                    console.log('del-cooperate-callback-err:  '+err)
                  }else{
                      res.send("删除成功！").end();
                  }
            })
            break;
        case 'add':
          break;
      }
  })

  return router;
};