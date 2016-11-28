var canvas = document.getElementById('space');
var btnStart = document.getElementById('btnStart');
var btnPause = document.getElementById('btnPause');
var btnReset = document.getElementById('btnReset');
var btnRandom = document.getElementById('btnRandom');
var btnLoad = document.getElementById('btnLoad');
var btnChange = document.getElementById('btnChange');
var context = canvas.getContext('2d');
var timerInterval = 100; // ms  
var cellWidth = 10; // please ensure: cellWidth > 2  
var cellXLen = 50; // please ensure: cellWidth * cellXLen = 500  
var cellYLen = 50; // please ensure: cellWidth * cellYLen = 500  
var cells = [];
var running = 0;
var generation = 0;
var index=1;
var paint = false;
var preCells = [
	[[10,12],[10,13],[11,11],[11,12],[11,13],[12,11],[12,12],[12,14],[13,12],[13,13],[13,14],[14,13],
	[35,36],[36,35],[36,36],[36,37],[37,35],[37,37],[37,38],[38,36],[38,37],[38,38],[39,36],[39,37]],
	[[1,0],[2,1],[2,2],[1,2],[0,2]],
	[[23,2],[23,3],[23,4],[23,5],[23,6],[23,7],[23,8],[23,9],[23,10],[23,11],[23,12],[23,13],[23,14],[23,15],[23,16],[23,17],[23,18],[23,19],[23,20],[23,21],[23,22],
	[23,23],[23,24],[23,25],[23,26],[23,27],[23,28],[23,29],[23,30],[23,31],[23,32],[23,33],[23,34],[23,35],[23,36],[23,37],[23,38],[23,39],[23,40],[23,41],
	[23,42],[23,43],[23,44],[23,45],[23,46],[23,47]],
	[[22,24],[22,25],[22,26],[22,30],[22,31],[22,32],[27,24],[27,25],[27,26],[27,30],[27,31],[27,32],[29,24],[29,25],[29,26],[29,30],[29,31],[29,32],[34,24],[34,25],[34,26],[34,30],[34,31],[34,32],
	[24,22],[24,27],[24,29],[24,34],[25,22],[25,27],[25,29],[25,34],[26,22],[26,27],[26,29],[26,34],[30,22],[30,27],[30,29],[30,34],[31,22],[31,27],[31,29],[31,34],[32,22],[32,27],[32,29],[32,34]]
]
var frontColor = ["Gold","#2828FF","#FF0000","#28FF28"];
var strokeColor = ["DarkGoldenRod","#00FFFF","#600000","#006000"];
var fontIndex=3;

function drawCell(x, y, state) {
	var cx = x * cellWidth;
	var cy = y * cellWidth;
	if(state && state == 1) {
		context.fillStyle = frontColor[fontIndex];
		context.fillRect(cx, cy, cellWidth, cellWidth);
		context.strokeStyle = strokeColor[fontIndex];
		context.strokeRect(cx + 1, cy + 1, cellWidth - 2, cellWidth - 2);
	} else {
		context.clearRect(cx, cy, cellWidth, cellWidth);
	}
}

function setCell(x, y) {
	cells[[x, y]] = 1;
	drawCell(x, y, 1);
}
	
function drawPatterns() {
	
	function drawGliderPattern() {

		for(i=0;i<preCells[3].length;i++){
			setCell(preCells[3][i][0],preCells[3][i][1]);
		}
	}
	drawGliderPattern();
}

function applyRule(x, y) {
	var neighbourCount = 0;
	var currentState = cells[[x, y]];
	var nextState = 0;
	for(m = x - 1; m < x + 2; m++) {//对每个格子，计算邻居数目
		for(n = y - 1; n < y + 2; n++) {
			if(m != x || n != y) {
				neighbourCount += cells[[(m + cellXLen) % cellXLen,(n + cellYLen) % cellYLen]];
			}
		}
	}

	if(currentState && currentState == 1) {//决定是否存活
		if(neighbourCount < 2 || neighbourCount > 3)
			return 0;
		else
			return 1;
	} else {
		if(neighbourCount == 3)
			return 1;
		else
			return 0;
	}
}

function loadGame() {

	canvas.onmousedown = function(e) {
		if(running == 1)
			return;		
			
		paint = !paint;
		if(e.offsetX) {
			x = e.offsetX;
			y = e.offsetY;
		} else if(e.layerX) {
			x = e.layerX;
			y = e.layerY;
		}
		x = Math.floor(x / cellWidth);
		y = Math.floor(y / cellWidth);
		state = cells[[x, y]];
		if(state && state == 1) {
			cells[[x, y]] = 0;
			drawCell(x, y, 0);
		} else {
			cells[[x, y]] = 1;
			drawCell(x, y, 1);
		}			
	}

	canvas.onmousemove = function(e) {
		
		if(running == 1)
			return;		
		if(paint){
			if(e.offsetX) {
				x = e.offsetX;
				y = e.offsetY;
			} else if(e.layerX) {
				x = e.layerX;
				y = e.layerY;
			}
			x = Math.floor(x / cellWidth);
			y = Math.floor(y / cellWidth);
			cells[[x, y]] = 1;
			drawCell(x, y, 1);				
		}
	}
	
	canvas.onmouseup = function(e) {
		if(running == 1)
			return;	
		paint = !paint;
	}


}

function startGame() {
	function runGame() {
		var nextgen = [];
		for(x = 0; x < cellXLen; x++) {
			for(y = 0; y < cellYLen; y++) {
				nextgen[[x, y]] = applyRule(x, y);
			}
		}
		for(x = 0; x < cellXLen; x++) {
			for(y = 0; y < cellYLen; y++) {
				cells[[x, y]] = nextgen[[x, y]];
				drawCell(x, y, cells[[x, y]]);
			}
		}
		generation++;
		spanGen.innerHTML = generation;
		if(running == 1)
			setTimeout(runGame, timerInterval);
	}
	btnStart.disabled = true;
	btnPause.disabled = false;
	btnReset.disabled = true;
	btnRandom.disabled = true;
	btnLoad.disabled = true;;
	running = 1;
	runGame();
}

function pauseGame() {
	running = 0;
	btnStart.disabled = false;
	btnPause.disabled = true;
	btnReset.disabled = false;
	btnRandom.disabled = false;
	btnLoad.disabled = false;

}

function resetGame() {
	for(x = 0; x < cellXLen; x++) {
		for(y = 0; y < cellYLen; y++) {
			cells[[x, y]] = 0;
			drawCell(x, y, 0);
		}
	}
//	drawPatterns();
	generation = 0;
	spanGen.innerHTML = generation;
}

function randomGame() {
	for(x = 0; x < cellXLen; x++) {
		for(y = 0; y < cellYLen; y++) {
			s = (Math.random() >= 0.8) ? 1 : 0;
			cells[[x, y]] = s;
			drawCell(x, y, s);
		}
	}
	generation = 0;
	spanGen.innerHTML = generation;
}

function load() {
	resetGame();
	index += 1;
	index %= preCells.length; 
	for(i=0;i<preCells[index].length;i++){
		setCell(preCells[index][i][0],preCells[index][i][1]);
	}
}

function changeCol(){
	fontIndex += 1;
	fontIndex %= frontColor.length;
	if(running==1){
		for(var i =0;i<50;i++){
			for(var j=0;j<50;j++){
				if(cells[[i,j]]==1)
					drawCell(i,j,1);
			}
		}
	}else{
		for(var i =0;i<50;i++){
			for(var j=0;j<50;j++){
				if(cells[[i,j]]==1)
					drawCell(i,j,1);
			}
		}
	}
}

