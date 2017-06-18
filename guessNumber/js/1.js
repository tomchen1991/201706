var answer=[]; //结果
var compareAnswer=[]; //玩家输入的用来比对的数字
var blanks=document.getElementsByClassName("blank");
var remain=8;//剩余次数，也用来控制是否能继续比对
//同步blanks和compareAnswer的函数
function setBlanks() {
	for (var i=0;i<blanks.length;i++) {
		blanks[i].innerHTML="";
		if(compareAnswer[i]!=undefined) {
			blanks[i].innerHTML=compareAnswer[i];
		}	
	}
}

//生成不重复的四位数并清零比对数字
function setAnswer() {
	//初始化两个数组以及数字框显示
	answer=[];
	changeText([]);
	clearNums();
	var nums=[0,1,2,3,4,5,6,7,8,9];
	for(var i=0;i<4;i++) {
		//从nums随机删除一项并推入answer中
		answer.push((nums.splice((Math.floor(Math.random()*nums.length)),1)[0]));
	}
	console.log(answer);
}
window.onload=setAnswer;
document.getElementById("newGame").onclick=setAnswer;

//配置输入界面
//首先配置数字键，采用委托事件绑定数字按钮
var buttons=document.getElementById("numKeyboard");
var enter=document.getElementById("enter");
buttons.onclick=function(ev) {
	var ev=ev || window.event;
	var target = ev.target || ev.srcElement;
	if(target.className=="numbers"&&compareAnswer.length<4&&target.disabled!=true) {
		compareAnswer.push(target.innerHTML);
		target.disabled=true;
		setBlanks();
		if(compareAnswer.length==4&&remain) enter.disabled=false;
	}
}

//配置退格键
function deleteNum() {
	if(compareAnswer.length) {
		var backIndex=((parseInt(compareAnswer.pop())+9)%10); //推出按钮，同时获取对应按钮的索引
		setBlanks();
		document.getElementsByClassName("numbers")[backIndex].disabled=false;
		enter.disabled=true;
	}
}
document.getElementById("backspace").onclick=deleteNum;
//清空猜测框和恢复数字键——运行退格键直至归零即可
function clearNums() {
	for(var i=0;i<4;i++) {
		deleteNum();
	}
}

//计算比对与答案重合度函数
function compare(arr1,arr2) {
	var a=0, b=0;
	for(var i=0;i<arr1.length;i++) {
		if(arr1[i]==arr2[i]) a++;
		for(var j=0;j<arr2.length;j++) {
			if(arr1[i]==arr2[j]) b++;
		}
	}
	return([a,b-a]);
}

//配置接受AB之后右边状态栏的动作
var xAxB=document.getElementById("ABs");
var remainTimes=document.getElementById("remainTimes");
var histories=document.getElementById("history");
function changeText(arr) {
	//接受空数组时清空数据
	if(arr.length==0) {
		remain=8
		xAxB.innerHTML="0 A 0 B";
		xAxB.style.backgroundColor="red";
		remainTimes.innerHTML="还剩"+remain+"次机会";
		histories.innerHTML="";
	}
	else if(remain) {
		remain--;
		var a=arr[0],b=arr[1];
		xAxB.innerHTML=a+" A "+b+" B";
		var insertLi=document.createElement("LI");
		insertLi.innerHTML=compareAnswer.join(" ")+"&nbsp&nbsp&nbsp&nbsp"+xAxB.innerHTML;
		histories.appendChild(insertLi);
		if(a==4) {
			remain=0;
			remainTimes.innerHTML="恭喜答对！";
			xAxB.style.backgroundColor="green";
		}
		else if(remain==0) {
			remainTimes.innerHTML="Game Over";
		}
		else remainTimes.innerHTML="还剩"+remain+"次机会";
	}
}

//配置回车键动作
enter.onclick=function() {
	if(remain) {
		var arr=compare(compareAnswer,answer);
		changeText(arr);
		clearNums();
	}
}
