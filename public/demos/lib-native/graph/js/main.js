let coordinate = document.querySelector("#coordinate");
let pageUrl = coordinate.getAttribute("data-urlpage");
import { draw } from "./draw.js";
new Vue({
  el: "#coordinate",
  data: {
    posts: [],
    svg: null,
    width: null,
    height: null,
    scaleLevels: [60, 100, 1000],
    scaleIndex: 0,
    scale: null,
    offsetX: null,
    offsetY: null,
    tickMultipliers: [1, 10, 100],
    Dodragging: false,
    lastX: 0,
    lastY: 0,
  },

  async create() {},
  async mounted() {
    await this.getData();
    this.getDiv();
    this.drawGrid();
    this.resize();
  },
  methods: {
    getData: async function () {
      await fetch(pageUrl + ".json")
        .then((res) => res.json())
        .then((data) => {
          this.posts = data;
          this.isSuccess = true;
        });
      console.log(this.posts);
    },

    //grid
    getDiv() {
      this.svg = document.getElementById("graph");
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.scale = this.scaleLevels[this.scaleIndex];
      this.offsetX = this.width / 2;
      this.offsetY = this.height / 2;

      this.pointsGroup = document.getElementById("points");
      this.vLines = document.getElementById("v-lines");
      this.hLines = document.getElementById("h-lines");
      this.labelsGroup = document.getElementById("labels");
    },

    worldToScreen(x, y) {
      return [this.offsetX + x * this.scale, this.offsetY - y * this.scale];
    },

    screenToWorld(sx, sy) {
      return [
        (sx - this.offsetX) / this.scale,
        (this.offsetY - sy) / this.scale,
      ];
    },

    drawGrid() {
      draw(
        this.svg,
        this.width,
        this.height,
        this.scale,
        this.scaleLevels,
        this.scaleIndex,
        this.tickMultipliers,
        this.offsetX,
        this.offsetY
      );
    },

    startDrag(e) {
      this.Dodragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.svg.style.cursor = "grabbing";
    },
    onDrag(e) {
      if (!this.Dodragging) return;
      this.offsetX += e.clientX - this.lastX;
      this.offsetY += e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.drawGrid();
    },
    endDrag() {
      this.Dodragging = false;
      this.svg.style.cursor = "grab";
    },

    setScaleIndex(newIndex, centerX, centerY) {
      if (newIndex < 0 || newIndex >= this.scaleLevels.length) return;
      let [wx, wy] = this.screenToWorld(centerX, centerY);
      this.scaleIndex = newIndex;
      this.scale = this.scaleLevels[this.scaleIndex];
      let [nx, ny] = this.worldToScreen(wx, wy);
      this.offsetX += centerX - nx;
      this.offsetY += centerY - ny;
      this.drawGrid();
    },

    zoomIn() {
      this.setScaleIndex(this.scaleIndex + 1, this.width / 2, this.height / 2);
    },
    zoomOut() {
      this.setScaleIndex(this.scaleIndex - 1, this.width / 2, this.height / 2);
    },
    onWheel(e) {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.setScaleIndex(this.scaleIndex + 1, e.clientX, e.clientY);
      } else {
        this.setScaleIndex(this.scaleIndex - 1, e.clientX, e.clientY);
      }
    },
    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.drawGrid();
    },
  },
});
