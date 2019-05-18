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
  router.get('/', (req, res)=>{
    var indexData={
      column_data:{},
      zhzx_data:{},
      yxal_data:{},
      lsdt_data:{},
      hzxg_data:{},
      rightlsh_data:{},
      youcelb_data:[],
      sybanner_data:{}
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
                  db.query(`SELECT * FROM article_table WHERE parent_ID=2 \
                    ORDER BY weight DESC LIMIT 0,5`,(err,zhzx_data)=>{
                     if(err){
                      console.log("find 智慧资讯 err:"+err);
                      res.status(500).send('db err').end()
                     }else{
                        zhzx_data = JSON.parse(JSON.stringify(zhzx_data))
                        
                        for(var i=0;i<zhzx_data.length;i++){
                          var str= zhzx_data[i].content.replace(/<[^<>]+?>/g,'').replace(/&nbsp;/g,"  ");
                          zhzx_data[i].shortContent=str.slice(0,60)+"..."
                        }
                        indexData.zhzx_data=zhzx_data;

                        db.query(`SELECT * FROM article_table WHERE parent_ID=3 \
                          ORDER BY weight DESC LIMIT 0,6`,(err,yxal_data)=>{
                             if(err){
                              console.log("find 优秀案例 err:"+err);
                              res.status(500).send('db err').end()
                             }else{
                                yxal_data = JSON.parse(JSON.stringify(yxal_data))
                                
                                for(var i=0;i<yxal_data.length;i++){
                                  var str= yxal_data[i].content.replace(/<[^<>]+?>/g,'').replace(/&nbsp;/g,"  ");
                                  yxal_data[i].shortContent=str.slice(0,60)+"..."
                                }
                                indexData.yxal_data=yxal_data;

                                 db.query(`SELECT * FROM article_table WHERE parent_ID=4 \
                                  ORDER BY weight DESC LIMIT 0,6`,(err,lsdt_data)=>{
                                   if(err){
                                    console.log("find 品牌活动 err:"+err);
                                    res.status(500).send('db err').end()
                                   }else{
                                      lsdt_data = JSON.parse(JSON.stringify(lsdt_data))
                     
                                      for(var i=0;i<lsdt_data.length;i++){
                                        var str= lsdt_data[i].content.replace(/<[^<>]+?>/g,'').replace(/&nbsp;/g,"  ");
                                        lsdt_data[i].shortContent=str.slice(0,60)+"..."
                                      }
                                      indexData.lsdt_data=lsdt_data;

                                      db.query(`SELECT * FROM docooperate_table ORDER BY \n
                                        weight DESC`,(err,hzxg_data)=>{
                                          if(err){
                                            console.log("find 合作相关 err:"+err);
                                            res.status(500).send('db err').end()
                                           }else{
                                              hzxg_data = JSON.parse(JSON.stringify(hzxg_data))
                                              indexData.hzxg_data=hzxg_data;
                                               for(var i=0;i<hzxg_data.length;i++){
                                                     if(hzxg_data[i].category_ID==4){
                                                       indexData.youcelb_data.push(hzxg_data[i])
                                                     }
                                               }
                                              db.query(`SELECT * FROM article_table WHERE category_ID=20 \
                                                  ORDER BY weight DESC LIMIT 0,5`,(err,sybanner_data)=>{
                                                  if(err){
                                                     console.log('find 首页banner 出错:'+err);
                                                     res.status(500).send("db err").end();
                                                  }else{
                                                    sybanner_data = JSON.parse(JSON.stringify(sybanner_data))
                                                     indexData.sybanner_data=sybanner_data;
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
                                                               res.render('web/index.html',{indexData:indexData})
                                                          }
                                                     })
                                                               
                                                    }
                                                 })//最后一个查询结束         
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
        }       
      })
  });

  router.post('/',(req,res)=>{
  })

  router.use('/zhihuizixun', require('./zhihuizixun.js')());
  router.use('/youxiuanli', require('./youxiuanli.js')());
  router.use('/pinpaihuodong', require('./pinpaihuodong.js')());
  router.use('/lishihui', require('./lishihui.js')());
  router.use('/yanjiuyuan', require('./yanjiuyuan.js')());
  router.use('/guanyuwomen', require('./guanyuwomen.js')());
  router.use('/rencaizhaopin', require('./rencaizhaopin.js')());
  router.use('/news', require('./news.js')());
  router.use('/search', require('./search.js')());
  return router;
};