var tabContent = document.getElementById("tabContent");
// document.getElementById("class-content").classList.add("active-content");

function changeColor(self) {
    $("div").removeClass("active");
    $("div").removeClass("active-content");
    $(self).addClass("active");
}

function showContent(a) {
    if (a == 1) {
        changeColor(document.getElementById("class"));
        document.getElementById("class-content").classList.add("active-content");
    } else if (a == 2) {
        changeColor(document.getElementById("faculty"));
        document.getElementById("faculty-content").classList.add("active-content");
    } else if (a == 3) {
        changeColor(document.getElementById("classroom"));
        document.getElementById("classroom-content").classList.add("active-content");
    } else {
        changeColor(document.getElementById("lab"));
        document.getElementById("lab-content").classList.add("active-content");
    }
}

function showPic() {
    var elem = document.getElementById("class-content");
    var x = document.createElement("embed");
    x.setAttribute("src", "images/sample/BTechCSEA5.pdf");
    x.setAttribute("id", "sample-img")
    x.setAttribute("style", "position: relative; width: 60%;");
    x.setAttribute("width", "600");
    x.setAttribute("height", "500");
    x.setAttribute("pluginspage", "http://www.adobe.com/products/acrobat/readstep2.html")
    if (document.getElementById("sample-img")) {
        elem.removeChild(document.getElementById("sample-img"));
    }

    elem.appendChild(x);

}
