#pragma strict
var mat: Material;

var fadeTime = 1.0;
var nextscene = 1;

enum Fade {
	In, Out
}

function Start() {
	mat.color.a = 0;
	yield WaitForSeconds(0.5);
	yield Fademat(mat, fadeTime, Fade.In);
	yield WaitForSeconds(0.25);
	yield Fademat(mat, fadeTime, Fade.Out);
	yield WaitForSeconds(0.25);
	Application.LoadLevel(nextscene);
}



function Fademat(curentmat: Material, timer: float, fadeType: Fade) {
	var start = fadeType == Fade.In ? 0.0 : 1.0;
	var end = fadeType == Fade.In ? 1.0 : 0.0;
	var i = 0.0;
	var step = 1.0 / timer;
	while (i < 1.0) {
		i += step * Time.deltaTime;
		curentmat.color.a = Mathf.Lerp(start, end, i) * 1;
		print("" + Mathf.Lerp(start, end, i));
		yield;
	}
}