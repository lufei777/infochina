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
  router.get('/', (req, res)=>{
    console.log(req.query)
    var indexData={
      column_data:{},
      zhzx_data:{},
      hzxg_data:{},
      youcelb_data:[],
      currentPage:req.query.page,
      totalCount:"",
      totalPages:0,
      startNum:(req.query.page-1)*15,
      pageArr:[]
    }
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
                      indexData.column_data=data
                      for(var i=0;i<data.length;i++){
                         if(data[i].ID==2)
                           indexData.allChildCol=data[i].child_column
                      }

                      common.queryColumnData(db,req,indexData,res,"web/second.html")
                }
            })
        }       
      })
  });

  router.post('/',(req,res)=>{
  })
  return router;
};