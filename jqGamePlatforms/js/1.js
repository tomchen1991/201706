//设置浮动条的鼠标动作
var htmlobj;
$(".developer p").mouseover(function(){
	var onP=$(this); 
	onP.css("background-color","blue");
	onP.nextAll("div").show().mouseover(function(){
		$(this).css("background-color","#5F5");
		$(this).mouseleave(function(){
			$(this).css("background-color","#BBB");
		});
	});
	onP.parent().mouseleave(function(){
		onP.css("background-color","#BBF");
		onP.nextAll("div").hide();
	});
});
//将json文件写入网页的函数
function objToTable(obj) {
	var table=$("<table></table>");
	$.each(obj,function(key,value) {
		var tr=$("<tr></tr>");
		//是数组的情况下不描绘序号
		if(!$.isArray(obj)){
			$("<th>"+key+"</th>").appendTo(tr);
		}
		//是对象的情况下递归
		if(typeof(value)=="object") {
			objToTable(value).appendTo(tr);
		}
		else {$("<td>"+value+"</td>").appendTo(tr);}
		tr.appendTo(table);
	});
	return table;
}
//读取json文件
function getPlatform(str) {
	$("<img src='assets/"+str+".png' id='pic'></img>").appendTo("body");
	var htmlobj=$.ajax({
		type:"GET",
		url:"assets/"+str+".json",
		dataType:"JSON",
		async:true,
		success:function(){
			var table=objToTable(htmlobj.responseJSON);
			table.attr('id','mainTable');
			table.appendTo("body");
		},
		failure:function(){
			alert("Failed");
		}
	})
}

$(".developer div").click(function(){
	$("#mainTable,#pic").remove();
	getPlatform(this.innerHTML);
});