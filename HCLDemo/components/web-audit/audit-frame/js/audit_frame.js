/*es6的新技术:
	使用let声明变量,只在let声明的作用域中有效
*/
function addEvent(){
	//头部菜单栏点击事件
	$(".audit-header .audit-top>ul>li").hover(function(){
		//debugger
		$(this).find("ul").css("display","block");
		var liWidth = 0;
		var childrenLi = $(this).find("ul").find("li");
		for(let i=0;i<childrenLi.length;i++){
			liWidth+=childrenLi.width();
		}
		var thisOffsetLeft = $(this).offset().left+20+(($(this).width()-liWidth)/2);
		$(this).find("ul").css("padding-left",thisOffsetLeft);
	},function(){
		$(this).find("ul").css("display","none");
	});
	//修改密码，退出的box的显示和隐藏
	$(".audit-header .audit-top>p").hover(function(){
		$(".user-menu-box").show();
	},function(){
		if(!$(".user-menu-box").is(":focus")){
			$(".user-menu-box").hide();
		}
	});
	//修改密码，退出的box的显示和隐藏
	$(".user-menu-box").on("mouseenter",function(){
		$(".user-menu-box").show();
	});
	$(".user-menu-box").on("mouseleave",function(){
		$(".user-menu-box").hide();
	});
	//左侧快捷方式的显示和隐藏
	$(".audit-left").hover(function(){
		if($("#left-expand-btn").hasClass("left-out")){
			$(".audit-left").stop().animate({left:0});
			//$("#left-expand-btn").animate({left:"60px"});		
			$("#left-expand-btn").removeClass("left-out").addClass("left-in");
		}
		
	},function(){
		if($("#left-expand-btn").hasClass("left-in")){
			$(".audit-left").stop().animate({left:-$("#shortcut").width()});	
			//$("#left-expand-btn").animate({left:0});
			$("#left-expand-btn").removeClass("left-in").addClass("left-out");
		}
	})
	//点击加号弹出添加快捷键的对话框
	$("#shortcut").on("click",'>ul>li.add',function(){
		$("#modal-back").addClass("active");
	})
	//快捷键对话框的快捷键选择，样式更改
	$("#modal .term").on("click",">ul>li",function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
		}else{
			$(this).addClass("active");
		}
	})
	//关闭对话框
	$("#modal").on("click",">h3>i",function(){
		$("#modal-back").removeClass("active");
	})
	//确认按钮
	$("#modal").on("click",">p>button",function(){
		var shortcutArr = [];
		//遍历li
		$("#modal .term>ul>li.active").each(function(){
			let shortcutObj = new Object();
			shortcutObj.iconName = $(this).attr("iconName");
			shortcutObj.shortcutName = $(this).text();
			shortcutArr.push(shortcutObj);
		})
		addShortcut(shortcutArr);
		$(".audit-left").css("left",-$("#shortcut").width()+"px");
		$("#modal-back").removeClass("active");
	})
}
//初始化快捷键
function initShortcut(shortcutArr){
	addShortcut(shortcutArr);
	$(".audit-left").css("left",-$("#shortcut").width()+"px");
	$("#shortcut").show();
}
//添加快捷键的ul元素节点
function addShortcut(shortcutArr){
	$("#shortcut").find("ul").remove();
	let mathceil = Math.ceil((shortcutArr.length+1)/6);
	for(let i=0;i<mathceil;i++){
		$("#shortcut").append("<ul></ul>");
	}
	
	$("#shortcut").find("ul").eq(0).append('<li class="add"><img src="imgs/icon_add.png" alt=""/></li>');
	let k=0;
	for(let j=0;j<shortcutArr.length;j++){
		if((j+1)%6 !=0){
			$("#shortcut").find("ul").eq(k).append('<li><i class="'+shortcutArr[j].iconName+'"></i><span>'+shortcutArr[j].shortcutName+'</span></li>');
		}else{
			k++;
			$("#shortcut").find("ul").eq(k).append('<li><i class="'+shortcutArr[j].iconName+'"></i><span>'+shortcutArr[j].shortcutName+'</span></li>');
		}
	}
}
$(function(){
	var shortcutArrGlobal = [/*{"iconName":"icon-message","shortcutName":"我的消息"}*/];
	addEvent();
	initShortcut(shortcutArrGlobal);
	$(".audit-right").load("../my-message/my-message.html");
})