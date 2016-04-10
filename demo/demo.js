document.getElementById("trybox").addEventListener("keyup", function () {
  var html;
	try {
		html = placebo(this.value).html();
	} catch (e) {
		html = e;
	}
	document.getElementById("tryit-result").innerText = html;
});
