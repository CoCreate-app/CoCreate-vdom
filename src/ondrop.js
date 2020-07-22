function getCoc(el, att) {
  if (!el.tagName)
    el = el.parentElement;
  do {
    if (el.tagName == 'IFRAME') return false;
    if (el.getAttribute(att) != "false") return el;
    el = el.parentElement;
    if (!el) return false;
  } while (true);
}


export default function ondrop(e) {

  console.log('got global event from dnd', e);
// let { position, dragedEl, dropedEl } = e.detail;

// // use these to detec parent
// // todo: should we check if one is child of another if two if them exist?
// let wrapper = getCoc(this.dropedEl, 'data-vdom-id');
// wrapper = wrapper ? wrapper : getCoc(this.dropedEl, 'data-vdom_target')




// let dropedElCounterpart = dropedEl.getAttribute('data-css_path');
// if (dropedElCounterpart) {
//   let dragedElCounterpart = dragedEl.getAttribute('data-css_path');

//   let correspondAction = {
//     target: dropedElCounterpart,
//     method: 'insertAdjacentElement',
//     value: [position, dragedElCounterpart]
//   };
//   console.log('correspondAction', correspondAction)
//   correspondAction.target = document.querySelector(correspondAction.target)
//   correspondAction.value[1] = document.querySelector(correspondAction.value[1]);
//   // CoCreate.sendMessage(correspondAction)
//   // domEditor(correspondAction)

// }




}

  // let dropedElCounterpart = dropedEl.getAttribute('data-css_path');
  // if (dropedElCounterpart) {
  //   let dragedElCounterpart = dragedEl.getAttribute('data-css_path');

  //   let correspondAction = {
  //     target: dropedElCounterpart,
  //     method: 'insertAdjacentElement',
  //     value: [position, dragedElCounterpart]
  //   };
  //   console.log('correspondAction', correspondAction)
  //   correspondAction.target = document.querySelector(correspondAction.target)
  //   correspondAction.value[1] = document.querySelector(correspondAction.value[1]);
  //   // CoCreate.sendMessage(correspondAction)
  //   // domEditor(correspondAction)

  // }
