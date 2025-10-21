const { createApp } = Vue;
import { loadTimerAnimation } from "./animation.js";
let interactive = document.querySelector("#app");
let pageUrl = interactive.getAttribute("data-urlpage");
var idPage = interactive.getAttribute("id");
let playerInstance = null;

createApp({
  data() {
    return {
      posts: [],
      quizCounter: 0,
      activeQuestion: null,
      quizvideo: false,
      questionCounter: 1,
      feedback: false,
      failAudio: new Audio(),
      successAudio: new Audio(),
      expressionAudio: new Audio(),
      questionAudio: new Audio(),
      selectionTextq: "",
      shuffledDrag: [],
      // --------------------------------------------------------
      isLoading: false,
      isSuccess: false,
      activityId: 0,
      dataLoaded: false,
      currentdate: "",
      date: null,
      loQuestion: null,
      assetLink: {
        Dash: "",
        Hsl: "",
      },
      // -------------------------timer-------------------------------
      playermover_current: false,
      timeLeft: null,
      timerInterval: null,
    };
  },
  async mounted() {
    await this.getData();

    await this.Resize();
    const Timer = loadTimerAnimation();
    window.animations = { Timer };
    this.posts[0].questions.forEach((question) => {
      if (question.quiz && Array.isArray(question.quiz)) {
        question.quiz.forEach((quizItem) => {
          quizItem.trueanswer = false;
        });
      }
    });

    window.addEventListener("resize", this.Resize);
    this.failAudio.src =
      "../../../lib-native/interactive_video/assets/audio/fail.mp3";
    this.successAudio.src =
      "../../../lib-native/interactive_video/assets/audio/success.mp3";
    this.chooses = document.getElementsByClassName("chooses");

    const conf = {
      key: "93f21a64-3b8d-4394-88ec-3d24027c5360",
      playback: {
        autoplay: true,
        muted: true,
      },
      ui: false,
    };

    playerInstance = new bitmovin.player.Player(
      document.getElementById("player"),
      conf
    );

    const source = {
      dash: this.posts[0].Dash,
      hls: this.posts[0].Hsl,
    };

    playerInstance.load(source).then(() => {
      bitmovin.playerui.UIFactory.buildDefaultUI(playerInstance, {
        metadata: { markers: this.posts[0].markers },
      });
      let lastPopupTime = null;

      playerInstance.on(playerInstance.exports.PlayerEvent.TimeChanged, () => {
        const current = Math.floor(playerInstance.getCurrentTime());
        const popupTimes = this.posts[0].popupTimes;
        const disabled = this.posts[0].disabledPopups;

        this.playermover_current = popupTimes.some((time) => current >= time);

        const shouldShowQuestion =
          popupTimes.includes(current) &&
          !disabled.includes(current) &&
          lastPopupTime !== current;

        if (shouldShowQuestion) {
          lastPopupTime = current;

          playerInstance.pause();
          this.quizvideo = true;

          this.questionCounter = popupTimes.indexOf(current);
          this.activeQuestion = this.posts[0].questions[this.questionCounter];
          this.activeQuestion.quiz[this.quizCounter].active = true;
          this.activeQuestion.quiz[this.quizCounter].startTime = this.getDate();

          document.getElementById("interaction").style.display = "flex";
          this.activeQuestion.quiz[this.quizCounter].add_style = "";

          setTimeout(() => {
            this.questionAudio.src = `./audio/q/q${
              this.activeQuestion.quiz[this.quizCounter].id
            }.mp3`;
            this.questionAudio.play();
          }, 1000);

          this.waitForActiveQuestion(this);
        }
        if (this.playermover_current && disabled.length !== popupTimes.length) {
          const getactive = popupTimes.filter((time) => time <= current);
          const firstValid = getactive.find((time) => !disabled.includes(time));

          if (firstValid !== undefined && current > firstValid + 1) {
            console.log("replay");
            playerInstance.pause();
            setTimeout(() => {
              playerInstance.seek(firstValid);
              lastPopupTime = null;
              playerInstance.play();
            }, 500);
          }
        }
      });
    });
  },

  methods: {
    getDate() {
      this.currentdate = new Date();
      return (
        this.currentdate.getDate() +
        "/" +
        (this.currentdate.getMonth() + 1) +
        "/" +
        this.currentdate.getFullYear() +
        " " +
        this.currentdate.getHours() +
        ":" +
        this.currentdate.getMinutes() +
        ":" +
        this.currentdate.getSeconds()
      );
    },
    async handleChoice(choice) {
      const interaction = document.getElementById("interaction");

      try {
        if (!playerInstance) return;

        const current = Math.floor(playerInstance.getCurrentTime());

        if (choice === "restart") {
          await playerInstance.seek(61);
        } else if (choice === "continue") {
          this.posts[0].disabledPopups.push(current);
          this.posts[0].markers = this.posts[0].markers.filter(
            (marker) => Math.floor(marker.time) !== current
          );
          await playerInstance.seek(current + 1);
        }

        // ✨ إعادة بناء الواجهة لتحديث الماركرز
        bitmovin.playerui.UIFactory.buildDefaultUI(playerInstance, {
          metadata: { markers: this.posts[0].markers },
        });

        interaction.style.display = "none";
        playerInstance.play();
      } catch (error) {
        console.error("Error handling choice:", error);
      }
    },
    getData: async function () {
      this.tokenId = this.getTokenFromURL();

      if (direction == "2") {
        try {
          const response = await returnData;
          this.isSuccess = response.isSuccess;
          response.value.learningObjectAsJson = "";
          this.data = response.value;
          if (this.data.assetName && this.data.assetName.includes("/")) {
            this.data.assetName = this.data.assetName.split("/").pop();
          }
          // console.log("assetName =>", this.data);

          if (this.data.subjectId && this.data.assetName) {
            await this.fetchAssetManifest(
              this.data.subjectId,
              this.data.assetName
            );
          }
          ///////////////////////////////

          this.activityId = this.data.activityId;

          if (
            this.data.learningObjectAsJson !== "" &&
            this.data.learningObjectAsJson !== null
          ) {
            let jsonData = JSON.parse(this.data.learningObjectAsJson);
            this.posts[0] = jsonData;
            this.posts[0].Dash = this.assetLink.Dash;
            this.posts[0].Hsl = this.assetLink.Hsl;
            // console.log("Dash online Link:", this.posts[0].Dash);
            // console.log("Hsl online Link:", this.posts[0].Hsl);
            await this.playLo();
          }
        } catch (error) {
          console.error("❌ Error in direction == 2 block:", error);
        }
      } else {
        if (runPage) {
          this.isSuccess = true;
        } else {
          try {
            const response = await returnData;
            this.isSuccess = response.value;
          } catch (error) {
            console.error("❌ Error fetching returnData:", error);
          }
        }
      }

      try {
        const res = await fetch(pageUrl + ".json");
        if (!res.ok) throw new Error("Failed to load local JSON");
        const data = await res.json();
        this.localPosts = data;
      } catch (error) {
        console.error("❌ Error loading local page data:", error);
      }

      if (!Array.isArray(this.posts) || this.posts.length === 0) {
        this.posts = this.localPosts;
        this.posts[0].Dash = this.assetLink.Dash;
        this.posts[0].Hsl = this.assetLink.Hsl;
        await this.playLo();

        // console.log("Dash localPosts Link:", this.posts[0].Dash);
        // console.log("Hsl localPosts Link:", this.posts[0].Hsl);
      }
      // console.log("posts =>", this.posts);
      if (this.posts.length !== 0) {
        setTimeout(() => {
          this.isLoading = true;
          if (!this.posts[0]) this.posts[0] = {};
          this.posts[0].startTime = this.getDate();
        }, 1000);
      } else {
        this.isLoading = false;
      }
    },
    getTokenFromURL() {
      const params = new URLSearchParams(window.location.search);
      return params.get("token");
    },
    async fetchAssetManifest(subjectId, assetName) {
      try {
        const url =
          baseURL +
          "Curriculum/GetAssetManifests?SubjectId=" +
          subjectId +
          "&AssetName=" +
          assetName;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.tokenId,
          },
        });

        if (!response.ok) {
          throw new Error(
            "Asset manifest fetch failed with status " + response.status
          );
        }

        const data = await response.json();
        console.log("🎯 Asset Manifest Response:", data);

        if (data && data.value) {
          this.assetLink.Dash = data.value.Dash || "";
          this.assetLink.Hsl = data.value.Hsl || "";
          // console.log("🎯:", this.assetLink);
        } else {
          console.warn("⚠️ Unexpected asset manifest response format:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching asset manifest:", error);
      }
    },

    chooseQuestion(choose, event, quiz, index) {
      if (!playerInstance) return;
      this.activeQuestion.quiz[this.quizCounter].endTime = this.getDate();
      const current = Math.floor(playerInstance.getCurrentTime());
      this.questionAudio.pause();
      Array.from(this.chooses).forEach((e) => {
        e.style.pointerEvents = "none";
      });
      this.questionAudio.pause();

      if (
        choose.number ==
        this.activeQuestion.quiz[this.quizCounter].correctAnswer
      ) {
        quiz.add_style = "trueChoose";
        this.activeQuestion.quiz[this.quizCounter].selectedChooseIndex = index;

        // this.posts[0].disabledPopups = [];
        this.trueAnswer(quiz);
      } else {
        quiz.add_style = "falseChoose";
        this.activeQuestion.quiz[this.quizCounter].selectedChooseIndex = index;
        this.falseAnswer(quiz);
      }
      setTimeout(() => {
        this.feedback = true;
        setTimeout(() => {
          // console.log("open");
          this.expressionAudio.play();
        }, 500);
      }, 1000);
    },
    playLo: async function (type) {
      this.posts[0].questions[this.questionCounter - 1].active = true;
      this.activeQuestion = this.posts[0].questions[this.questionCounter - 1];

      if (this.activeQuestion.quiz[this.quizCounter].type == 3) {
        await this.shuffleDrag();
        await this.shuffleQuestion();
        await this.dragLength();
      }
      await this.numberOfquestion_length();
    },
    numberOfquestion_length() {
      this.posts.forEach((post) => {
        let count = 0;

        post.questions.forEach((question) => {
          count += question.quiz.length;
        });
        post.numberOfquestion = count;
      });
    },
    reload: function () {
      this.expressionAudio.pause();
      playerInstance.pause();
      setTimeout(() => {
        this.feedback = false;
        this.quizvideo = false;
        document.getElementById("interaction").style.display = "none";
      }, 150);
      const targetTime = this.activeQuestion.quiz[this.quizCounter].replayStart;
      playerInstance.seek(targetTime);
      playerInstance.play();
    },
    waitForActiveQuestion(vm) {
      if (this.posts[0].timeLeft != null) {
        const activeQuestionEl = document.getElementById("interaction");
        if (activeQuestionEl) {
          const quiz = vm.activeQuestion.quiz[vm.quizCounter];
          this.addAnalogTimerToElement(activeQuestionEl, vm, quiz);
        } else {
          setTimeout(() => this.waitForActiveQuestion(vm), 100);
        }
      }
    },
    addAnalogTimerToElement(el, vm, quiz) {
      this.timeLeft = this.posts[0].timeLeft;
      const totalFrames = animations.Timer.getDuration(true);
      animations.Timer.goToAndStop(0, true);
      document.getElementById("Timer").style.display = "flex";
      let currentFrame = 0;
      const totalTime = this.timeLeft;
      const framesPerSecond = totalFrames / totalTime;
      this.timerInterval = setInterval(() => {
        animations.Timer.goToAndStop(Math.floor(currentFrame), true);
        currentFrame += framesPerSecond;
        if (currentFrame >= totalFrames) {
          clearInterval(this.timerInterval);
          animations.Timer.goToAndStop(totalFrames, true);
          vm.feedback = true;
          vm.falseAnswer(quiz);
          setTimeout(() => {
            vm.expressionAudio.play();
          }, 500);
        }
      }, 1000);
    },
    next: async function () {
      this.expressionAudio.pause();
      this.feedback = false;
      if (this.quizCounter < this.activeQuestion.quiz.length - 1) {
        this.activeQuestion.quiz[this.quizCounter].active = false;
        this.quizCounter += 1;
        this.activeQuestion.quiz[this.quizCounter].active = true;
        this.activeQuestion.quiz[this.quizCounter].startTime = this.getDate();
        setTimeout(() => {
          this.questionAudio.src = `./audio/q/q${
            this.activeQuestion.quiz[this.quizCounter].id
          }.mp3`;
          this.questionAudio.play();
        }, 1000);
        this.waitForActiveQuestion(this);
      } else {
        this.posts[0].questions.forEach((question) => {
          question.active = false;
        });
        const current = Math.floor(playerInstance.getCurrentTime());
        this.posts[0].disabledPopups.push(current);
        this.posts[0].markers = this.posts[0].markers.filter(
          (marker) => Math.floor(marker.time) !== current
        );
        document.querySelectorAll(".bmpui-seekbar-marker").forEach((e) => {
          if (e.getAttribute("data-marker-time") == current) {
            e.classList.add("point");
          }
        });

        await playerInstance.seek(current + 1);
        document.getElementById("interaction").style.display = "none";
        playerInstance.play();
        this.questionCounter += 1;
        this.quizCounter = 0;
        this.playLo();
      }
      Array.from(this.chooses).forEach((e) => {
        e.style.pointerEvents = "auto";
      });
    },
    trueAnswer(quiz) {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      if (this.activeQuestion.quiz[this.quizCounter].typeQuestion != "drag") {
        quiz.correctCounter == 0
          ? ((quiz.correctCounter += 1), (this.posts[0].LOcorrectcounter += 1))
          : "";
      } else {
        quiz.correctCounter += 1;
        this.posts[0].LOcorrectcounter += 1;
      }
      // console.log(quiz.correctCounter);
      this.successAudio.play();
      this.expressionAudio.src = `./audio/t/t${quiz.id}.mp3`;
      this.expression = true;
      (this.expressText = quiz.expressionTrue),
        (this.expressionParag =
          this.activeQuestion.quiz[this.quizCounter].trueExpersion);
      this.UpdateStudentActivity();
      this.questionAudio.pause();
    },
    falseAnswer(quiz) {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      quiz.numberOfTrial += 1;
      this.failAudio.play();
      this.expressionAudio.src = `./audio/f/f${quiz.id}.mp3`;
      this.expression = false;
      this.expressText = "إجابةٌ غَيرُ صحيحةٍ";
      this.expressionParag =
        this.activeQuestion.quiz[this.quizCounter].falseExpersion;
      this.UpdateStudentActivity();
      this.questionAudio.pause();
    },
    Resize: async function () {
      const loQuestions = document.getElementById("loQuestions");

      if (window.innerWidth / window.innerHeight > 16 / 9) {
        loQuestions.style.height = 100 + "vh";
        loQuestions.style.width = (window.innerHeight / 9) * 16 + "px";
      } else if (window.innerWidth / window.innerHeight < 16 / 9) {
        loQuestions.style.height = (window.innerWidth / 16) * 9 + "px";
        loQuestions.style.width = 100 + "vw";
      } else {
        loQuestions.style.height = 100 + "vh";
        loQuestions.style.width = 100 + "vw";
      }
    },
    UpdateStudentActivity() {
      this.posts[0].endTime = this.getDate();
      this.posts[0].questions[this.questionCounter] = this.activeQuestion;
      // console.log(this.posts[0]);
      direction != ""
        ? globalFunctions.UpdateStudentActivity(this.activityId, this.posts[0])
        : "";
    },
    //***//
    //***//
    //***//
    //***//
    //***//
    //***//
    //***//
    //***//
    //***//
    //***//
    //****select**//
    //***//
    //***//
    //***//
    //***//
    //***//
    //***//
    //***//
    //***//
    //***//
    //***//
    SelectedText(question) {
      this.rangeSele = null;
      setTimeout(() => {
        const selection = window.getSelection();

        this.selectionTextq = selection.toString();
        // console.log(this.selectionTextq);
        if (this.iphoneDevice) {
          this.spanSelectedText = document.createElement("span");
          // console.log(this.selectionTextq);
          if (selection.rangeCount > 0 && this.selectionTextq) {
            this.rangeSele = selection.getRangeAt(0);
            const rangeText = this.rangeSele.toString();
            this.selectionTextq = rangeText;
          }
          question.selectionText = this.selectionTextq.trim();
        }
        this.removeSelectDone = true;
      }, 100);
      if (this.selectionTextq != "") {
        this.removeSelectDone = true;
      }
    },
    CheckSelect(quiz) {
      // this.timerQuestionDoor[this.activeDoor] = null;
      quiz.endTime = this.getDate();
      // console.log(document.querySelectorAll(".select.questions"));
      let studentAnswer = this.CheckSelectAnswer(quiz);
      document.querySelectorAll(".select.questions").forEach((el) => {
        el.classList.add("poniterEvent");
      });

      if (studentAnswer) {
        this.trueAnswer(quiz);
      } else {
        this.falseAnswer(quiz);
      }
      this.removeSelectDone = false;
      this.selectionTextq = "";
      setTimeout(() => {
        this.feedback = true;
      }, 1000);
    },
    CheckSelectAnswer(question) {
      let success = false;
      if (!this.iphoneDevice) {
        const selection = window.getSelection();
        this.selectionTextq = selection.toString();
        this.spanSelectedText = document.createElement("span");
        // console.log(this.selectionTextq);
        if (selection.rangeCount > 0 && this.selectionTextq) {
          this.rangeSele = selection.getRangeAt(0);
          const rangeText = this.rangeSele.toString();
          this.selectionTextq = rangeText;
        }
        question.selectionText = this.selectionTextq.trim();
      }
      if (this.selectionTextq != "") {
        let loop = true;
        question.correctAnswer.forEach((text, index) => {
          if (loop) {
            if (
              this.selectionTextq.toString().trim() == text.toString().trim()
            ) {
              this.showCorrectText = true;
              this.spanSelectedText.className = "trueText";
              const extractedContents = this.rangeSele.extractContents();
              this.spanSelectedText.appendChild(extractedContents);
              this.rangeSele.insertNode(this.spanSelectedText);
              loop = false;
              success = true;
            } else if (
              this.selectionTextq.toString().trim() != text.toString().trim() &&
              index + 1 == question.correctAnswer.length
            ) {
              this.spanSelectedText.className = "falseText";
              const extractedContents = this.rangeSele.extractContents();
              this.spanSelectedText.appendChild(extractedContents);
              this.rangeSele.insertNode(this.spanSelectedText);
              success = false;
            }
          }
        });
      }
      return success;
    },
    showSelect() {
      this.showSelected = true;
      this.showAnswerSelect = false;
      this.nextQuestionAfterShowSelect();
    },
    removeSelect() {
      // console.log("removeSelect");
      window.getSelection().removeAllRanges();
      this.selectionTextq = "";
    },
    nextQuestionAfterShowSelect() {
      setTimeout(() => {
        this.shuffledWrogWords[0].text = this.realWordWrong;
        // this.nextQuestionLO(true);
      }, 1000);
    },

    /***/
    /***/
    dragLength() {
      this.activeQuestion.dragCounter = 0;

      this.activeQuestion.quiz[this.quizCounter].items.forEach((el) => {
        this.activeQuestion.dragCounter += el.drag.length;
      });
      this.activeQuestion.numberOfquestion = this.activeQuestion.dragCounter;
      // console.log("numberOfquestion = " + this.activeQuestion.numberOfquestion);
    },

    sound_true() {
      var audio = new Audio("../../../assets/audio/true.mp3");
      audio.load();
      audio.play();
      this.activeQuestion.endTime = this.getDate();
    },

    sound_false() {
      var audio = new Audio("../../../assets/audio/false.mp3");
      audio.load();
      audio.play();
      this.activeQuestion.endTime = this.getDate();
    },

    //drag web
    dragover(ev) {
      ev.preventDefault();
      ev.target.backgroundColor = "black !important";
    },

    dragstart(ev) {
      this.dropID = null;
      this.dragID = ev.target.id;
      this.dragNumber = ev.target.attributes.index?.value;
      this.startX = ev.clientX;
      this.startY = ev.clientY;
      ev.dataTransfer.setData("text", ev.target.id);
      // console.log(ev.dataTransfer);
      ev.target.style.zIndex = 50;
    },
    drag(ev) {
      ev.target.style.left = ev.clientX - this.startX + "px";
      ev.target.style.top = ev.clientY - this.startY + "px";
      ev.target.style.pointerEvents = "none";
      var divDroppable = document.getElementsByClassName("droppable");
      this.dropHover = document.elementFromPoint(ev.clientX, ev.clientY);
      if (this.dropHover != null) {
        if (this.dropHover.classList.contains("droppable")) {
          this.dropHover.style.backgroundColor = "#d1d4df";
        } else {
          for (var i = 0; i < divDroppable.length; i++) {
            if (idPage != "DragAndDroptable") {
              divDroppable[i].style.background = "#cad4f8";
            } else {
              divDroppable[i].style.background = "none";
            }
          }
        }
      } else {
        for (var i = 0; i < divDroppable.length; i++) {
          if (idPage != "DragAndDroptable") {
            divDroppable[i].style.background = "#cad4f8";
          } else {
            divDroppable[i].style.background = "none";
          }
        }
      }
    },
    drop(ev) {
      ev.preventDefault();
      this.dropID = ev.target.attributes.index.value;
      var data = ev.dataTransfer.getData("text");
      if (this.dropID == this.dragNumber) {
        document.getElementById(data).style.left = "0px";
        document.getElementById(data).style.top = "0px";
        document.getElementById(data).style.zIndex = null;
        document.getElementById(data).style.pointerEvents = "none";
        ev.target.appendChild(document.getElementById(data));
        ev.target.style.backgroundColor = "#D8EDEF";
        ev.target.style.pointerEvents = "none";
        ev.target.classList.add("ui-droppable-disabled");
        this.sound_true();
        this.trueAnswer(this.activeQuestion.quiz[this.quizCounter]);
        /***************************************************************************/
        this.drag_finshed();
      } else {
        this.sound_false();
        // console.log("sound_false");
        document.getElementById(data).style.pointerEvents = "auto";
      }
    },
    dragend(ev) {
      var element = document.getElementById(this.dragID);
      element.style.left = null;
      element.style.top = null;
      element.style.zIndex = null;
      // ev.target.style.pointerEvents = "auto";
      // console.log(this.dropID);
      if (this.dropID != this.dragNumber) {
        // console.log(this.dropID);
        ev.target.style.pointerEvents = "auto";
      }
      var divDroppable = document.getElementsByClassName("droppable");
      for (var i = 0; i < divDroppable.length; i++) {
        if (idPage != "DragAndDroptable") {
          divDroppable[i].style.background = "#cad4f8";
        } else {
          divDroppable[i].style.background = "none";
        }
      }

      // Reset the z-index
    },

    //drag mobile
    touchStart(event) {
      this.dropID = null;
      this.dragID = event.target.id;
      this.dragNumber = event.target.attributes.index?.value;
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
      event.target.style.zIndex = 50;
    },
    touchMove(event) {
      event.preventDefault();
      var element = document.getElementById(this.dragID);
      element.style.left = event.touches[0].clientX - this.startX + "px";
      element.style.top = event.touches[0].clientY - this.startY + "px";
      element.style.pointerEvents = "none";

      var divDroppable = document.getElementsByClassName("droppable");
      this.dropHover = document.elementFromPoint(
        event.changedTouches[0].clientX,
        event.changedTouches[0].clientY
      );
      if (this.dropHover != null) {
        if (this.dropHover.classList.contains("droppable")) {
          this.dropHover.style.backgroundColor = "#d1d4df";
        } else {
          for (var i = 0; i < divDroppable.length; i++) {
            if (idPage != "DragAndDroptable") {
              divDroppable[i].style.background = "#cad4f8";
            } else {
              divDroppable[i].style.background = "none";
            }
          }
        }
      } else {
        for (var i = 0; i < divDroppable.length; i++) {
          if (idPage != "DragAndDroptable") {
            divDroppable[i].style.background = "#cad4f8";
          } else {
            divDroppable[i].style.background = "none";
          }
        }
      }
    },
    touchEnd(event) {
      event.preventDefault();
      var element = document.getElementById(this.dragID);
      var dropZone = document.elementFromPoint(
        event.changedTouches[0].clientX,
        event.changedTouches[0].clientY
      );
      if (dropZone != null) {
        event.target.style.pointerEvents = "auto";
        if (dropZone.classList.contains("droppable")) {
          this.dropID = dropZone.attributes.index?.value;
          if (this.dropID == this.dragNumber) {
            // console.log(this.activeQuestion);
            // this.activeQuestion.quiz[this.quizCounter].correctCounter += 1;
            // console.log(this.activeQuestion);
            dropZone.appendChild(element);
            dropZone.style.backgroundColor = "#D8EDEF";
            dropZone.classList.add("ui-droppable-disabled");
            event.target.style.pointerEvents = "none";

            // this.sound_true();
            this.trueAnswer(this.activeQuestion.quiz[this.quizCounter]);

            this.drag_finshed();
          } else {
            // this.sound_false();

            this.falseAnswer(this.activeQuestion.quiz[this.quizCounter]);
            event.target.style.pointerEvents = "auto";
          }
        }
      } else {
        event.target.style.pointerEvents = "auto";
      }
      element.style.left = null;
      element.style.top = null;
      element.style.zIndex = null;
      var divDroppable = document.getElementsByClassName("droppable");
      for (var i = 0; i < divDroppable.length; i++) {
        if (idPage != "DragAndDroptable") {
          divDroppable[i].style.background = "#cad4f8";
        } else {
          divDroppable[i].style.background = "none";
        }
      }
    },

    async shuffleDrag() {
      this.activeQuestion.quiz[this.quizCounter].items.forEach((item) => {
        item.drag.forEach((drag, index) => {
          this.shuffledDrag.push({
            word: drag.word,
            number: drag.number,
          });
        });
      });

      if (this.activeQuestion.quiz[this.quizCounter].increasedDragOption) {
        this.activeQuestion.quiz[this.quizCounter].increasedDrag.forEach(
          (increasedDrag) => {
            this.shuffledDrag.push({
              word: increasedDrag.word,
              number: increasedDrag.number,
            });
          }
        );
      }
      let numbers = [...this.shuffledDrag];
      let first,
        second,
        temp,
        count = numbers.length;
      for (let i = 0; i <= this.shuffledDrag.length; i++) {
        first = Math.floor(Math.random() * count);
        second = Math.floor(Math.random() * count);
        temp = numbers[first];
        numbers[first] = numbers[second];
        numbers[second] = temp;
      }
      this.shuffledDrag = numbers;
    },

    async shuffleQuestion() {
      let numbers = [...this.activeQuestion.quiz[this.quizCounter].items];

      let first,
        second,
        temp,
        count = numbers.length;
      for (
        let i = 0;
        i <= this.activeQuestion.quiz[this.quizCounter].items.length;
        i++
      ) {
        first = Math.floor(Math.random() * count);
        second = Math.floor(Math.random() * count);
        temp = numbers[first];
        numbers[first] = numbers[second];
        numbers[second] = temp;
      }
      this.shuffledQuestion = numbers;
    },
    drag_finshed() {
      let count = this.activeQuestion.quiz[this.quizCounter].correctCounter;
      let finshedPopUpX = this.activeQuestion.dragCounter;
      count == finshedPopUpX
        ? setTimeout(() => {
            this.feedback = true;
          }, 1000)
        : false;
    },

    /***/
    /***/
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },

  finished() {
    let result =
      (this.posts[0].LOcorrectcounter / this.posts[0].numberOfquestion) * 100;
    this.posts[0].counterCorrect =
      result == 0
        ? 0
        : result == 0
        ? 0
        : result <= 25
        ? 2.5
        : result <= 50
        ? 5
        : result <= 75
        ? 7.5
        : 10;
    finalResponse.submitData(
      JSON.stringify(this.posts[0]),
      (this.posts[0].counterCorrect * 4) / 10,
      this.posts[0].counterCorrect
    );
    // console.log(this.posts[0].counterCorrect);
  },
}).mount("#app");
