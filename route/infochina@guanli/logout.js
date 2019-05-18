const express=require('express');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const expressRoute=require('express-route');

module.exports=function (){
  var router=express.Router();

  router.get('/', (req, res)=>{
  	 res.clearCookie('sess_id')
     res.render('admin/login.html',{})
  });
  return router;
};