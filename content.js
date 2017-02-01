const DELAY = 100,
	MAX_LENGTH = 50;



let timer, lastText;
$('body').on('mouseup dbclick', e => {


	clearTimeout(timer);
	timer = setTimeout(() => {

		let selection = getSelection();
		let text = $.trim(selection.toString());

		if (lastText == text) { // do nothing if selection is the same as lastText
			return;
		}

		undoHighlight();
		lastText = null;

		if (text.length <= MAX_LENGTH && text.length > 0) {
			lastText = text;
			doHighight(text, [selection.anchorNode, selection.baseNode]); //ignore anchorNode and baseNode
		}
	}, DELAY);
})



function doHighight(selectedText, ignores = []) {
	let regex = new RegExp(`\\b${selectedText}\\b`, `g`);
	let textList = getTextNodesIn('body');
	textList.each((index, textNode) => {
		let curText = textNode.nodeValue;
		let parentNode = textNode.parentNode;
		if (regex.test(curText) && ignores.indexOf(textNode) == -1) {
			// curText => `textLeft_selectedText_textRight`
			// one node => three nodes
			let [textLeft = '', textRight = ''] = curText.split(selectedText);
			textNode.nodeValue = textRight;
			parentNode.insertBefore(document.createTextNode(textLeft), textNode);
			parentNode.insertBefore($(`<span class='__QS_highlight__'>${selectedText}</span>`)[0], textNode);
		}
	})
}



function undoHighlight() {
	$('.__QS_highlight__').each((index, el) => {
		el.outerHTML = el.innerHTML;
	})
}



function getTextNodesIn(el) {
	return $(el).find(":not(iframe)").addBack().contents().filter(function() {
		return this.nodeType == 3;
	});
};