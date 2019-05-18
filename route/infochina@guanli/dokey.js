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
    console.log(req.query)
    var result={
        currentPage:req.query.page,
        totalCount:"",
        totalPages:0,
        startNum:(req.query.page-1)*15,
        pageArr:[],
        items:[]
     }
     switch(req.query.action){
       case "mod":
            db.query(`SELECT * FROM key_table WHERE ID=${req.query.id}`,(err,data)=>{
                if(err){
                  console.log("find mod key err:"+err);
                  res.status(500).send("db err").end();
                }else{
                    data = JSON.parse(JSON.stringify(data))
                    res.send(data).end()
                }
           })
           break;
         default:
             var queryPageStr="SELECT COUNT(*) AS totalCount FROM key_table";
             var queryStr="SELECT * FROM key_table ORDER BY ID DESC LIMIT "+result.startNum+",15";
             db.query(queryPageStr,(err,data)=>{
                data = JSON.parse(JSON.stringify(data))
                req.query.act=="group"?common.dogroup(result,data,req):common.dosingle(result,data,req)
             })
             
            db.query(queryStr,(err,data)=>{
               if(err){
                    console.log("query key err:"+err)
                    res.status(500).send("db err").end();
                }else{
                    result.items=data;
                    res.render("admin/dokey.html",{data:result})
                }
            })  
     }
    
  });

  router.post('/',(req,res)=>{
     console.log(req.body);
     switch(req.body.action){
        case 'add' :
          str="INSERT INTO key_table (parent_key,child_key) \
          VALUES('"+req.body.key+"','"+req.body.child_key+"')"
          db.query(str,(err,data)=>{
             if(err){
                console.log("insert key err:"+err);
                res.status(500).send("db err").end();
             }else{
                res.send("添加成功！").end();
             }
          })
          break;
        case 'mod' :
           db.query(`UPDATE key_table SET parent_key='${req.body.key}', \
            child_key='${req.body.child_key}' WHERE ID=${req.body.id}`,(err,data)=>{
             if(err){
                console.log("update key err:"+err);
                res.status(500).send("db err").end();
             }else{
                res.send("修改成功！").end();
             }
           })
          break;
          case "del":           
             async.eachSeries(req.body.delId,function(item,callback){
                db.query(`DELETE FROM key_table WHERE ID=${item}`,(err,data)=>{
                   if(err){
                      console.log("del key err:"+err);
                      res.status(500).send("db err").end()
                   }else{
                     callback()
                   }
               })
             },function(err){
                if(err){
                  conosle.log("callback err:"+err);
                  res.status(500).send("db err:"+err)
                }else{
                   console.log(1)
                   res.send("删除成功！").end();
                }                  
             })
           break; 
     }
  })
  return router;
};