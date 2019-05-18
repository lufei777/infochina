const express=require('express');
const mysql=require('mysql');

var db=mysql.createPool({
  host:'localhost',
  user:'root',
  password:'123456',
  database:'infochina'
})
module.exports=function (){
  var router=express.Router();

  router.get('/', (req, res)=>{
     res.render('admin/login.html',{})
  });

  router.post('/',(req,res)=>{
  	  console.log(req.body)
      db.query(`SELECT * FROM user_table WHERE userid='${req.body.userid}'`,(err,data)=>{
         if(err){
             console.log("find pwd err:"+err);
             res.status(500).send("db err").end();
         }else if(data.length==0){
             res.send("用户名错误！").end();
         }else{
             data = JSON.parse(JSON.stringify(data))
             if(req.body.pwd==data[0].pwd){
                 if(!req.session['admin_id']){
                    req.session['admin_id']=1;
                  }
                  res.redirect('/infochina@guanli/index');
             }else{
                  res.send('密码错误！').end();
             }
         }
      })

  });

  router.use('/index', require('./index')());
  router.use('/doArticle', require('./doArticle.js')());
  router.use('/addArticle', require('./addArticle.js')());
  router.use('/cooperate', require('./cooperate.js')());
  router.use('/docooperate', require('./docooperate.js')());
  router.use('/dorecycle', require('./dorecycle.js')());
  router.use('/dosearch', require('./dosearch.js')());
  router.use('/dokey', require('./dokey.js')());
  router.use('/logout', require('./logout.js')());
  return router;
};