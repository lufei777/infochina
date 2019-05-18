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
    switch(req.query.act){
        case 'delparent':
             db.query(`DELETE FROM column_table WHERE ID=${req.query.id}`, (err, data)=>{
                    if(err){
                      console.error("del-parent err:"+err);
                      res.status(500).send('database error').end();
                    }else{
                      db.query(`DELETE FROM column_table WHERE \
                        parent_ID=${req.query.id}`,(err,data)=>{
                          if(err){
                              console.error("del-parent err:"+err);
                              res.status(500).send('database error').end(); 
                          }else{
                            res.send("删除成功！").end();
                          } 
                      })   
                    }
              }); 
            break;
        case 'delchild':
            db.query(`DELETE FROM column_table WHERE ID=${req.query.id}`, (err, data)=>{
                    if(err){
                      console.error("del-child err:"+err);
                      res.status(500).send('database error').end();
                    }else{
                      res.send("删除成功！").end();
                    }
              });
            break;
        case 'mod':
                db.query(`SELECT * FROM column_table WHERE ID=${req.query.id}`, (err, data)=>{
                    if(err){
                      console.error("cant find err:"+err);
                      res.status(404).send('no this data').end();
                    }else{
                       data = JSON.parse(JSON.stringify(data))
                       res.send(data).end();
                    }
                });
            break;
        default:
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
                              res.render('admin/index.html',{column_data:data})
                        }
                      })
                }       
            })
    }
  });

  router.post('/',(req,res)=>{
     console.log(req.body);
     switch(req.body.act){
      case 'add':
         db.query(`INSERT INTO column_table(name,href,parent_ID) \
          VALUES('${req.body.name}','${req.body.href}',0)`,(err,data)=>{
             if(err){
                console.log("insert err:"+err)
                res.status(500).send('database err').end();
             }else{
                  res.send("添加顶级栏目成功！").status(200).end();
             }
         })
         break;
      case 'mod':
         db.query(`UPDATE column_table SET name='${req.body.name}',\
          href='${req.body.href}' WHERE ID=${req.body.id}`,(err,data)=>{
             if(err){
                console.log("update err:"+err)
                res.status(500).send('database err').end();
             }else{
                  res.send("修改顶级栏目成功！").end();
             }
         })
         break;
      case 'addchild':
         db.query(`INSERT INTO column_table(name,href,parent_ID) \
          VALUES('${req.body.name}','${req.body.href}','${req.body.id}')`,(err,data)=>{
             if(err){
                console.log("update err:"+err)
                res.status(500).send('database err').end();
             }else{
                  res.send("添加子级栏目成功！").end();
             }
         })
         break;
     }
  })
  return router;
};