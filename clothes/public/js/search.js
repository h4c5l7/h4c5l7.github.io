$(document).ready(function(){
	 var options = {
			success:function(data,statusText){
				var row = JSON.parse(data);
				$('#searchTable').bootstrapTable('destroy');
				var columns = [
					{field:'id',title:'序号',formatter:'indexNum'},
					{field:'_id',title:'客户编号'},
					{field:'store_id',title:'存放位置'},
					{field:'price',title:'价格'},
					{field:'status',title:'状态'},
					{field:'_date',title:'日期'},
					{field:'remark',title:'备注'},
					{field:'remark',title:'操作',formatter:'operate'},
					{field:'space',title:''}
				];
				$("#searchTable").bootstrapTable({
					columns:columns,
					rowStyle: function (row, index){
						var strclass = '';
						if(row.status == '1'){
							strclass = 'success';
						}
						return { classes: strclass };
					}
				});
				$("#searchTable").bootstrapTable("load",row);
			},
			error:function(data){
				alert(data.message);
			},
			beforeSubmit:function(arr,$form,options){
				
				return searchPage.verifyFun();
			}
		};
	 // bind form using 'ajaxForm' 
	 $('#searchForm').ajaxForm(options).submit(function(){return false;});
	 var searchPage = {
	 	//初始化事件
	 	initEvent:function(){
	 		//日期checkbox选择事件
	 		$("#dateCheckbox").on("click",function(){
	 			if($("#dateCheckbox").prop("checked")){
	 				$("input[name='startDate']").prop("disabled",false);
	 				$("input[name='endDate']").prop("disabled",false);
	 				$("input[name='dateCheckbox']").val("1");
	 			}else{
	 				$("input[name='dateCheckbox']").val("0");
	 				$("input[name='startDate']").prop("disabled",true);
	 				$("input[name='endDate']").prop("disabled",true);
	 			}
	 			
	 		})
	 		//出库标签点击事件
	 		$("#searchTable").on('click',"a",function(){
	 			var dataId = $(this).attr("data-id");
	 			$.ajax({
					url:"/pullOut_post",
					type:"POST",
					data:"_id="+dataId,
					success:function(result1){
						$(this).parent().parent().remove();
						alert(result1);
					}
				})
	 		})
	 	},
	 	//校验
		verifyFun:function(){
			
			if($("#startDate").val()=='' || $("#endDate").val()==''){
				alert("请输入要查询的日期");
				return false;
			}
			$("#startDate1").val($("#startDate").val().replace("-",""));
			$("#endDate1").val($("#endDate").val().replace("-",""));
			return true;
		}
	 }
	 searchPage.initEvent();
})
