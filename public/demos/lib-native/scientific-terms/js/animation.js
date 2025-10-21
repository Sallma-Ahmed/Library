 const animationInstances = {};

let StartPlay = bodymovin.loadAnimation({
  container: document.getElementById("StartPlay"),
  path: "../../../lib-native/scientific-terms/json/startpage.json", // required
  renderer: "svg", // required
  loop: false, // optional
  autoplay: false, // optional
  name: "content Map", // optional
});

let QandA = bodymovin.loadAnimation({
  container: document.getElementById("QandA"),
  path: "../../../lib-native/scientific-terms/json/qanda.json", // required
  renderer: "svg", // required
  loop: false, // optional
  autoplay: false, // optional
  name: "content Map", // optional
});

setTimeout(() => {
  function loadAnimations() {
    const animationConfigs = [
      {
        id: "ItemsReady01",
        path: "../../../lib-native/scientific-terms/json/itemsreadyright.json",
      },
      {
        id: "ItemsReady02",
        path: "../../../lib-native/scientific-terms/json/itemsreadyright.json",
      },
      {
        id: "ItemsReady03",
        path: "../../../lib-native/scientific-terms/json/itemsreadyright.json",
      },
      {
        id: "ItemsReady04",
        path: "../../../lib-native/scientific-terms/json/itemsreadyright.json",
      },
      {
        id: "ItemsReady05",
        path: "../../../lib-native/scientific-terms/json/itemsreadyleft.json",
      },
      {
        id: "ItemsReady06",
        path: "../../../lib-native/scientific-terms/json/itemsreadyleft.json",
      },
      {
        id: "ItemsReady07",
        path: "../../../lib-native/scientific-terms/json/itemsreadyleft.json",
      },
      {
        id: "ItemsReady08",
        path: "../../../lib-native/scientific-terms/json/itemsreadyleft.json",
      },
    ];

    animationConfigs.forEach((config) => {
      animationInstances[config.id] = bodymovin.loadAnimation({
        container: document.getElementById(config.id),
        path: config.path,
        renderer: "svg",
        loop: false,
        autoplay: false,
        name: "content Map",
      });
    });
  }

  loadAnimations();
}, 1000);
