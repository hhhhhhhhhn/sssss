@counter = 0

setInterval(function () {
	@counter += 1
	refresh(@counter)
}, 1000)
