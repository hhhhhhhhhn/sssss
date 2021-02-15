const varChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_"

function parseHTML(str) {
	let currentChar
	let output = ""
	let i = 0 // input str index
	let templates = []

	function parseTemplate() {
		let templateVariables = []
		let templateCode = ""
		let bracketLevel = 0

		function parseVariable() {
			let variable = ""
			do {
				variable += str[i]
				i++
			}
			while (varChars.includes(str[i]))

			templateVariables.push("SSSSS" + variable.slice(1))
			templateCode += templateVariables.slice(-1)[0]
			i--
		}

		function parseParenthesis() {
			let text = ""
			do {
				text += str[i]
				i++
			}
			while (str[i] != ")")
			i++

			return text.slice(1)
		}

		do {
			switch (str[i]) {
				case "@":
					parseVariable()
					break
				case "{":
					bracketLevel++
					templateCode += str[i]
					break
				case "}":
					bracketLevel--
					templateCode += str[i]
					break
				default:
					templateCode += str[i]
					break
			}
			i++
		}
		while (bracketLevel != 0)

		let defaultText = ( str[i] == "(" ) ? parseParenthesis() : ""

		templates.push({
			variables: templateVariables,
			code: templateCode.slice(1, -1),
			index: templates.length,
			id: `SssssId${templates.length}`
		})
		output += `<span id="${templates.slice(-1)[0].id}">${defaultText}<span>`
		i--
	}

	while (i < str.length) {
		if (str[i] == "{")
			parseTemplate()
		else
			output += str[i]
		i++
	}

	return [ output, templates ]
}

let str = `
<head>
<body>
</body>
{ @head+@body{} }(default val)
{ @seconds }{poh}
</head>
`
console.log(parseHTML(str))
