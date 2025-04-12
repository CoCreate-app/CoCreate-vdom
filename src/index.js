import observer from "@cocreate/observer";
import "./index.css";

let ignore = "#dropMarker, script";

function initVdom() {
	let virtualDom = document.querySelector("[vdom-query]");
	if (!virtualDom) return;
	let selector = virtualDom.getAttribute("vdom-query");
	if (!selector) return;
	let realDom = document.querySelector(selector);

	if (realDom) {
		initElements(realDom, virtualDom);
		// initObserver(realDom);
	}
}

// function initObserver(realDom) {
// 	let Document = document;
// 	if (realDom.contentWindow) {
// 		Document = realDom.contentDocument;
// 	}
// 	Document.observer = observer.init({
// 	    name: 'vDomAddedNodes',
// 	    types: ['addedNodes'],
// 	    callback (mutation) {
// 			let el = mutation.target;
// 			if (!el.tagName || el.classList.contains('vdom-item')) return;

// 	    }
// 	});

// }

async function initElements(realDom, virtualDom) {
	if (realDom.contentWindow) realDom = realDom.contentDocument.children;
	else realDom = realDom.children;

	let virtual = document.createElement("div");
	let element = await render(realDom, virtual);
	virtualDom.innerHTML = element.innerHTML;
}

async function render(realDom, virtualDom, level = 0) {
	for (let el of realDom) {
		if (!el) continue;
		if (el.matches(ignore)) continue;

		let virtualEl = createVirtualElement({
			element: el
		});

		virtualDom.append(virtualEl);

		if (el.children.length) {
			await render(el.children, virtualEl, level + 1);
		}
	}
	return virtualDom;
}

function createVirtualElement({ options, element }) {
	let treeItem = document.createElement("div");

	let displayName = element.getAttribute("data-name");
	let name = displayName ? displayName : element.tagName;

	let isParent = element.children.length;

	treeItem.classList.add("vdom-item");
	if (element.children.length) treeItem.classList.add("parent");

	let metadata = document.createElement("div");

	metadata.setAttribute("dnd-exclude", "true");

	treeItem["domElement"] = element;

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
				if (element.style.display == "none") {
					element.style.display = lastDisplay;
					treeItem.classList.remove("layer-hidden");
				} else {
					lastDisplay = element.style.display;
					element.style.display = "none";
					treeItem.classList.add("layer-hidden");
				}
			}
		}
	});
	let arrow = createFAIcon({ name: "fa-arrows-up-down-left-right" });

	metadata.append(eye);

	if (isParent) {
		let down = createFAIcon({ name: "fa-caret-down" });
		let collapse = document.createElement("span");
		collapse.insertAdjacentElement("afterbegin", down);

		collapse.classList.add("icon-container");

		metadata.append(collapse);
		down.setAttribute("toggle", "collapse");
		down.setAttribute("toggle-query", "$closest .vdom-item");
	}

	metadata.append(text2);
	metadata.append(arrow);
	treeItem.append(metadata);
	return treeItem;
}

function createFAIcon({ name, event }) {
	let icon = document.createElement("i");
	name = name.replace("fa-", "");
	icon.setAttribute("src", `../../assets/svg/${name}.svg`);
	// icon.classList.add("fa");
	// icon.classList.add(name);

	if (event) {
		let eventType = Object.keys(event)[0];
		let func = event[eventType];
		icon.addEventListener(eventType, func);
	}
	return icon;
}

// TODO: Use dnd onDrop to get the treeItems.domELement to drag and drop in realDom

initVdom();

observer.init({
	name: "CoCreateVdomAddedNodes",
	types: ["addedNodes"],
	selector: "[vdom-query]",
	callback(mutation) {
		initVdom();
	}
});

observer.init({
	name: "CoCreateVdomAttributesNodes",
	types: ["attributes"],
	attributeFilter: ["vdom-query"],
	callback(mutation) {
		initVdom();
	}
});

export default { initVdom };
