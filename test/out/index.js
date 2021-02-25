let SssssId0 = document.getElementById("SssssId0")
let SssssId1 = document.getElementById("SssssId1")
let SssssId2 = document.getElementById("SssssId2")
function updateSssssId0(){SssssId0.innerHTML = ( Math.PI )}
function updateSssssId1(){SssssId1.innerHTML = ( SSSSScounter )}
function updateSssssId2(){SssssId2.innerHTML = ( Math.ceil(SSSSScounter / 60) )}
SSSSScounter = 0

setInterval(function () {
	SSSSScounter += 1
	;updateSssssId1();updateSssssId2()
}, 1000)
;updateSssssId0()