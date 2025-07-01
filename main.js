document.addEventListener("DOMContentLoaded", () => {
	//#region [Define variables]
	/**
	 * Let's the user control these from the url:
		- How many items per page this script should render
		- What page to load when first loadings
	 */
	const params = new URLSearchParams(location.search)

	/**
	 * How many items per page this script should render
	 * It should be an integer larger than 2
	*/
	const pageSize = (params.has("items") && isParseableInt(params.get("items")) && Number.parseInt(params.get("items")) >= 2) ? Number.parseInt(params.get("items") -1) : 32

	/**
	 * How many pages can fit an entire set of characters? *(65535 to be exact)*
	 */
	const maxPageNum = Math.round(65535 / pageSize)

	/**
	 * Keeps track of the current page
	 * It should be a positive integer
	 * I could make it so that it doesn't accept values larger than `maxPageNum`, but that's boring.
	*/
	let curPage = (params.has("page") && isParseableInt(params.get("page")) && Number.parseInt(params.get("page")) > 0) ? Number.parseInt(params.get("page") -1) : 0
	//#endregion
	//#region [Define elements]
	const CharacterBrowser = document.querySelector("#browser")
	const PrevPageButton = document.querySelector("#prevpage-btn")
	const NextPageButton = document.querySelector("#nextpage-btn")
	const CurPageSpan = document.querySelector("#curpage-span")
	const PageInput = document.querySelector("#page-input")
	const SetPageButton = document.querySelector("#setpage-btn")
	//#endregion
	//#region [Define functions]
	/**
	 * Generates a page
	 * @param {number} page Page to generate
	 */
	async function generatePage(page) {
		params.set("page", page)
		PrevPageButton.disabled = (page - 1 < 0)
		NextPageButton.disabled = (page + 1 > maxPageNum)
		CurPageSpan.innerHTML = `Page <b>${page +1}/${maxPageNum +1}</b>`
		CharacterBrowser.innerHTML = ""
		let contents = []
		let gen = allCharacters(page * pageSize)
		for (let i = 0; i <= pageSize; i++) {
			const code = gen.next().value
			if (typeof code !== "undefined") {
				const hexCode = padString(code.toString(16).toUpperCase(), 4)
				contents.push(`<div class="basic centered shell${location.hash===`0x${hexCode}`?" highlighted":""}" id="0x${hexCode}"><p><code>0x${hexCode}</code></p><button class="basic character" onclick="this.disabled = true; copy(String.fromCharCode(${code})).then(()=>{this.disabled = false})">${String.fromCharCode(code)}</button></div>`)
			}
		}
		if (contents.length == 0) {
			CharacterBrowser.innerHTML = "<p>This page is empty</p>"
		} else {
			CharacterBrowser.innerHTML = contents.join("\n")
		}
	}
	//#endregion
	//#region [Define listeners]
	NextPageButton.addEventListener("click", () => {
		if (curPage + 1 <= maxPageNum) {
			PrevPageButton.disabled = NextPageButton.disabled = true
			generatePage(++curPage)
		} else {
			// This code will never execute unless NextPageButton happens to be enabled
			alert("Maximum Page Reached")
		}
	})

	PrevPageButton.addEventListener("click", () => {
		if (curPage - 1 >= 0) {
			PrevPageButton.disabled = NextPageButton.disabled = true
			generatePage(--curPage)
		} else {
			// This code will never execute unless PrevPageButton happens to be enabled
			alert("Minimum Page Reached")
		}
	})

	SetPageButton.addEventListener("click", () => {
		curPage = Number.parseInt(PageInput.value -1)
		generatePage(curPage)
	})
	//#endregion
	//#region [Setup PageInput + generate first page]
	PageInput.setAttribute("min", 1)
	PageInput.setAttribute("max", maxPageNum +1)
	generatePage(curPage)
	//#endregion
})