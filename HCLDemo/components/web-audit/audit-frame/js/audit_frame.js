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
		/*if($("#left-expand-btn").hasClass("left-out")){
			$(".audit-left").animate({left:0});
			$("#left-expand-btn").animate({left:"60px"});		
			$("#left-expand-btn").removeClass("left-out").addClass("left-in");
		}*/
		
	},function(){
		/*if($("#left-expand-btn").hasClass("left-in")){
			$(".audit-left").animate({left:"-60px"});		
			$("#left-expand-btn").animate({left:0});
			$("#left-expand-btn").removeClass("left-in").addClass("left-out");
		}*/
	})
	//点击加号弹出添加快捷键的对话框
	$(".add").on("click",function(){
		debugger
		$("#modal-back").addClass("active");
	})
}
function altShortcut(){
	/*var ulHeight = $(window).height()-70px;
	if($(window).height()>ulHeight){
		
	}*/
}
$(function(){
	addEvent();
	//$(".audit-right").load("../myMessage/my-message.html");
})