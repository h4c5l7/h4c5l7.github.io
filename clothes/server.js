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
var util = require("util");
var app = express();
app.use(express.static('public'));
app.use(cookieParser('sessionClothes'));
app.use(session({
    secret: 'sessionClothes',//与cookieParser中的一致
    resave: true,
    saveUninitialized:true,
    cookie: { maxAge: 24*60*60* 1000 }
}));

function ismobile(req){
	var deviceAgent = req.headers["user-agent"].toLowerCase();
	var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
	if(agentID){
		//指到手机、pad的网页
		return "/phoneHtml";
	}else{
		//指到pc网页
		return "/html";
	}
	
}
app.get('/',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+ismobile(req)+"/mainStore.html",'utf8');
	}else{
		res.sendFile(__dirname+ismobile(req)+"/login.html",'utf8');
	}
})
app.get('/login.html',function(req,res){
    res.sendFile(__dirname+ismobile(req)+'/login.html','utf8');
})
app.get('/index.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+ismobile(req)+'/index.html','utf8');
	}else{
		res.redirect(302,'/login.html');
	}
	
})
app.get('/test.html',function(req,res){
	res.sendFile(__dirname+'/test.html','utf-8');
})

app.get('/mainStore.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+ismobile(req)+'/mainStore.html','utf8');
	}else{
		res.redirect(302,'/login.html');
	}
})
app.get('/body.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+ismobile(req)+'/body.html','utf8');
	}else{
		res.sendFile(__dirname+ismobile(req)+'/login.html','utf8');
	}
	
})
app.get('/search.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+ismobile(req)+'/search.html','utf8');
	}else{
		res.sendFile(__dirname+ismobile(req)+'/login.html','utf8');
	}
})
app.get('/one.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+ismobile(req)+'/one.html','utf8');
	}else{
		res.sendFile(__dirname+ismobile(req)+'/login.html','utf8');
	}
})
app.get('/two.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+ismobile(req)+'/two.html','utf8');
	}else{
		res.sendFile(__dirname+ismobile(req)+'/login.html','utf8');
	}
})
app.get('/three.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+ismobile(req)+'/three.html','utf8');
	}else{
		res.sendFile(__dirname+ismobile(req)+'/login.html','utf8');
	}
})
app.get('/four.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+ismobile(req)+'/four.html','utf8');
	}else{
		res.sendFile(__dirname+ismobile(req)+'/login.html','utf8');
	}
})
app.get('/oper.html',function(req,res){
	if(req.session.user){
		res.sendFile(__dirname+ismobile(req)+'/oper.html','utf-8');
	}else{
		res.sendFile(__dirname+ismobile(req)+'/login.html','utf8');
	}
})
app.get('/header.html',function(req,res){
	res.sendFile(__dirname+'/phoneHtml/header.html','utf8');
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
/*库存具体查询页面*/
app.post('/all_search',urlencodedParser,function(req,res){
	var _id = req.body._id;
	var status = req.body.status;
	var startDate = req.body.startDate1;
	var endDate = req.body.endDate1;
	var dateCheckbox = req.body.dateCheckbox;
	var db = connectDataBase();
	var strTemp = "";
	if(_id!=""){
		if(isNaN(parseInt(_id))){
			strTemp += " and _id=\'"+_id+"\'";
		}else{
			strTemp += " and (_id=\'"+_id+"\' or _id="+_id+")";
		}
	} 
	if(status!="") strTemp += " and status="+status;
	if(dateCheckbox == '1'){
		if(startDate !="") strTemp += " and _date>=\'"+startDate+"\'";
		if(endDate!="") strTemp += " and _date<=\'"+endDate+"\'";
	}
	strTemp = "SELECT * FROM clothing_jour where 1=1"+strTemp;
	console.log(strTemp);
	db.all(strTemp,function(err,row){
		if(row != undefined){
			res.end(JSON.stringify(row));
		}else{
			res.end(row);
		}
		db.close(function(e){
	   		if(e) throw e;
	   	 });
	})
	
})
/*填满格子*/
app.post('/searchForTd',urlencodedParser,function(req,res){
	var db = connectDataBase();
	db.all("select _id,store_id,_date from clothing_jour where status=?",[1],function(err,row){
	   // 输出 JSON 格式,必须以json字符串格式返回，否则报错
	   if(row != undefined){
			res.end(JSON.stringify(row));
		}
	   db.close(function(e){
	   		if(e) throw e;
	   	 });
	})
})
/*右侧查询*/
app.post('/search_post',urlencodedParser,function(req,res){
	var search_orderNum = req.body.search_orderNum;
	var db = connectDataBase();
	var sqlParam;
	if(isNaN(parseInt(search_orderNum))){
		sqlParam =[search_orderNum,search_orderNum,1];
	}else{
		sqlParam =[search_orderNum,parseInt(search_orderNum),1];
	}
	db.get("SELECT _id,store_id FROM clothing_jour where (_id=? or _id=?) and status=?",sqlParam,function(err,row){
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
   var orderNum = req.body.orderNum;
   var sqlParam;
	if(isNaN(parseInt(orderNum))){
		sqlParam =[orderNum,orderNum];
	}else{
		sqlParam =[orderNum,parseInt(orderNum)];
	}
   //先查询在一区中是否已经使用了该订单号
   db.each("SELECT count(1) as count FROM clothing_jour where _id=? or _id=?",sqlParam,function(err,row){
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
	 if(isNaN(parseInt(req.body._id))){
		 stmt.run(2, req.body._id,req.body._id);
	 }else{
		 stmt.run(2, req.body._id,parseInt(req.body._id));
	 }
	 stmt.finalize();
	 db.close(function(e){
   		if(e) throw e;
   	 });
   	 res.send("出库成功！");
});
//修改仓库地址
app.post('/updateStoreId',urlencodedParser,function(req,res){
	var db = connectDataBase();
	var stmt = db.prepare("UPDATE clothing_jour set store_id=? where _id =? or _id=?");
	if(isNaN(parseInt(req.body._id))){
		 stmt.run(req.body.store_id, req.body._id,req.body._id);
	 }else{
		 stmt.run(req.body.store_id, req.body._id,parseInt(req.body._id));
	 }
	
	 stmt.finalize();
	 db.close(function(e){
   		if(e) throw e;
   	 });
   	 res.send("修改仓库成功！");
})
app.listen(8888);
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
console.log('Server running at http://127.0.0.1:8888/');