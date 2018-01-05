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
			//初始化事件
			initEvent:function(){
				_this = this;
				//td的点击事件
				$("body").on("click",function(e){
					var tdText;
					if(e.target.tagName == 'TD'){
						tdText = $(e.target).attr("value");
					}
					if(e.target.tagName == 'P'){
						tdText = $(e.target).parent().attr("value");
					}
					if((e.target.tagName == 'TD' || e.target.tagName == 'P') && e.target.innerText != '一区'){
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
				})
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
								//出库
								var param = JSON.parse(result);
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
							}
						}
					})
				})
			}
			
		}
	    var options = {
			success:function(data,statusText){
				if(data == 0){
					alert("该订单号已使用过！");
				}
				if(data == 1){
					var orderNum = $("#orderNum").val();
					var store_id = $("#store_id").val();
					if(orderNum.length>2){
						$("table tr td[value='"+store_id+"'] .orderBox").append("<div class='orderStyle' title='"+orderNum+"'>"+orderNum.substring(0,2)+"..</div>");
					}else{
						$("table tr td[value='"+store_id+"'] .orderBox").append("<div class='orderStyle' title='"+orderNum+"'>"+orderNum.substring(0,2)+"</div>");
					}
					
					alert("入库成功！");
				}
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
	    $('#form').ajaxForm(options).submit(function(){return false;}); 
	 });