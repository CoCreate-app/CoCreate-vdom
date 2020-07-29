/*global DOMParser*/
import virtualDom from '../src/virtualDom';
console.log('vdom is loading')

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



window.initvdom = () => {
    console.log('vdom is initiationg')

    console.log('runnnnnnnnnnning');


    let vdomTargets = document.querySelectorAll('[data-vdom_target]')

    for (let i = 0, len = vdomTargets.length; i < len; i++) {
        let vdomTargetName = vdomTargets[i].getAttribute('data-vdom_target')

        if (vdomTargetName) {

            let iframe = document.querySelector('[data-vdom_id=' + vdomTargetName + ']')
            // iframe.contentWindow.addEventListener('load', () => {
            let iframeHtml = iframe.contentDocument.body.parentNode;

            let myVirtualDom = new virtualDom({
                realDom: iframeHtml,
                virtualDom: vdomTargets[i],
                document: iframe.contentDocument
            });
            window.vdomObject = myVirtualDom;
            // domEditor({ target: iframeHtml.querySelectorAll('*'), idGenerator: UUID })
            // domEditor({ target: vdomTargets[i].querySelectorAll('*'), idGenerator: UUID })
            // })



        }
    }
    console.log('vdom finish initiating')
};

let canvasWindow = document.getElementById('canvas').contentWindow;
canvasWindow.addEventListener('load', () => {

    setTimeout(window.initvdom, 200);

});
console.log('vdom finished loading')
console.log('ccccccccccccanvas', canvas)
