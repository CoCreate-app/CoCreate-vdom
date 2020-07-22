    // document.addEventListener("click", function(e) {
    //   if (!e.target.classList.contains('collapsible'))
    //     return;

    //   let children = e.target.parentElement.querySelectorAll('.parent > :not(.meta)');

    //   children.forEach(el => {
    //     el.classList.toggle('hidden');
    //   })

    // });


    document.addEventListener("click", function(e) {
      let parent;
      // if (e.target.classList.contains('collapsible'))
      //   parent = e.target.parentElement;

      if (e.target.parentElement.classList.contains('collapsible'))
        parent = e.target.parentElement.parentElement;


      // if (e.target.classList.contains('parent') || e.target.classList.contains('vdom-item'))
      // parent = e.target;

      let children = parent.querySelectorAll('.parent > .vdom-item');

      let arrow = parent.querySelector('.parent > span > i');

      if (arrow.classList.contains('fa-caret-right')) {

        arrow.classList.add('fa-caret-down');
        arrow.classList.remove('fa-caret-right');
      }
      else {
        arrow.classList.add('fa-caret-right');
        arrow.classList.remove('fa-caret-down');

      }


      children.forEach(el => {
        el.classList.toggle('hidden');
        /* attemp to make anime work
         el.classList.toggle('hidden');
         if (!el.classList.contains('hidden')) {
           el.style.height = window.getComputedStyle(el).height;
           // el.classList.toggle('hidden');
         }
         else {

           el.style.height = ''
         }
         */

      })

    });
    