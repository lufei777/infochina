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
    var indexData={
      column_data:{},
      hzxg_data:{},
      fzr_data:[],
      youcelb_data:[],
      zr_data:[],
      gw_data:[],
      rightlsh_data:{},
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
                     if(data[i].ID==3)
                       indexData.allChildCol=data[i].child_column
                  }            
                  
                  db.query(`SELECT * FROM article_table WHERE category_ID=7`,(err,data)=>{
                     if(err){
                        console.log("find 关于我们 err："+err);
                        res.status(500).send("db err").end();
                     }else{
                        data=JSON.parse(JSON.stringify(data))
                        indexData.gywm_data=data;
                        db.query(`SELECT * FROM  article_table WHERE \
                          category_ID=5 ORDER BY weight \
                            DESC LIMIT 0,1`,(err,rightlsh_data)=>{
                                if(err){
                                   console.log("find right lishihui err:"+err);
                                   res.status(500).send("db err").end();
                                }else{
                                     rightlsh_data = JSON.parse(JSON.stringify(rightlsh_data))
                                     var str=rightlsh_data[0].content.replace(/<[^<>]+?>/g,'').replace(/&nbsp;/g,"  ");
                                     rightlsh_data.shortContent=str.slice(0,60)+".....";
                                     indexData.rightlsh_data=rightlsh_data;
                                     db.query(`SELECT * FROM docooperate_table ORDER BY \
                                      weight DESC`,(err,hzxg_data)=>{
                                         if(err){
                                          console.log("find 合作相关 err:"+err);
                                          res.status(500).send('db err').end()
                                         }else{
                                              hzxg_data = JSON.parse(JSON.stringify(hzxg_data))
                                              indexData.hzxg_data=hzxg_data
                                              for(var i=0;i<hzxg_data.length;i++){
                                                if(hzxg_data[i].category_ID==12)
                                                  indexData.fzr_data.push(hzxg_data[i])
                                                else if(hzxg_data[i].category_ID==4)
                                                  indexData.youcelb_data.push(hzxg_data[i]);
                                                else if(hzxg_data[i].category_ID==13)
                                                  indexData.zr_data.push(hzxg_data[i])
                                                else if(hzxg_data[i].category_ID==11)
                                                  indexData.gw_data.push(hzxg_data[i])
                                              }
                                              indexData.fzrRow=Math.ceil(indexData.fzr_data.length/7)
                                              indexData.gwRow=Math.ceil(indexData.gw_data.length/7)
                                              res.render('web/seven.html',{indexData:indexData})
                                         }
                                    })
                                }
                           })
                     }
                  })
                }
            })
        }       
      })
  });

  router.post('/',(req,res)=>{
  })
  return router;
};