/**
 * styling classes:
 * on hide element, the row get .layer-hidden
 **/
import collapsible from './collapsible'
import { droppable, draggable, name } from '../../globalFiles/variables'
import ondrop from './ondrop';

function UUID(length = 10) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  var d = new Date().toTimeString();
  var random = d.replace(/[\W_]+/g, "").substr(0, 6);
  result += random;
  return result;
}

export default function virtualDom({ realDom, virtualDom, document, options }) {

  // set options to this.options and set defualts
  this.options = options ? options : {};
  Object.assign(this.options, { indentBase: 10, indentSum: 15, exclude: ['SCRIPT'] });


  this.render = function(elList, level, appendDom) {
    let isAppended;


    for (let el of elList) {
      if (this.options.exclude.includes(el.tagName))
        continue;





      let displayName = el.getAttribute('data-CoC-name');
      let virtualEl = this.createVirtualElement({
        name: (displayName ? displayName : el.tagName),
        isParent: el.children.length,
        element: el,
      })


      // virtualEl.addEventListener('mouseover', (e) => {
      //   document.send_client((cdocument, cwindow) => {
      //     let { hoverBoxMarker, tagNameTooltip } = cdocument.client_object;
      //     hoverBoxMarker.draw(el);
      //     tagNameTooltip.draw(el);
      //   })
      // })

      // virtualEl.addEventListener('mouseLeave', (e) => {
      //   hoverBoxMarker.hide(el);
      //   tagNameTooltip.hide(el);
      // })



      virtualEl.classList.add('vdom-item');
      if (el.children.length)
        virtualEl.classList.add('parent');

      appendDom.append(virtualEl);


      if (el.children.length) {
        // virtualEl.classList.add('collapsible')
        this.render(el.children, level + 1, virtualEl)
      }

    }


  }


  this.createVirtualElement = function({ name, isParent, options, element }) {

    let treeItem = document.createElement('div');

    let metadata = document.createElement('div');
    metadata.setAttribute('data-coc-exclude', 'true')
    metadata.classList.add('metadata')


    let realDomId = element.getAttribute('data-element_id');
    treeItem.setAttribute('data-element_id', realDomId);
    let atts = Array.from(element.attributes).filter(att => att.name.startsWith('data-coc-draggable') || att.name.startsWith('data-coc-droppable'))
    atts.forEach(att => {
      treeItem.setAttribute(att.name, att.value);
    })







    let text = document.createElement('span');
    text.classList.add('collapsible')
    text.innerHTML = name;
    text.style.flex = '1';


    let lastDisplay;
    let eye = this.createFAIcon({
      name: 'fa-eye',
      event: {
        'click': (e) => {
          if (element.style.display == "none") {
            element.style.display = lastDisplay
            treeItem.classList.remove('layer-hidden');
          }
          else {
            lastDisplay = element.style.display;
            element.style.display = 'none'
            treeItem.classList.add('layer-hidden');

          }
        }
      }
    })
    let arrow = this.createFAIcon({ name: 'fa-arrows-alt' })


    metadata.append(eye);

    if (isParent) {

      let down = this.createFAIcon({ name: 'fa-caret-down' })
      text.insertAdjacentElement('afterbegin', down)
    }


    metadata.append(text);
    metadata.append(arrow);
    treeItem.append(metadata);
    return treeItem;
  }


  this.createFAIcon = function({ name, event }) {
    let icon = document.createElement('i');
    icon.classList.add('fa');
    icon.classList.add(name);
    if (event) {
      let eventType = Object.keys(event)[0];
      let func = event[eventType];
      icon.addEventListener(eventType, func)
    }
    return icon;
  }


  virtualDom.addEventListener('dndsuccess', ondrop)
  this.render([realDom], 0, virtualDom)


}
