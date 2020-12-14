window.addEventListener("load", () => {

  window.parent.addEventListener("load", () => {
    // initvdom
    let vdomTargets = window.parent.document.querySelector(
      "[data-vdom_target]"
    );
    let vdomRealDom = window.parent.document.querySelector("[data-vdom_id]");
    vdomRealDom = vdomRealDom.contentDocument.body.parentNode;
    window.vdomInit({ realdom: vdomRealDom, virtualDomContainer: vdomTargets });
  });

});

// window.addEventListener('load', () => {
//   try {
//     let vdomTargets = document.querySelector("[data-vdom_target]");
//     let vdomRealDom = document.querySelector("[data-vdom_id]");
//     vdomRealDom = vdomRealDom.contentDocument.body.parentNode;
//     vdomTargets.innerText = "";
//     if (window.CoCreateVdom && vdomRealDom && vdomTargets)
//       window.vdomObject = window.CoCreateVdom.initVdom({
//         realdom: vdomRealDom,
//         virtualDom: vdomTargets,
//       });

//   }
//   catch (error) {
//     console.error("selected2 init error", error);
//     throw error;
//   }

// })