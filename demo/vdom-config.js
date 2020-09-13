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
