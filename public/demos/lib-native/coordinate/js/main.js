let coordinate = document.querySelector("#coordinate");
let pageUrl = coordinate.getAttribute("data-urlpage");
import { checkAllPoints, checkAllLines } from "./check.js";
import { getStrings } from "./data.js";
// import { drawGrid} from "./grid.js";
import { undoLastAction, redoLastAction } from "./history.js";
import { numOfInput, checkInputALL, showAnswer, maxLength } from "./input.js";
// import { moveGraphToFitAllPoints } from "./svg.js";
import { draw } from "./draw.js";

new Vue({
  el: "#coordinate",
  data: {
    posts: [],
    graph: null,
    selectedPoints: [],
    allActions: [],
    HistroyActions: [],
    points: [],
    HistroyPoints: [],
    lines: [],
    HistroyLines: [],

    enableLine: false,
    redoOption: false,
    enablePoint: false,
    enableDrag: false,

    startLo: false,
    currentQuestion: 0,
    numberOfQuestion: 0,
    isSuccess: false,
    hintScreen: false,
    nextStepQuestion: false,
    checkedDraw: false,
    checkedInput: false,
    feedBack: false,
    feedBackText: "",
    feedBackImage: "",
    feedBackDegree: 0,
    counterCorrectAnswer: 0,
    showAnswerEnabled: false,

    /// new graph
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
    colorAnswer: "",
    showDraw: false,
  },

  async create() {},
  async mounted() {
    await this.getData();
    this.getDiv();
    this.drawGrid();
    this.resize();
    this.setupPointClickListeners();
  },
  methods: {
    getData: async function () {
      await fetch(pageUrl + ".json")
        .then((res) => res.json())
        .then((data) => {
          this.posts = data;
          this.isSuccess = true;
        });
    },
    startButton() {
      this.numberOfQuestion = this.posts[0].questions.length;
      this.posts[0].questions[this.currentQuestion].active = true;
      this.startLo = true;
      this.hintScreen = true;
    },
    closeHint() {
      this.hintScreen = false;
    },

    //grid
    getDiv() {
      this.svg = document.getElementById("graph");
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.scale = this.scaleLevels[this.scaleIndex];
      this.offsetX = this.width / 2;
      this.offsetY = this.height / 2;
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
        this.offsetY,
        this.points,
        this.lines,
        this.colorAnswer,
        this.checkedDraw,
        this.showDraw
      );
      this.setupPointClickListeners();
    },

    //zoom
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

    //point
    addPoint(event) {
      if (this.enablePoint) {
        const sx = event.clientX;
        const sy = event.clientY;
        let [x, y] = this.screenToWorld(sx, sy);
        x = Math.round(x);
        y = Math.round(y);
        const alreadyExists = this.points.some(
          (point) => point.x === x && point.y === y
        );
        if (alreadyExists) {
          console.log("النقطة موجودة بالفعل ولن تتم إضافتها");
          return;
        }
        const newid = `${this.points.length + 1}`;
        this.allActions.push({ type: 1, id: newid, x, y });
        this.points.push({ id: newid, x, y });
        this.drawGrid();
      }
    },
    setupPointClickListeners() {
      const points = this.svg.querySelectorAll(".point");
      points.forEach((circle) => {
        circle.removeEventListener("click", this.handlePointClick);
        circle.addEventListener("click", this.handlePointClick.bind(this));
      });
    },
    handlePointClick(event) {
      if (!this.enableLine) return;
      if (this.enableLine) {
        const sx = event.clientX;
        const sy = event.clientY;
        let [x, y] = this.screenToWorld(sx, sy);
        x = Math.round(x);
        y = Math.round(y);
        if (this.selectedPoints.length === 0) {
          event.target.setAttribute("fill", "red");
        } else if (this.selectedPoints.length === 1) {
          event.target.setAttribute("fill", "blue");
        }
        this.selectedPoints.push({ x, y });
      }
      if (this.selectedPoints.length === 2) {
        this.drawLineBetweenPoints();
        this.enableLine = false;
      }
    },

    //line
    drawLineBetweenPoints() {
      this.addLine(this.selectedPoints[0], this.selectedPoints[1]);
      this.selectedPoints = [];
    },
    addLine(p1, p2) {
      let x1 = p1.x;
      let x2 = p2.x;
      let y1 = p1.y;
      let y2 = p2.y;
      const alreadyExists = this.lines.some((line) => {
        const sameDirection =
          line.x1 === x1 && line.y1 === y1 && line.x2 === x2 && line.y2 === y2;
        const reverseDirection =
          line.x1 === x2 && line.y1 === y2 && line.x2 === x1 && line.y2 === y1;
        return sameDirection || reverseDirection;
      });

      if (alreadyExists) {
        console.log("الخط موجود بالفعل ولن تتم إضافته");
        return;
      }
      const newid = `${this.lines.length + 1}`;
      this.allActions.push({ type: 2, id: newid, x1, y1, x2, y2 });
      this.lines.push({ id: newid, x1, y1, x2, y2 });
      this.drawGrid();
      this.enableLine = false;
    },

    //undo & redo & reset points function
    removeLastPoint() {
      undoLastAction(this);
    },
    redoLastPoint() {
      redoLastAction(this, this.drawGrid);
    },
    resetPoints() {
      this.points = [];
      this.lines = [];
      this.allActions = [];
      this.HistroyActions = [];
      this.HistroyLines = [];
      this.HistroyPoints = [];
      this.getDiv();
      this.drawGrid();
    },

    //enable button to drag or draw point or line
    enabledDrawPoint() {
      this.enableLine = false;
      this.enableDrag = false;

      this.enablePoint = !this.enablePoint;
    },
    enableDrawLine() {
      this.enablePoint = false;
      this.enableDrag = false;
      this.enableLine = !this.enableLine;
    },
    enabledDrag() {
      this.enablePoint = false;
      this.enableLine = false;
      this.enableDrag = !this.enableDrag;
    },

    // drag
    startDrag(e) {
      if (this.enableDrag) {
        this.Dodragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
      }
    },
    onDrag(e) {
      if (this.enableDrag) {
        if (!this.Dodragging) return;
        this.offsetX += e.clientX - this.lastX;
        this.offsetY += e.clientY - this.lastY;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.drawGrid();
      }
    },
    endDrag() {
      if (this.enableDrag) {
        this.Dodragging = false;
      }
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

    // answer
    check() {
      this.checkAllPoint();
    },
    checkAllPoint() {
      this.resetAllEabled();
      const question = this.posts[0].questions[0];
      const result = checkAllPoints(this.points, question.points);
      this.checkAllLine();
    },
    checkAllLine() {
      this.checkedDraw = true;
      const question = this.posts[0].questions[0];
      const result = checkAllLines(this.lines, question.lines, question.points);
      result ? this.colorShape("green",question.points) : this.colorShape("red",this.points);
    },
    resetAllEabled() {
      this.enablePoint = false;
      this.enableDrag = false;
      this.enableLine = false;
    },

    nextQuestionStep() {
      this.nextStepQuestion = true;
    },

    //input
    maxLength(event) {
      maxLength(event, this.posts[0].questions[this.currentQuestion]);
    },
    checkInputALL() {
      this.checkedInput = true;
      numOfInput(this.posts[0].questions[this.currentQuestion]);
      let Success = checkInputALL(
        this.posts[0].questions[this.currentQuestion]
      );
      Success
        ? [
            setTimeout(() => {
              this.nextQuestion();
            }, 1000),
            (this.counterCorrectAnswer += 1),
          ]
        : "";
    },
    changeValue() {
      console.log("click in input");
    },
    showAnswerInput() {
      showAnswer(this.posts[0].questions[this.currentQuestion]);
      setTimeout(() => {
        this.nextQuestion();
      }, 1000);
    },

    //reset data when go to next question
    resetData() {
      this.nextStepQuestion = false;
      this.checkedDraw = false;
      this.checkedInput = false;
      this.colorAnswer = "";
      this.checkedDraw = false;
      this.showDraw = false;
      this.scaleIndex = 0;
      this.resetPoints();
    },

    //when check shape color shape and when wrong answer draw correct shape
    colorShape(color,points) {
      this.colorAnswer = color;
      this.points = points
      this.drawGrid();
    },

    drawRightShape() {
      this.showDraw = true;
      this.colorAnswer = "green";
      this.points = this.posts[0].questions[this.currentQuestion].points;
      console.log(this.points);
      this.drawGrid();
      setTimeout(() => {
        this.nextQuestionStep();
      }, 5000);
    },

    //next question
    nextQuestion() {
      this.resetData();
      if (this.currentQuestion + 1 < this.numberOfQuestion) {
        this.currentQuestion += 1;
        this.posts[0].questions.forEach((question) => {
          question.active = false;
        });
        this.posts[0].questions[this.currentQuestion].active = true;
      } else {
        this.endLo();
      }
    },
    endLo() {
      this.feedBack = true;
      console.log("endLo");
      this.getFeedBack();
    },
    getFeedBack() {
      console.log(getStrings());
      console.log(this.counterCorrectAnswer);
      console.log(getStrings()[this.counterCorrectAnswer]);
      this.feedBackText = getStrings()[this.counterCorrectAnswer].text;
      this.feedBackImage = getStrings()[this.counterCorrectAnswer].image;
      this.getDegreeFeedback();
    },
    getDegreeFeedback() {
      this.feedBackDegree = Math.floor(
        (100 / this.numberOfQuestion) * this.counterCorrectAnswer
      );
      console.log(this.feedBackDegree);
    },
    home() {
      location.reload();
    }
  },
});
