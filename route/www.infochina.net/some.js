async.eachSeries(randomArr,(item,callback)=>{
                          console.log(item)
                            db.query(`SELECT * FROM article_table WHERE ID=${item}`,(err,data)=>{
                               data=JSON.parse(JSON.stringify(data));
                               indexData.random_data=indexData.random_data.concat(data);
                               console.log(indexData.random_data)
                            },function(err){
                              if(err){
                                console.log(err)
                              }else{
                                  for(var i=0;i<indexData.length;i++){
                                    indexData.random_data[i].shortContent=
                                    indexData.random_data[i].content.replace(/<[^<>]+?>/g,'').replace(/&nbsp;/g,"  ").slice(0,58)+"..."
                                  }
                                  db.query(`SELECT * FROM docooperate_table ORDER BY weight DESC`,(err,hzxg_data)=>{
                         if(err){
                          console.log("find 合作相关 err:"+err);
                          res.status(500).send('db err').end()
                         }else{
                              hzxg_data = JSON.parse(JSON.stringify(hzxg_data))
                              indexData.hzxg_data=hzxg_data;
                              for(var i=0;i<hzxg_data.length;i++){
                                 if(hzxg_data[i].category_ID==4)
                                   indexData.youcelb_data.push(hzxg_data[i])
                              }
                              db.query(`SELECT * FROM  article_table WHERE category_ID=5 ORDER BY weight \
                                DESC LIMIT 0,1`,(err,rightlsh_data)=>{
                                    if(err){
                                       console.log("find right lishihui err:"+err);
                                       res.status(500).send("db err").end();
                                    }else{
                                         rightlsh_data = JSON.parse(JSON.stringify(rightlsh_data))
                                         var str=rightlsh_data[0].content.replace(/<[^<>]+?>/g,'').replace(/&nbsp;/g,"  ");
                                         rightlsh_data.shortContent=str.slice(0,60)+".....";
                                         indexData.rightlsh_data=rightlsh_data;
                                         res.render('web/news.html',{indexData:indexData})
                                    }
                               })
                             
                         }
                  })  
                              }
                            })
                        })

                  })