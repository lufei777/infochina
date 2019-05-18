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

  router.use(function(req,res,next){
      if(!req.session['admin_id'] && req.url!='/infochina@guanlli'){//未登录
        res.redirect('/infochina@guanli');
      }else{
        next();
      }
  })
  router.get('/', (req, res)=>{
      console.log(req.query)
      switch(req.query.act){
        case 'del':
          db.query(`DELETE FROM cooperate_table WHERE ID=${req.query.id}`, (err, data)=>{
              if(err){
                console.error("del-cooperate err:"+err);
                res.status(500).send('database error').end();
              }else{
                res.send("删除成功！").end();
              }
          });
          break;
        case 'mod':
          db.query(`SELECT * FROM cooperate_table WHERE ID=${req.query.id}`,(err,data)=>{
                if(err){
                  console.log(" find cooperate err:   "+err)
                  res.status(500).send('database err').end();
                }else{
                   res.send(data[0].name).end();
                }
           })  
          break;
        default:
           db.query(`SELECT * FROM cooperate_table`,(err,data)=>{
                if(err){
                  console.log("cooperate err:   "+err)
                  res.status(500).send('database err').end();
                }else{
                  res.render('admin/cooperate.html',{data:data})
                }
           })  
      }   
  });

  router.post('/',(req,res)=>{
      switch(req.body.act){
        case 'add':
           db.query(`INSERT INTO cooperate_table(name) VALUES('${req.body.name}')`,(err,data)=>{
                if(err){
                  console.log(" insert cooperate err:   "+err)
                  res.status(500).send('database err').end();
                }else{
                   res.send('添加成功！').end();
                }
           })  
           break;
        case 'mod':
           db.query(`UPDATE cooperate_table SET name='${req.body.name}' WHERE ID=${req.body.id}`,(err,data)=>{
                if(err){
                  console.log(" update cooperate err:   "+err)
                  res.status(500).send('database err').end();
                }else{
                  db.query(`UPDATE docooperate_table SET category='${req.body.name}' WHERE category_ID=${req.body.id}`,(err,data)=>{
                     if(err){
                       console.log("update docooperate err:"+err);
                       res.status(500).send("db err").end();
                     }else{
                       res.send('修改成功！').end();
                     }
                  })
                  
                }
           })  
           break;
        default:
           break;
      }
  })
  return router;
};