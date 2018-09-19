//宣告寬與高的全域變數

//ertyuiop
var width=9; //collum 行
var height=9;//row 列
var restart; //開始按鈕變數
var td; //td 將宣告為一個二維陣列變數
var mineno=10; //設定地雷總數
var GameOver=false; //遊戲結束狀態
//網頁首先要載入執行的方法
function init(){
	document.write('<h1>');
	document.write('踩地雷(李威109) <br>');
	document.write('</h1>');
	document.write('<form>');
	document.write('宽度：<input type="text" name="width" id="width" value="'+width+'"><br>');
	document.write('高度：<input type="text" name="height" id="height" value="'+height+'"><br>');
	document.write('地雷数：<input type="text" name="mineno" id="mineno" value="'+mineno+'"><br>');
	document.write('<button type="button" id="restart" onclick="Restart()">開始</button>');
	document.write('</form>');
	//繪製高(列)x寬(行)表格
	document.write('<table border="1">');
	for(var i=0; i<height; i++){
		document.write('<tr>');
		for(var j=0; j<width; j++){
			document.write('<td id="td_'+i+'_'+j+'" onclick="TDLclick('+i+','+j+');" oncontextmenu="TDRclick('+i+','+j+');return false;">');
			document.write('<img src="./image/button.png">');
			document.write('</td>');
		}
		document.write('</tr>');
	}
	
	document.write('</table>');
	document.close();//完成HTML内文的寫入
	//============================================
	//初始化二維陣列
	//先建立第一維
	td = new Array();
	//從第一維中所有的陣列元素再建立自己的第二維
	for(var i=0; i<height; i++){
		td[i] = new Array();
	}
	//將每一個空格做初始化：
	//(1)設定其周邊的地雷數為0,
	//(2)Mine:設定空格本身是否被放置地雷,剛開始狀態為:false
	for(var i=0; i<height; i++){
		for(j=0; j<width; j++){
			 td[i][j]={
				MineNo:0,//(1)MineNo:設定其周邊的地雷數為0
				Bomb:false,//(2)Bomb:設定空格本身是否被放置地雷
				Control:document.getElementById('td_'+i+'_'+j),//取得按鈕控制權
				LState:false, //記錄左鍵狀態: false: 尚未被點選,true:已經點選
				RState:0	//記錄右鍵狀態: 0:還原, 1:旗幟, 2:問號
			 };
		}
	}
	//亂數擺放地雷：幫每一個地雷找位置擺放
	//將所有地雷一一擺放
	for(var i=0; i<mineno; i++){
		//亂數取得行與列的位置
		var rand_i = Math.floor(Math.random()*height)
		var rand_j = Math.floor(Math.random()*width)
		//位置是否為空的
		if(td[rand_i][rand_j].Bomb == false){
			td[rand_i][rand_j].Bomb = true;
			//檢查點: 顯示地雷圖形
			//td[rand_i][rand_j].Control.innerHTML = '<img src="./image/bomb1.png">';
			//2.告知相鄰空格地雷數加1
			//有上方空格
			if(rand_i > 0){
				td[rand_i-1][rand_j].MineNo++;
				//有左上方
				if(rand_j > 0){
					td[rand_i-1][rand_j-1].MineNo++;
				}
				//有右上方
				if(rand_j+1 < width){
					td[rand_i-1][rand_j+1].MineNo++;
				}
			}
			//有下方空格
			if(rand_i+1 < height){
				td[rand_i+1][rand_j].MineNo++;
				//有左下方
				if(rand_j > 0){
					td[rand_i+1][rand_j-1].MineNo++;
				}
				//有右下方
				if(rand_j+1 < height){
					td[rand_i+1][rand_j+1].MineNo++;
				}
			}
			//正左方有空格
			if(rand_j > 0){
				td[rand_i][rand_j-1].MineNo++;
			}
			//正右方有空格
			if(rand_j+1 < height){
				td[rand_i][rand_j+1].MineNo++;
			}		
		}else{
			i--;
		}
	}
}
function Restart(){
	//取得寛與高的控制權
	height = document.getElementById('height').value;
	width = document.getElementById('width').value;
	//取得地雷總數
	mineno = document.getElementById('mineno').value;
	GameOver= false;
	//重新初始畫面
	init();
}
//左键事件處理程式
function TDLclick(i,j){
	//alert('['+i+,'+j+']');
	if(GameOver) return;//遊戲結束狀態,不處理任何事件
	//是否被右鍵鎖住
	if(td[i][j].RState > 0) return;
	td[i][j].LState = true;
	if(!td[i][j].Bomb){ //不是地雷
		td[i][j].Control.innerHTML = '<img src="./image/'+td[i][j].MineNo+'.png">';
	}
	else{ //地雷,顯示已爆彈
		td[i][j].Control.innerHTML='<img src="./image/bomb1.png">';
		GameOver=true; //設定結束狀態
		for(var a=0;a<height;a++){
			for(var b=0;b<width;b++){
				if(td[a][b].Bomb == true){
					if(td[a][b]!=td[i][j]){
						td[a][b].Control.innerHTML='<img src="./image/bomb2.png">';
					}
				}
			}
		}
		td[i][j].Control.innerHTML = '<img src="./image/bomb1.png">';
	}
	//td[i][j].Control.innerHTML = ""+td[i][j].MineNo;
	
}
//右鍵事件處理程式
function TDRclick(i,j){
	if(GameOver) return;//遊戲結束狀態,不處理任何事件
	if(td[i][j].LState) return; //左鍵已經被點選了
	//alert("RClick");
	//右鍵狀態值加1，再取其餘數即可進行狀態輪轉
	td[i][j].RState = (td[i][j].RState+1)%3;
	if(td[i][j].RState == 0){//還原到未點選狀態
		td[i][j].Control.innerHTML = '<img src="./image/button.png">';
	}else if(td[i][j].RState == 1){//顯示旗幟
		td[i][j].Control.innerHTML = '<img src="./image/flag.png">';
	}else{//顯示問號
		td[i][j].Control.innerHTML = '<img src="./image/qm.png">';
	}
}