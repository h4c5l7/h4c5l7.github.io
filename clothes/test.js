var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('clothing.db3',sqlite3.OPEN_READWRITE,function(e){
		console.log(__dirname);
		if(e) throw e;
		console.log('是否连接数据库成功：'+'数据库连接成功！');
});
//先查询在一区中是否已经使用了该订单号
   db.each("SELECT count(1) as count FROM clothing_jour where _id='12'",function(err,row){
   		debugger
   		console.log(row.count);
   })
/*db.all("SELECT _id FROM clothing_jour",function(err,rows){
		console.log("sql执行是否正常："+ rows);
		debugger
			 rows.forEach(function(row){
	            console.log(row._id);
	        })
	});	*/
db.close();