$(document).ready(function() {
		var onePage = {
			//校验
			verifyFun:function(){
				var orderNum = $("#orderNum").val();
				if(orderNum == false){
					alert("请输入订单编号！");
					return false;
				}
				var re2 =  /^[0-9a-zA-Z]*$/g;
				if(!re2.test(orderNum)){
					alert("订单编号只能输入数字和字母");
					return false;
				}
				var re = /^\d+(?=\.{0,1}\d+$|$)/;
				var price =  $("#price").val();
				if(!re.test(price)){
					alert("价格输入有误，请输入数字");
					return false;
				}
				return true;
			},
			searchOrder:function(){
				var search_orderNum = $("#search_orderNum").val();
					if(search_orderNum == ""){
						alert("请输入订单编号查询！");
						return false;
					}
					$.ajax({
						url:"/search_post",
						type:"POST",
						data:"search_orderNum="+search_orderNum,
						success:function(result){
							if(result === false){
								alert("在仓库内没有查询到该订单！");
							}else{
								//询问是否出库
								var param = JSON.parse(result);
								$("table tr td[value='"+param.store_id+"']").addClass("redBgColor");
								setTimeout(function(){
									var tipMess = "订单"+param._id+"存放在"+param.store_id+"号仓库中，是否需要出库？";
									if(confirm(tipMess)){
										//确认出库
										//让 status变为2，
										$.ajax({
											url:"/pullOut_post",
											type:"POST",
											data:"_id="+search_orderNum,
											success:function(result1){
												$("div[title='"+param._id+"']").remove();
												alert(result1);
											}
										})
									}
									$("table tr td[value='"+param.store_id+"']").removeClass("redBgColor");
								},100);
							}
						}
					})
			},
			//初始化事件
			initEvent:function(){
				_this = this;
				//td的点击事件
				$("body").on("click",function(e){//这样做的原因是可能不是点击在td上，但是在td的范围内。
					var sUserAgent = navigator.userAgent.toLowerCase();
					var agentID = sUserAgent.match(/(iphone|ipod|ipad|android)/);
					if(!agentID){
						var tdText;
						if(e.target.tagName == 'TD'){
							tdText = $(e.target).attr("value");
						}
						if(e.target.tagName == 'P'){
							tdText = $(e.target).parent().attr("value");
						}
						/*if((e.target.tagName == 'TD' || e.target.tagName == 'P') && e.target.innerText != '一区'){
							var clientX = e.clientX;
							var clientY = e.clientY;
							$("#show_button").css("left",clientX).css("top",clientY);
							$("#show_button").show();
							$("#store_id").find("option[value='"+tdText+"']").prop("selected",true);
							$("body").on("click","#show_button",function(e2){
								$("#orderNum").focus();
								$("#show_button").hide();
							})
						}else{
							$("#show_button").hide();
						}*/
						if(e.target.tagName == 'DIV' && $(e.target).hasClass('orderBox')){
							tdText = $(e.target).parent().attr("value");
						}
						if(e.target.tagName == 'TD' || e.target.tagName == 'P' || (e.target.tagName == 'DIV' && $(e.target).hasClass('orderBox'))){
							var clientX = e.clientX;
							var clientY = e.clientY;
							$("#show_button").css("left",clientX).css("top",clientY);
							$("#show_button").show();
							$("#store_id").find("option[value='"+tdText+"']").prop("selected",true);
							$("body").on("click","#show_button",function(e2){
								$("#orderNum").focus();
								$("#show_button").hide();
							})
						}else{
							$("#show_button").hide();
						}
					}
				})
				$("div.orderBox").scroll(function(e) {
				 	tdText = $(e.target).parent().attr("value");
				 	$("#store_id").find("option[value='"+tdText+"']").prop("selected",true);
				});
				/*$("body").on('click','td',function(e){
					var sUserAgent = navigator.userAgent.toLowerCase();
					var agentID = sUserAgent.match(/(iphone|ipod|ipad|android)/);
					if(agentID){
						if($(this).attr("value") !='一区'){
							$("#store_id").find("option[value='"+$(this).attr("value")+"']").prop("selected",true);
							document.getElementById("orderNum").focus();
						}
					}
				})*/
				//出库
				$("body").on("click",".orderStyle",function(e){
					var e=window.event||e;
    				    e.stopPropagation();
					var search_orderNum = $(this).attr("title");
					if(confirm("订单"+search_orderNum+"是否需要出库？")){
						//确认出库
						//让 status变为2，
						$.ajax({
							url:"/pullOut_post",
							type:"POST",
							data:"_id="+search_orderNum,
							success:function(result1){
								$("div[title='"+search_orderNum+"']").remove();
								alert(result1);
							}
						})
					}
				})
				//查询订单
				$("#searchBtn").on('click',function(){
					_this.searchOrder();
				})
				$("#search_orderNum").on('keypress',function(e){
					var e = window.event ||e;
					e.stopPropagation();
					if(event.keyCode == 13){
						_this.searchOrder();
					}
				})
				selectText($("#search_orderNum"),'click');
				selectText($("#orderNum"),'click');
				selectText($("#price"),'click');
				selectText($("#remark"),'click');
			}
			
		}
	    var options = {
			success:function(data,statusText){
				if(data == 0){
					setTimeout(function(){alert("该订单号已使用过！");},100);
				}
				if(data == 1){
					var orderNum = $("#orderNum").val();
					var store_id = $("#store_id").val();
					if(orderNum.length>2){
						$("table tr td[value='"+store_id+"'] .orderBox").append("<div class='orderStyle' title='"+orderNum+"' ondragstart='drag(event)' draggable='true'>"+orderNum.substring(0,2)+"..</div>");
					}else{
						$("table tr td[value='"+store_id+"'] .orderBox").append("<div class='orderStyle' title='"+orderNum+"' ondragstart='drag(event)' draggable='true'>"+orderNum.substring(0,2)+"</div>");
					}
					$("table tr td").removeClass('blueBgColor');
					$("table tr td[value='"+store_id+"']").addClass("blueBgColor");
					setTimeout(function(){alert("入库成功！");},100);
				}
				$("#orderNum").select();
			},
			error:function(data){
				alert(data.message);
			},
			beforeSubmit:function(arr,$form,options){
				return onePage.verifyFun();
			}
		};
		onePage.initEvent();
	    // bind form using 'ajaxForm' 
	    $('#form').ajaxForm(options).submit(function(){
	    	return false;
	    });
	 });
function selectText(obj,event){
	obj.on(event,function(){
		obj.select();
	})
}
