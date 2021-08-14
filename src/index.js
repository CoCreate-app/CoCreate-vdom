import observer from '@cocreate/observer';
import './index.css';

function virtualDomGenerator({ realDom, virtualDom, ignore }) {



  this.render = function(elList, level = 0, appendDom) {
    for (let el of elList) {
      if (el.matches(ignore)) continue;

      let virtualEl = this.createVirtualElement({
        element: el,
      });

      appendDom.append(virtualEl);

      if (el.children.length) {
        // virtualEl.classList.add('collapsible')
        this.render(el.children, level + 1, virtualEl);
      }
    }
  };

  this.renderNew = function(elList, level = 0, appendDom) {
    let virtualEl;
    for (let el of elList) {
      if (el.matches(ignore)) continue;

      virtualEl = this.createVirtualElement({
        element: el,
      });

      if (el.children.length) {
        // virtualEl.classList.add('collapsible')
        this.renderNew(el.children, level + 1, virtualEl);
      }
      if (appendDom) appendDom.append(virtualEl);
    }

    return virtualEl;
  };

  this.createVirtualElement = function({ options, element }) {
    let treeItem = document.createElement("div");

    let displayName = element.getAttribute("data-name");
    let name = displayName ? displayName : element.tagName;

    let isParent = element.children.length;

    treeItem.classList.add("vdom-item");
    if (element.children.length) treeItem.classList.add("parent");

    let metadata = document.createElement("div");

    metadata.setAttribute("dnd-exclude", "true");
    // metadata.classList.add('metadata')

    let realDomId = element.getAttribute("data-element_id");
    treeItem.setAttribute("data-element_id", realDomId);
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
    let eye = this.createFAIcon({
      name: "fa-eye",
      event: {
        click: (e) => {
          if (element.style.display == "none") {
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
    let arrow = this.createFAIcon({ name: "fa-arrows-alt" });

    metadata.append(eye);

    if (isParent) {
      let down = this.createFAIcon({ name: "fa-caret-down" });
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
  };

  this.createFAIcon = function({ name, event }) {
    let icon = document.createElement("i");
    icon.classList.add("fa");
    icon.classList.add(name);

    if (event) {
      let eventType = Object.keys(event)[0];
      let func = event[eventType];
      icon.addEventListener(eventType, func);
    }
    return icon;
  };

  this.render([realDom], 0, virtualDom);
}

/*global DOMParser*/



const vdom = {
  initVdom: function({ realdom, virtualDom, ignore }) {
    let myVirtualDom = new virtualDomGenerator({
      realDom: realdom,
      virtualDom,
      ignore
    });
    let Window = realdom.tagName === 'IFRAME' ? realdom.contentWindow : realdom.ownerDocument.defaultView;

    onLoadorExec(Window, () => {

      Window.CoCreate.observer.init({
        name: "vdom",
        observe: ['addedNodes'],
      	target: '[vdom-target]',
        callback: (mutation) => {
          if (!mutation.target.tagName) return;
          let el = mutation.target;

          if (!el.tagName || el.classList.contains('vdom-item')) return;

          let id = el.getAttribute("data-element_id");
          if (id) {
            let vd = virtualDom.querySelector(`[data-element_id="${id}"]`);
            if (vd) vd.remove();
          }

        },
      });
    })
    Window.CoCreate.observer.init({
      name: "vdom",
      // exclude: ".vdom-item",
      observe: ["removedNodes"],
      callback: (mutation) => {
        let el = mutation.target;
        if (el.classList.contains('vdom-item')) return;
        let id = el.getAttribute('data-element_id');
        let elVdom = myVirtualDom.renderNew([el]);
        if (!elVdom) return;
        let vd = virtualDom.querySelector(`[data-element_id="${id}"]`);
        if (vd)
          vd.replaceWith(elVdom);


        if (el.previousElementSibling) {

          let id = el.previousElementSibling.getAttribute("data-element_id");
          if (!id) return;
          let sib = virtualDom.querySelector(`[data-element_id="${id}"]`);


          sib && sib.insertAdjacentElement('afterend', elVdom)
        }
        else if (el.parentElement) {
          let id = el.parentElement.getAttribute("data-element_id");
          if (!id) return;
          let sib = virtualDom.querySelector(`[data-element_id="${id}"]`);


          sib && sib.insertAdjacentElement('afterbegin', elVdom)
        }
      }
    })

    return myVirtualDom;
  },



};


function onLoadorExec(Window, callback) {

  if (Window.document.readyState === "complete")
    callback()
  else
    Window.addEventListener('load', () => {
      callback

    });

}


export default vdom;
