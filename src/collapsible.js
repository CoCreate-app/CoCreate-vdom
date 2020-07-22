// init the element tree with collapsible
export default function initCollapsible(element) {
  var coll = element.getElementsByClassName("collapsible");
  for (let i = 0; i < coll.length; i++) {
    coll[i].children[1].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.parentElement.nextElementSibling;
      if (content.style.display === "block" || content.style.display === "") {
        content.style.display = "none";
      }
      else {
        content.style.display = "block";
      }
    });
  }

}


//////////////////////////////////////////////// VS ///////////////////////////////////////////////


// run this only once in the page load and collapsible work on any element change
export function lazyCollapsible(element) {


  document.body.addEventListener("click", function() {
    if (!this.classList.contain('collapsible'))
      return;
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    }
    else {
      content.style.display = "block";
    }
  });


}
