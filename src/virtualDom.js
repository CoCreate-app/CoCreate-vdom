function virtualDomGenerator({ realDom, virtualDom, options }) {
  // set options to this.options and set defualts
  this.options = options ? options : {};
  Object.assign(this.options, {
    indentBase: 10,
    indentSum: 15,
    exclude: ["SCRIPT"],
  });

  this.render = function (elList, level = 0, appendDom) {
    for (let el of elList) {
      if (this.options.exclude.includes(el.tagName)) continue;

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

  this.renderNew = function (elList, level = 0, appendDom) {
    let virtualEl;
    for (let el of elList) {
      if (this.options.exclude.includes(el.tagName)) continue;

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

  this.createVirtualElement = function ({ options, element }) {
    let treeItem = document.createElement("div");

    let displayName = element.getAttribute("data-name");
    let name = displayName ? displayName : element.tagName;

    let isParent = element.children.length;

    treeItem.classList.add("vdom-item");
    if (element.children.length) treeItem.classList.add("parent");

    let metadata = document.createElement("div");

    metadata.setAttribute("data-exclude", "true");
    // metadata.classList.add('metadata')

    let realDomId = element.getAttribute("data-element_id");
    treeItem.setAttribute("data-element_id", realDomId);
    // let atts = Array.from(element.attributes).filter(att => att.name.startsWith('data-draggable') || att.name.startsWith('data-droppable'))
    // atts.forEach(att => {
    //   treeItem.setAttribute(att.name, att.value);
    // })
    treeItem.setAttribute("data-draggable", "true");
    treeItem.setAttribute("data-droppable", "true");

 
    let text2 = document.createElement("span");
    text2.classList.add('element-name')
    text2.innerHTML = name;

    let lastDisplay;
    let eye = this.createFAIcon({
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
        },
      },
    });
    let arrow = this.createFAIcon({ name: "fa-arrows-alt" });

    metadata.append(eye);

    if (isParent) {
      let down = this.createFAIcon({ name: "fa-caret-down" });
      let collapse = document.createElement("span");
      collapse.insertAdjacentElement("afterbegin", down);

      collapse.classList.add('icon-container')
      
      metadata.append(collapse);
      down.setAttribute("data-toggle", "collapse");
      down.setAttribute("data-toggle_closest", ".vdom-item");
      down.setAttribute("data-transform_to", "fa fa-caret-right");
    }

    
    metadata.append(text2);
    metadata.append(arrow);
    treeItem.append(metadata);
    return treeItem;
  };

  this.createFAIcon = function ({ name, event }) {
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

console.log("vdom is loading");

function UUID(length = 10) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  var d = new Date().toTimeString();
  var random = d.replace(/[\W_]+/g, "").substr(0, 6);
  result += random;
  return result;
}

// window.initvdom = () => {
//   console.log("vdom is initiationg");

//   let vdomTargets = document.querySelectorAll("[data-vdom_target]");

//   for (let i = 0, len = vdomTargets.length; i < len; i++) {
//     let vdomTargetName = vdomTargets[i].getAttribute("data-vdom_target");

//     if (vdomTargetName) {
//       let realdom = document.querySelector(
//         "[data-vdom_id=" + vdomTargetName + "]"
//       );
//       // iframe.contentWindow.addEventListener('load', () => {
//       let realdomElement;
//       if (realdom.tagName && realdom.tagName == "IFRAME")
//         realdomElement = realdom.contentDocument.body.parentNode;
//       else realdomElement = realdom;

//       if (realdom.contains(vdomTargets[i])) {
//         let error = "vdom: target(virtual dom) element can not owns real dom";
//         console.error(error);
//         throw error;
//       }

//       let myVirtualDom = new virtualDom({
//         realDom: realdomElement,
//         virtualDom: vdomTargets[i],
//       });
//       window.vdomObject = myVirtualDom;
//       // domEditor({ target: iframeHtml.querySelectorAll('*'), idGenerator: UUID })
//       // domEditor({ target: vdomTargets[i].querySelectorAll('*'), idGenerator: UUID })
//       // })
//     }
//   }
//   console.log("vdom finish initiating");
// };

window.CoCreateVdom = {
  initVdom: function ({ realdom, virtualDom }) {
    let myVirtualDom = new virtualDomGenerator({
      realDom: realdom,
      virtualDom,
    });

    const mutationCallback = function (mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.removedNodes.forEach((el) => {
            
            if(el.tagName)
            {
              let id =el.getAttribute("data-element_id");
              if(id)
              {
                let vd = virtualDom.querySelector(
                  "[data-element_id=" + id + "]"
                );
               vd.remove();
              }
            }

          });
          let id = mutation.target.getAttribute("data-element_id");
          if(id)
          {
              let vd = virtualDom.querySelector( "[data-element_id=" + id +"]"  );
              let newVd = myVirtualDom.renderNew([mutation.target]);
               vd.replaceWith(newVd);
          }


        }
      }
    };

    const observer = new MutationObserver(mutationCallback);
    //todo: check why still node type text being triggered
    const config = {

      childList: true,
      subtree: true,

    };
    observer.observe(realdom, config);

    return myVirtualDom;
  },
};

console.log("vdom finished loading");
