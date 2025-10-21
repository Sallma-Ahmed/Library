export function loadAnimations() {
  let startPage = bodymovin.loadAnimation({
    container: document.getElementById("startPage"),
    path: "../../../lib-native/madinet_elma3refa/assets/json/startPage.json", // required
    renderer: "svg", // required
    loop: true, // optional
    autoplay: true, // optional
    // name: "Feed Right", // optional
  });
  let door0 = bodymovin.loadAnimation({
    container: document.getElementById("doorLeft"),
    path: "../../../lib-native/madinet_elma3refa/assets/json/doorLeft.json", // required
    renderer: "svg", // required
    loop: false, // optional
    autoplay: false, // optional
    // name: "Feed Right", // optional
  });
  let star0 = bodymovin.loadAnimation({
    container: document.getElementById("starLeft"),
    path: "../../../lib-native/madinet_elma3refa/assets/json/starLeft.json", // required
    renderer: "svg", // required
    loop: false, // optional
    autoplay: true, // optional
    // name: "Feed Right", // optional
    initialSegment: [0, 1],
  });
  let door1 = bodymovin.loadAnimation({
    container: document.getElementById("doorCenter"),
    path: "../../../lib-native/madinet_elma3refa/assets/json/doorCenter.json", // required
    renderer: "svg", // required
    loop: false, // optional
    autoplay: false, // optional
    // name: "Feed Right", // optional
  });

  let star1 = bodymovin.loadAnimation({
    container: document.getElementById("starCenter"),
    path: "../../../lib-native/madinet_elma3refa/assets/json/starCenter.json", // required
    renderer: "svg", // required
    loop: false, // optional
    autoplay: true, // optional
    // name: "Feed Right", // optional
    initialSegment: [0, 1],
  });
  let door2 = bodymovin.loadAnimation({
    container: document.getElementById("doorRight"),
    path: "../../../lib-native/madinet_elma3refa/assets/json/doorRight.json", // required
    renderer: "svg", // required
    loop: false, // optional
    autoplay: false, // optional
    // name: "Feed Right", // optional
  });
  let star2 = bodymovin.loadAnimation({
    container: document.getElementById("starRight"),
    path: "../../../lib-native/madinet_elma3refa/assets/json/starRight.json", // required
    renderer: "svg", // required
    loop: false, // optional
    autoplay: true, // optional
    // name: "Feed Right", // optional
    initialSegment: [0, 1],
  });
  let soltanDoor = bodymovin.loadAnimation({
    container: document.getElementById("soltanDoor"),
    path: "../../../lib-native/madinet_elma3refa/assets/json/soltanDoor.json", // required
    renderer: "svg", // required
    loop: true, // optional
    autoplay: true, // optional
    // name: "Feed Right", // optional
    initialSegment: [0, 1],
  });
  let characterInside = bodymovin.loadAnimation({
    container: document.getElementById("characterInside"),
    path: "../../../lib-native/madinet_elma3refa/assets/json/characterInside.json", // required
    renderer: "svg", // required
    loop: true, // optional
    autoplay: true, // optional
    // name: "Feed Right", // optional
    initialSegment: [0, 50],
  });

  let doorInHome = bodymovin.loadAnimation({
    container: document.getElementById("doorInHome"),
    path: "../../../lib-native/madinet_elma3refa/assets/json/doorInHome.json", // required
    renderer: "svg", // required
    loop: false, // optional
    autoplay: true, // optional
    // name: "Feed Right", // optional
    initialSegment: [0, 1],
  });

  return {startPage,door0,door1,door2,star0,star1,star2,soltanDoor,characterInside,doorInHome};
}
