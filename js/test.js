var cells = [];
cells[[2,1]]=1;
cells[[2,2]]=1;
cells[[2,3]]=1;
var cellXLen=50;
var cellYLen=50;
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

QUnit.test( "test of applyRule() ", function( assert ) {
    for(var i = 0;i<5;i++){
    	for(var j=0;j<5;j++){
    		assert.equal(applyRule(i,j),0);
    	}
    }
});
