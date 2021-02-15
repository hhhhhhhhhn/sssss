const varChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_"

/*
 *	turns html into the base and templates
 *
 *	in: "string of the sssss html"
 *
 *	out: [ 
 *		"plain html string",
 *
 *		[
 *			template {
 *				variables: [ "varname" , ...],
 *				code: "javascript code",
 *				index: number,
 *				id: "html id"
 *			},
 *			...
 *		]
 *	]
 */
function parseHTML(str) {
	let currentChar
	let outHTML = ""
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
		outHTML += `<span id="${templates.slice(-1)[0].id}">${defaultText}<span>`
		i--
	}

	while (i < str.length) {
		if (str[i] == "{")
			parseTemplate()
		else
			outHTML += str[i]
		i++
	}

	return [ outHTML, templates ]
}

/*
 *	given the templates and javascript code, adds the automatic refreshing
 *	of variables
 *
 *	in: [ 
 *		"sssss js code",
 *
 *		[
 *			template {
 *				variables: [ "varname" , ...],
 *				code: "javascript code",
 *				index: number,
 *				id: "html id"
 *			},
 *			...
 *		]
 *	]
 *
 *	out: "plain js code"
 */
function parseJS(str, templates) {
	let queries = []
	let functions = []
	let functionNames = {} // object in { "variable": [ "func name", ...] } form

	for (let { variables, code, id } of templates) {
		queries.push(`let ${id} = document.getElementById("${id}")`)
		functions.push(`function update${id}(){${id}.innerHTML = (${code})}`)
		for (let variable of variables) {
			if (functionNames[variable] === undefined)
				functionNames[variable] = []
			functionNames[variable].push(`update${id}()`)
		}
	}

	console.log(queries, functions, functionNames)
}

let Html = `
<head>
<body>
</body>
{ @head+@body }(default val)
{ @seconds+@body }{poh}
</head>
`

let js = `
@head = 2
@body = 34
@seconds
refresh(@head, @body, @seconds)
`

let [ html, templates ] = parseHTML(Html)
console.log(html, templates)
parseJS(js, templates)
