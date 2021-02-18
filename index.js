#!/usr/bin/env node

const varChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_"
const drawName = "refresh" // name of the function to draw a variable

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
	let queries = [] // array of all DOM queries (getElementById)
	let functions = [] // array of all function declarations
	let functionCalls = {} // object in { "variable": [ "func call", ...] } form
	let simpleFunctionCalls = [] // Variable-less functions

	for (let { variables, code, id } of templates) {
		queries.push(`let ${id} = document.getElementById("${id}")`)
		functions.push(`function update${id}(){${id}.innerHTML = (${code})}`)

		if (variables.length == 0) {
			simpleFunctionCalls.push(`update${id}()`)
		}
		else {
			for (let variable of variables) {
				if (functionCalls[variable] === undefined)
					functionCalls[variable] = []
				functionCalls[variable].push(`update${id}()`)
			}
		}
	}

	str = str.replace(/@/g, "SSSSS")
	let outJS = [ ...queries, ...functions ].join("\n") + "\n"
	let i = 0 // input str index

	function parseDraw() {
		let args = ""
		let drawCalls  = []
		i += drawName.length

		while (str[i] != "(") {
			i++
		}
		while (str[i] != ")") {
			args += str[i]
			i++
		}

		for (let variable of args.replace(/\s/g, "").split(","))
			for (let call of functionCalls[variable] || [])
				if (!drawCalls.includes(call))
					drawCalls.push(call)

		outJS += ";" + drawCalls.join(";")
		i++
	}
	
	while (i < str.length) {
		if (str[i] == "r" && str.slice(i, i + drawName.length) == drawName) {
			parseDraw()
		}
		else {
			outJS += str[i]
			i++
		}
	}

	outJS += ";" + simpleFunctionCalls.join(";")

	console.log(queries, functions, functionCalls, outJS)
	return outJS
}


// Main function
let fs = require("fs")

if (process.argv.length == 2) {
	console.log("Usage: sssss HTML_FILE [JS FILE [JS FILE ...]]")
	process.exit(2)
}

