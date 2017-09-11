//准备一个可以方便地设置子元素样式的函数
function batch(str1,str2) {
	var a= document.getElementsByClassName(str1);
	for (var i=0; i<a.length; i++) {
		a[i].style.display=str2;
	}
}

document.getElementById("timelineTabs").onclick=function() {
	var tab=this.getElementsByTagName("input");
	for(var i=0; i<tab.length; i++) {
		if(tab[i].checked) {
			batch("timeline","none");  //先设置所有不可见，再将所需的设置为可见
			if(tab[i].value=="all") {
				batch("timeline","block");
			}
			else {
				batch(tab[i].value,"block");
			}
		}
	}
}



//ajax读取json并绘制在页面中
var xmlhttp=null;
function getJson(url) {
	xmlhttp=null;
	xmlhttp= new XMLHttpRequest();
	xmlhttp.onreadystatechange=state_Change;
	xmlhttp.open("GET",url,true);
	xmlhttp.send(null);
}

function state_Change() {
	if(xmlhttp.readyState==4) {
		if(xmlhttp.status==200) {
			var json=JSON.parse(xmlhttp.responseText);
			var rightSides=document.getElementsByClassName("rightDrag");
			draw(rightSides[0],json.groups);
			draw(rightSides[1],json.subjects);
			draw(rightSides[2],json.ongoing);
		}
	}
}

function draw(node,obj) {
	var ul= document.createElement("ul");
	node.appendChild(ul);
	for (var i in obj) {
		var li1=document.createElement("li");
		li1.innerHTML=i;
		ul.appendChild(li1);
		li1.style.backgroundColor="#DDD";
		var li2= document.createElement("li");
		li2.innerHTML=obj[i];
		li2.style.fontSize="13px";
		ul.appendChild(li2);
	}
}

getJson("js/1.json");

//实现拖动效果
document.getElementById("sideInner").onmousedown=function(ev) {
	var ev = ev || window.event;
	var target = ev.target || ev.srcElement;
	if ( target.className == "dragBar") {
		var movingNode = target.parentNode;
		var sideInner = movingNode.parentNode;
		var placeHolder = movingNode.cloneNode(true);
		placeHolder.style.opacity = 0.2;
		var X=ev.clientX;
		var Y=ev.clientY-movingNode.offsetTop;
		target.style.cursor = "move";
		sideInner.insertBefore(placeHolder,movingNode);
		movingNode.style.position="absolute";
		movingNode.style.top=ev.clientY-Y+"px";
		document.onmousemove = function(e) {
			var e = e || window.event;
			movingNode.style.zIndex="2";
			movingNode.style.left=e.clientX-X+"px";
			movingNode.style.top=e.clientY-Y+"px";
		}
		document.onmouseup = function (e) {
			sideInner.removeChild(movingNode);
			sideInner.removeChild(placeHolder);
			placeHolder.style.opacity = 1;
			placeHolder.style.zIndex = "auto";
			var endY= e.clientY + document.documentElement.scrollTop;
			var childs=sideInner.childNodes;
			if ( endY <= sideInner.offsetTop) {
				sideInner.insertBefore(placeHolder,childs[0]);
			}
			else if ( endY > sideInner.offsetTop+sideInner.offsetHeight) {
				sideInner.appendChild(placeHolder);
			}
			else {
				for (var i=0; i<childs.length; i++) {
					if (endY > sideInner.offsetTop + childs[i].offsetTop && endY <= sideInner.offsetTop+childs[i].offsetTop+childs[i].offsetHeight ) {
						sideInner.insertBefore(placeHolder,childs[i]);
					}
				}
			}
			document.onmousemove = function () { }
			document.onmouseup = function() { }
			target.style.cursor= "auto";
		}
	}
}

