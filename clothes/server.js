/**
 * New node file
 */
var http = require("http");
var express = require('express');
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended:false});
var sqlite3 = require('sqlite3');
var sd = require('silly-datetime');

var app = express();
app.use(express.static('public'));
app.get('/index.html',function(req,res){
	res.sendFile(__dirname+'/html/index.html','utf8');
})
app.get('/one.html',function(req,res){
	res.sendFile(__dirname+'/html/one.html','utf8');
})
app.get('/two.html',function(req,res){
	res.sendFile(__dirname+'/html/two.html','utf8');
})
app.get('/three.html',function(req,res){
	res.sendFile(__dirname+'/html/three.html','utf8');
})
app.get('/four.html',function(req,res){
	res.sendFile(__dirname+'/html/four.html','utf8');
})
app.get('/oper.html',function(req,res){
	res.sendFile(__dirname+'/html/oper.html','utf-8');
})
/*填满格子*/
app.post('/searchForTd',urlencodedParser,function(req,res){
	var db = connectDataBase();
	db.all("select _id,store_id from clothing_jour where store_id like ? and status=?",[req.body.area+"%",1],function(err,row){
	   // 输出 JSON 格式
	   res.end(JSON.stringify(row));
	   db.close(function(e){
	   		if(e) throw e;
	   		else console.log('查询所有：关闭数据库成功！');
	   	 });
	})
})
/*查询*/
app.post('/search_post',urlencodedParser,function(req,res){
	var search_orderNum = req.body.search_orderNum;
	var db = connectDataBase();
	db.get("SELECT _id,store_id FROM clothing_jour where _id=? and status=?",[search_orderNum,1],function(err,row){
		if(row == undefined){
			res.send(false);
		}else{
			var param = {"_id":row._id,"store_id":row.store_id};
			res.end(JSON.stringify(param));
			//res.send("订单"+row._id+"存放在"+row.store_id+"号仓库中，是否需要出库？");
		}
		db.close(function(e){
	   		if(e) throw e;
	   		else console.log('查询：关闭数据库成功！');
	   	 });
	})
})
/*入库*/
app.post('/pullIn_post',urlencodedParser,function(req,res){
	// 输出 JSON 格式
   var db = connectDataBase();
   //先查询在一区中是否已经使用了该订单号
   db.each("SELECT count(1) as count FROM clothing_jour where _id=\'"+req.body.orderNum+"\'",function(err,row){
   		if(err) throw err;
   		if(row.count>0){
   			res.send("0");
   		}else{
   			//订单号未使用，新增一条记录 ，status=1为入库，status=2为出库
   			var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
   			var stmt = db.prepare("INSERT INTO clothing_jour (_id,store_id,price,_date,status,remark) VALUES (?,?,?,?,?,?)");
			stmt.run(req.body.orderNum,req.body.store_id,req.body.price,time,1,req.body.remark);
			stmt.finalize();
		   	res.send("1");
   		}
   		db.close(function(e){
	   		if(e) throw e;
	   		else console.log('入库：关闭数据库成功！');
	   	 });
   })
});
//出库
app.post('/pullOut_post',urlencodedParser,function(req,res){
	 var db = connectDataBase();
	 var stmt = db.prepare("UPDATE clothing_jour set status=? where _id =?");
	 stmt.run(2, req.body._id);
	 stmt.finalize();
	 db.close(function(e){
   		if(e) throw e;
   		else console.log('出库：关闭数据库成功！');
   	 });
   	 res.send("出库成功！");
});
app.listen(8888);
//创建sqlite连接
function connectDataBase(){
	var db = new sqlite3.Database('clothing.db3',sqlite3.OPEN_READWRITE,function(err){
		if(err) throw err;
		console.log('数据库连接成功！');
   });
   return db;
}
/*var server = http.createServer(function (request, response) {

    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    response.writeHead(200, {'Content-Type': 'text/html'});
	response.end("hello world");
}).listen(8888);
*/
// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');