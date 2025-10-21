// window.addEventListener("DOMContentLoaded", function() {
//     $("#loading").hide()
// });
let animation = bodymovin.loadAnimation({
        container: document.getElementById("keyWords"),
        path: "../../../lib-native/crossword_4r/content/json/keywords.json",
        renderer: "svg",
        loop: !1,
        autoplay: !1,
        name: "key Words"
    }),
    feedBack = bodymovin.loadAnimation({
        container: document.getElementById("feedBack"),
        path: "../../../lib-native/crossword_4r/content/json/feedback.json",
        renderer: "svg",
        loop: !1,
        autoplay: !1,
        name: "Feed Back"
    }),
    feedBackEnd = bodymovin.loadAnimation({
        container: document.getElementById("FeedBackEnd"),
        path: "../../../lib-native/crossword_4r/content/json/feedbackend.json",
        renderer: "svg",
        loop: !1,
        autoplay: !1,
        name: "Feed Back End"
    });
animation.goToAndStop(0, !0), feedBack.goToAndStop(0, !0), feedBackEnd.goToAndStop(0, !0), animation.playSegments([0, 75], !0), feedBack.playSegments([0, 50], !0), feedBackEnd.playSegments([0, 50], !0);