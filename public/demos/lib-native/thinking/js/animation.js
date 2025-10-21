export function loadAnimations() {
  let intro = bodymovin.loadAnimation({
    container: document.getElementById("intro"),
    path: "../../../lib-native/thinking/json/intro.json",
    renderer: "svg",
    loop: true,
    autoplay: true,
  });
  let feedbackAnim = bodymovin.loadAnimation({
    container: document.getElementById("feedbackAnim"),
    path: "../../../lib-native/thinking/json/feedbackAnim.json",
    renderer: "svg",
    loop: false,
    autoplay: false,
  });
  return { intro, feedbackAnim };
}
