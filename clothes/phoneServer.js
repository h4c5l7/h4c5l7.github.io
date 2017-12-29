/**
 * New node file
 */
var http = require("http");
var express = require('express');
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended:false});
var sqlite3 = require('sqlite3');
var sd = require('silly-datetime');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
app.use(express.static('phonePublic'));
app.use(cookieParser('sessionClothes'));
app.use(session({
    secret: 'sessionClothes',//与cookieParser中的一致
    resave: true,
    saveUninitialized:true
}));
app.get('/test.html',function(req,res){
	res.sendFile(__dirname+'/phoneHtml/new_file.html','utf8');
})
app.get('/login.html',function(req,res){
	if(req.session.user){
		res.redirect(302,'/index.html');
	}else{
		res.sendFile(__dirname+'/phoneHtml/login.html','utf8');
	}
})
app.get('/index.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+'/phoneHtml/index.html','utf8');
	}else{
		res.redirect(302,'/login.html');
	}
	
})
app.get('/body.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+'/phoneHtml/body.html','utf8');
	}else{
		res.redirect(302,'/login.html');
	}
	
})
app.get('/search.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+'/phoneHtml/search.html','utf8');
	}else{
		res.redirect(302,'/login.html');
	}
})
app.get('/one.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+'/phoneHtml/one.html','utf8');
	}else{
		res.redirect(302,'/login.html');
	}
})
app.get('/two.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+'/phoneHtml/two.html','utf8');
	}else{
		res.redirect(302,'/login.html');
	}
})
app.get('/three.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+'/phoneHtml/three.html','utf8');
	}else{
		res.redirect(302,'/login.html');
	}
})
app.get('/four.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+'/phoneHtml/four.html','utf8');
	}else{
		res.redirect(302,'/login.html');
	}
})
app.get('/oper.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+'/phoneHtml/oper.html','utf-8');
	}else{
		res.redirect(302,'/login.html');
	}
})
//登录校验
app.post('/login',urlencodedParser,function(req,res){
	var db = connectDataBase();
	db.get('select name,password from user where name=? and password=?',[req.body.name,req.body.password],function(err,row){
		if(row != undefined){
			req.session.user = row;
			res.send(true);
		}else{
			res.send(false);
		}
		db.close(function(e){if(e) throw e;});
	})
})
/*库存具体查询*/
app.post('/all_search',urlencodedParser,function(req,res){
	var _id = req.body._id;
	var status = req.body.status;
	var startDate = req.body.startDate1;
	var endDate = req.body.endDate1;
	var dateCheckbox = req.body.dateCheckbox;
	var db = connectDataBase();
	var strTemp = "";
	if(_id!="") strTemp += "and _id="+_id;
	if(status!="") strTemp += "and status="+status;
	if(dateCheckbox == '1'){
		if(startDate!="") strTemp += "and startDate="+startDate;
		if(endDate!="") strTemp += "and endDate="+endDate;
		
	}
	db.all("SELECT * FROM clothing_jour where 1=1 "+strTemp,function(err,row){
		res.end(JSON.stringify(row));
		db.close(function(e){
	   		if(e) throw e;
	   	 });
	})
	
})
/*填满格子*/
app.post('/searchForTd',urlencodedParser,function(req,res){
	var db = connectDataBase();
	db.all("select _id,store_id from clothing_jour where status=?",[1],function(err,row){
	   // 输出 JSON 格式
	   res.end(JSON.stringify(row));
	   db.close(function(e){
	   		if(e) throw e;
	   	 });
	})
})
/*右侧查询*/
app.post('/search_post',urlencodedParser,function(req,res){
	var search_orderNum = req.body.search_orderNum;
	var db = connectDataBase();
	db.get("SELECT _id,store_id FROM clothing_jour where (_id=? or _id=?) and status=?",[search_orderNum,parseInt(search_orderNum),1],function(err,row){
		if(row == undefined){
			res.send(false);
		}else{
			var param = {"_id":row._id,"store_id":row.store_id};
			res.end(JSON.stringify(param));
		}
		db.close(function(e){
	   		if(e) throw e;
	   	 });
	})
})
/*入库*/
app.post('/pullIn_post',urlencodedParser,function(req,res){
	// 输出 JSON 格式
   var db = connectDataBase();
   //先查询在一区中是否已经使用了该订单号
   db.each("SELECT count(1) as count FROM clothing_jour where _id=? or _id=?",[req.body.orderNum,parseInt(req.body.orderNum)],function(err,row){
   		if(err) throw err;
   		if(row.count>0){
   			res.send("0");
   		}else{
   			//订单号未使用，新增一条记录 ，status=1为入库，status=2为出库
   			var time=sd.format(new Date(), 'YYYYMMDD');
   			var stmt = db.prepare("INSERT INTO clothing_jour (_id,store_id,price,_date,status,remark) VALUES (?,?,?,?,?,?)");
			stmt.run(req.body.orderNum,req.body.store_id,req.body.price,time,1,req.body.remark);
			stmt.finalize();
		   	res.send("1");
   		}
   		db.close(function(e){
	   		if(e) throw e;
	   	});
   })
});
//出库
app.post('/pullOut_post',urlencodedParser,function(req,res){
	 var db = connectDataBase();
	 var stmt = db.prepare("UPDATE clothing_jour set status=? where _id =? or _id=?");
	 stmt.run(2, req.body._id,parseInt(req.body._id));
	 stmt.finalize();
	 db.close(function(e){
   		if(e) throw e;
   	 });
   	 res.send("出库成功！");
});
app.listen(9999);
//创建sqlite连接
function connectDataBase(){
	var db = new sqlite3.Database('clothing.db3',sqlite3.OPEN_READWRITE,function(err){
		if(err) throw err;
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
console.log('Server running at http://127.0.0.1:9999/');