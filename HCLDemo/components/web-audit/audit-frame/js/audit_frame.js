/*es6的新技术:
	使用let声明变量,只在let声明的作用域中有效
*/
function addEvent(){
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
	$(".audit-header .audit-top>p").hover(function(){
		$(".user-menu-box").show();
	},function(){
		if(!$(".user-menu-box").is(":focus")){
			$(".user-menu-box").hide();
		}
	});
	$(".user-menu-box").on("mouseenter",function(){
		$(".user-menu-box").show();
	});
	$(".user-menu-box").on("mouseleave",function(){
		$(".user-menu-box").hide();
	});
	
}
$(function(){
	addEvent();
	$(".audit-right").load("../myMessage/my-message.html");
})