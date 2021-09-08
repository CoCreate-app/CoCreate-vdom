import observer from '@cocreate/observer';
import './index.css';

let ignore = '#dropMarker, script';

function initVdom() {
	let virtualDom = document.querySelector("[vdom-target]");
	let selector = virtualDom.getAttribute('vdom-target');
	if (!selector) return;
	let realDom = document.querySelector(selector);

	if(realDom) {
		virtualDom.innerText = "";
		initElements(realDom, virtualDom);
		initObserver(realDom);
	}
}

function initObserver(realDom) {
	let Document = document;
	if (realDom.contentWindow) {
		Document = realDom.contentDocument;
	}
	Document.observer = observer.init({
	    name: 'vDomAddedNodes',
	    observe: ['addedNodes'],
	    callback (mutation) {
			// if(!mutation.target.tagName) return;
			let el = mutation.target;
			// let vdom = el.closest('vdom_id');
			if(!el.tagName || el.classList.contains('vdom-item')) return;
	
			let id = el.getAttribute("element_id");
			if(id) {
				// let vd = vdom.querySelector(`.vdom-item[element_id="${id}"]`);
				// if(vd) vd.remove();
			}
			// let elVdom = renderNew([el], vdom);
	    }
	});

}

function initElements(realDom,  virtualDom) {
	if (realDom.contentWindow) {
		realDom = realDom.contentDocument.children;
	}
	else {
		realDom = realDom.children;	
	}
		render(realDom,	virtualDom);
}

function render(realDom,  virtualDom, level = 0) {
	for(let el of realDom) {
		if (!el) continue;
		if(el.matches(ignore)) continue;

		let virtualEl = createVirtualElement({
			element: el,
		});

		virtualDom.append(virtualEl);

		if(el.children.length) {
			render(el.children, virtualEl, level + 1);
		}
	}
}

function renderNew(realDom, virtualDom, level = 0) {
	let virtualEl;
	for(let el of realDom) {
		if(el.matches(ignore)) continue;

		virtualEl = createVirtualElement({
			element: el,
		});

		if(el.children.length) {
			// virtualEl.classList.add('collapsible')
			renderNew(el.children, virtualEl, level + 1);
		}
		if(virtualDom) virtualDom.append(virtualEl);
	}

	return virtualEl;
}


function createVirtualElement({ options, element }) {
	let treeItem = document.createElement("div");

	let displayName = element.getAttribute("data-name");
	let name = displayName ? displayName : element.tagName;

	let isParent = element.children.length;

	treeItem.classList.add("vdom-item");
	if(element.children.length) treeItem.classList.add("parent");

	let metadata = document.createElement("div");

	metadata.setAttribute("dnd-exclude", "true");
	// metadata.classList.add('metadata')

	let realDomId = element.getAttribute("element_id");
	treeItem.setAttribute("element_id", realDomId);
	// let atts = Array.from(element.attributes).filter(att => att.name.startsWith('draggable') || att.name.startsWith('droppable'))
	// atts.forEach(att => {
	//   treeItem.setAttribute(att.name, att.value);
	// })
	treeItem.setAttribute("draggable", "true");
	treeItem.setAttribute("droppable", "true");

	let text2 = document.createElement("span");
	text2.classList.add("element-name");
	text2.innerHTML = name;

	let lastDisplay;
	let eye = createFAIcon({
		name: "fa-eye",
		event: {
			click: (e) => {
				if(element.style.display == "none") {
					element.style.display = lastDisplay;
					treeItem.classList.remove("layer-hidden");
				}
				else {
					lastDisplay = element.style.display;
					element.style.display = "none";
					treeItem.classList.add("layer-hidden");
				}
			},
		},
	});
	let arrow = createFAIcon({ name: "fa-arrows-alt" });

	metadata.append(eye);

	if(isParent) {
		let down = createFAIcon({ name: "fa-caret-down" });
		let collapse = document.createElement("span");
		collapse.insertAdjacentElement("afterbegin", down);

		collapse.classList.add("icon-container");

		metadata.append(collapse);
		down.setAttribute("toggle", "collapse");
		down.setAttribute("toggle-closest", ".vdom-item");
		// down.setAttribute("data-transform_to", "fa fa-caret-right");
	}

	metadata.append(text2);
	metadata.append(arrow);
	treeItem.append(metadata);
	return treeItem;
}

function createFAIcon({ name, event }) {
	let icon = document.createElement("i");
	icon.classList.add("fa");
	icon.classList.add(name);

	if(event) {
		let eventType = Object.keys(event)[0];
		let func = event[eventType];
		icon.addEventListener(eventType, func);
	}
	return icon;
}

initVdom();

observer.init({
	name: 'CoCreateVdomAddedNodes',
	observe: ['addedNodes'],
	target: '[vdom-target]',
	callback(mutation) {
		initVdom();
	}
});

observer.init({
	name: 'CoCreateVdomAddedNodes',
	observe: ['attributes'],
	attributeName: ['vdom-target'],
	callback: mutation => {
		initVdom();
	}
});

// observer.init({
// 	name: "vdom",
// 	observe: ['addedNodes'],
// 	target: '[vdom-target]',
// 	callback: (mutation) => {
// 		if(!mutation.target.tagName) return;
// 		let el = mutation.target;
// 		let vdom = el.closest('vdom_id');
// 		if(!el.tagName || el.classList.contains('vdom-item')) return;

// 		let id = el.getAttribute("element_id");
// 		if(id) {
// 			let vd = vdom.querySelector(`[element_id="${id}"]`);
// 			if(vd) vd.remove();
// 		}

// 	},
// });

// observer.init({
// 	name: "vdom",
// 	// exclude: ".vdom-item",
// 	observe: ["removedNodes"],
// 	callback: (mutation) => {
// 		let el = mutation.target;
// 		let vdom = el.closest('vdom_id');
// 		if (!vdom) return;
// 		if(el.classList.contains('vdom-item')) return;
// 		let id = el.getAttribute('element_id');
// 		let elVdom = renderNew([el], vdom);
// 		if(!elVdom) return;
// 		let vd = vdom.querySelector(`[element_id="${id}"]`);
// 		if(vd)
// 			vd.replaceWith(elVdom);


// 		if(el.previousElementSibling) {

// 			let id = el.previousElementSibling.getAttribute("element_id");
// 			if(!id) return;
// 			let sib = vdom.querySelector(`[element_id="${id}"]`);


// 			sib && sib.insertAdjacentElement('afterend', elVdom);
// 		}
// 		else if(el.parentElement) {
// 			let id = el.parentElement.getAttribute("element_id");
// 			if(!id) return;
// 			let sib = vdom.querySelector(`[element_id="${id}"]`);


// 			sib && sib.insertAdjacentElement('afterbegin', elVdom);
// 		}
// 	}
// });


export default { initVdom };
