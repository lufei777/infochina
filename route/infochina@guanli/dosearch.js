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
        items:[],
        searchMsg:{}
      }
      var querystr='';
      var querytotalstr='';  
     if(req.query.classId=="0"){
        //只有title
         if(req.query.searchTitle && !req.query.starttime && !req.query.endtime){
            if(req.query.parentId){
               querytotalstr="SELECT COUNT(*) AS totalCount FROM article_table WHERE title LIKE"+ 
               "'%"+req.query.searchTitle+"%'  AND parent_ID="+req.query.parentId
               querystr="SELECT * FROM article_table WHERE title LIKE"+ "'%"+req.query.searchTitle+
                "%'  AND parent_ID="+req.query.parentId+" ORDER BY ID DESC LIMIT "+result.startNum+",15"
            }else if(req.query.categoryId){
              querytotalstr="SELECT COUNT(*) AS totalCount FROM article_table WHERE title LIKE"+ 
               "'%"+req.query.searchTitle+"%'  AND category_ID="+req.query.categoryId
               querystr="SELECT * FROM article_table WHERE title LIKE"+ "'%"+req.query.searchTitle+
                "%'  AND category_ID="+req.query.categoryId+" ORDER BY ID DESC LIMIT "+result.startNum+",15"
            }
          }else if(!req.query.searchTitle && !req.query.endtime){
            //只有开始时间
             if(req.query.parentId){
               querytotalstr="SELECT COUNT(*) AS totalCount FROM article_table WHERE publish_time >= '"+req.query.starttime+
                  "'  AND parent_ID="+req.query.parentId
                querystr="SELECT * FROM article_table WHERE publish_time >= '"+req.query.starttime+
                  "'  AND parent_ID="+req.query.parentId+" ORDER BY ID DESC LIMIT "+result.startNum+",15"
              }else if(req.query.categoryId){
                querytotalstr="SELECT COUNT(*) AS totalCount FROM article_table WHERE publish_time >= '"+req.query.starttime+
                  "'  AND category_ID="+req.query.categoryId
                querystr="SELECT * FROM article_table WHERE publish_time >= '"+req.query.starttime+
                  "'  AND category_ID="+req.query.categoryId+" ORDER BY ID DESC LIMIT "+result.startNum+",15"
              }
          }else if(!req.query.searchTitle && !req.query.starttime){
             //只有结束时间
             if(req.query.parentId){
                querytotalstr="SELECT COUNT(*) AS totalCount FROM article_table WHERE publish_time <= '"+req.query.endtime+
                  "'  AND parent_ID="+req.query.parentId
                querystr="SELECT * FROM article_table WHERE publish_time <= '"+req.query.endtime+
                  "'  AND parent_ID="+req.query.parentId+" ORDER BY ID DESC LIMIT "+result.startNum+",15"
              }else if(req.query.categoryId){
                querytotalstr="SELECT COUNT(*) AS totalCount FROM article_table WHERE publish_time <= '"+req.query.endtime+
                  "'  AND category_ID="+req.query.categoryId
                querystr="SELECT * FROM article_table WHERE publish_time <= '"+req.query.endtime+
                  "'  AND category_ID="+req.query.categoryId+" ORDER BY ID DESC LIMIT "+result.startNum+",15"
              }
          }else if(!req.query.searchTitle){
             //只有结束时间
             if(req.query.parentId){
                querytotalstr="SELECT COUNT(*) AS totalCount FROM article_table WHERE publish_time >= '"+req.query.starttime+
                  "'  AND publish_time <= '"+req.query.endtime+"' AND parent_ID="+req.query.parentId
                querystr="SELECT * FROM article_table WHERE publish_time >= '"+req.query.starttime+
                  "'  AND publish_time <= '"+req.query.endtime+"' AND parent_ID="+req.query.parentId+" ORDER BY ID DESC LIMIT "+result.startNum+",15"
              }else if(req.query.categoryId){
                querytotalstr="SELECT COUNT(*) AS totalCount FROM article_table WHERE publish_time >= '"+req.query.starttime+
                  "'  AND publish_time <= '"+req.query.endtime+"' AND category_ID="+req.query.categoryId
                querystr="SELECT * FROM article_table WHERE  publish_time >= '"+req.query.starttime+
                  "'  AND publish_time <= '"+req.query.endtime+"' AND category_ID="+req.query.categoryId+" ORDER BY ID DESC LIMIT "+result.startNum+",15"
              }

          }else if(req.query.searchTitle &&req.query.starttime && req.query.endtime){
             //三者都有
             if(req.query.parentId){
               querytotalstr="SELECT COUNT(*) AS totalCount FROM article_table WHERE publish_time >= '"+req.query.starttime+
                  "'  AND publish_time <= '"+req.query.endtime+"' AND title LIKE '%"+req.query.searchTitle+
                  "%' AND parent_ID="+req.query.parentId

                querystr="SELECT * FROM article_table WHERE publish_time >= '"+req.query.starttime+
                  "'  AND publish_time <= '"+req.query.endtime+"' AND title LIKE '%"+req.query.searchTitle+"%' AND parent_ID="+req.query.parentId+
                  " ORDER BY ID DESC LIMIT "+result.startNum+",15"
              }else if(req.query.categoryId){
                querytotalstr="SELECT COUNT(*) AS totalCount FROM article_table WHERE publish_time >= '"+req.query.starttime+
                  "'  AND publish_time <= '"+req.query.endtime+"' AND title LIKE '%"+req.query.searchTitle+
                  "%' AND category_ID="+req.query.categoryId

                querystr="SELECT * FROM article_table WHERE  publish_time >= '"+req.query.starttime+
                  "'  AND publish_time <= '"+req.query.endtime+"' AND title LIKE '%"+req.query.searchTitle+"%' AND category_ID="+req.query.categoryId+" ORDER BY ID DESC LIMIT "+result.startNum+",15"
              }
          }
     }else if(req.query.classId=="1"){
        querytotalstr="SELECT COUNT(*) AS totalCount FROM docooperate_table WHERE category_ID="+req.query.id+" AND name LIKE '%"+req.query.searchTitle+"%'"
        querystr="SELECT  * FROM docooperate_table WHERE category_ID="+req.query.id+" AND name LIKE '%"+req.query.searchTitle+"%' ORDER BY ID DESC LIMIT "+result.startNum+",15"
     }else if(req.query.classId=="2"){
         if(req.query.title){
            querytotalstr="SELECT COUNT(*) AS totalCount FROM dorecycle_table WHERE title LIKE '%"+req.query.title+"%' OR name LIKE '%"+
              req.query.title+"%'"
            querystr="SELECT  * FROM dorecycle_table WHERE title LIKE '%"+req.query.title+"%' OR name LIKE '%"+
              req.query.title+"%' ORDER BY ID DESC LIMIT "+result.startNum+",15";
         }else if(req.query.categoryId!=req.query.parentId && req.query.categoryId){
           querytotalstr="SELECT COUNT(*) AS totalCount FROM dorecycle_table WHERE category_ID="+req.query.categoryId+
            " AND classId="+req.query.classid
            querystr="SELECT  * FROM dorecycle_table WHERE category_ID="+req.query.categoryId+
            " AND classId="+req.query.classid+" ORDER BY ID DESC LIMIT "+result.startNum+",15"
         }else if(req.query.parentId && (req.query.parentId==req.query.categoryId)){
            querytotalstr="SELECT COUNT(*) AS totalCount FROM dorecycle_table WHERE parent_ID="+req.query.parentId+
            " AND classId="+req.query.classid
            querystr="SELECT  * FROM dorecycle_table WHERE parent_ID="+req.query.parentId+
             " AND classId="+req.query.classid+" ORDER BY ID DESC LIMIT "+result.startNum+",15"
         }else if(req.query.starttime && req.query.endtime){
            querytotalstr="SELECT COUNT(*) AS totalCount FROM dorecycle_table WHERE publish_time >= '"+req.query.starttime+
                  "'  AND publish_time <= '"+req.query.endtime+"'";
            querystr="SELECT  * FROM dorecycle_table WHERE publish_time >= '"+req.query.starttime+
                  "'  AND publish_time <= '"+req.query.endtime+"' ORDER BY ID DESC LIMIT "+result.startNum+",15"
         } 
      } 
      
      db.query(querytotalstr,(err,data)=>{
           if(err){
              console.log('search count err1:'+err);
              res.status(500).end("db err")
           }else{
              data = JSON.parse(JSON.stringify(data))
              req.query.act=="group"?common.dogroup(result,data,req):common.dosingle(result,data,req)
          }
      })

      db.query(querystr,(err,data)=>{
           if(err){
              console.log('search count err2:'+err);
              res.status(500).end("db err")
           }else{
              data = JSON.parse(JSON.stringify(data))
              result.items=data;
              result.classId=req.query.classId; 
              result.searchMsg={
                title:req.query.searchTitle || req.query.title,
                starttime:req.query.starttime,
                endtime:req.query.endtime,
              }
              if(req.query.parentId){
                db.query(`SELECT name FROM column_table WHERE ID=${req.query.parentId}`,(err,data)=>{
                   if(err){
                     console.log('find column err:'+err)
                   }else{
                      data = JSON.parse(JSON.stringify(data))
                      result.searchMsg.parentName=data[0].name
                      if(req.query.classId=="2"&& req.query.parentId!=req.query.categoryId){
                        result.searchMsg.category=req.query.category
                      }
                      console.log(result.searchMsg)
                      res.render("admin/dosearch.html",{article_data:result})
                   }
                })
              }else{
                 // console.log(result)
                 res.render("admin/dosearch.html",{article_data:result})
              }      
          }
      })    
  });

  router.post('/',(req,res)=>{
      console.log(req.body)
    
  })
  
  return router;
};