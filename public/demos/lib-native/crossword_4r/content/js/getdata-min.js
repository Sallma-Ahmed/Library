var pageUrl = $("#crossWord").data("urlpage");
new Vue({
    el: "#crossWord",
    data: {
        posts: [],
        keyWordsClicked: [],
        RowNumLine: 20,
        ColumnNumLine: 15,
        clickNumber: 0,
        QuizName: "",
        stateQuiz: 1
    },
    mounted() {
        Promise.all([axios.get("./content/json/Data.json"), axios.get("./content/json/Keys.json")]).then(t => {
            this.posts = t[0].data, this.keyWordsClicked = t[1].data
        }).catch(t => {
            console.log(t)
        })
    },
    methods: {
        startClickGame: function() {
            $(".startButton").css("display", "none"), $(".table, .music ").css("display", "flex"), $(".item").each(function() {
                var t = Math.floor(50 * Math.random()),
                    e = Math.floor(100 * Math.random());
                $(this).css({
                    "-webkit-transform": "translate(" + t + "vw, " + e + "vw)",
                    "-moz-transform": "translate(" + t + "vw, " + e + "vw)"
                })
            });
            let t = this.posts;
            $.each(t, function(t, e) {
                var a = t + 1;
                if ("Row" == e.conditionState) {
                    var o = e.numberStateCol;
                    for (let t = 0; t <= e.wordId.length; t++) {
                        if (0 == t) $('.item[data-col="' + o + '"][data-row="' + e.numberStateRow + '"]').addClass("Button").text(a).attr({
                            id: "boxNumber" + a,
                            "data-question": a,
                            "data-name": e.wordId
                        });
                        else {
                            let i = e.wordId.toString().trim().split("");
                            for (let s = 0; s <= i.length; s++) $('.item[data-col="' + o + '"][data-row="' + e.numberStateRow + '"]').addClass("solidBox boxNumber" + a).text(i[t - 1])
                        }
                        o += 1
                    }
                } else {
                    var i = e.numberStateRow;
                    for (let t = 0; t <= e.wordId.length; t++) {
                        if (0 == t) $('.item[data-col="' + e.numberStateCol + '"][data-row="' + i + '"]').addClass("Button").text(a).attr({
                            id: "boxNumber" + a,
                            "data-question": a,
                            "data-name": e.wordId
                        });
                        else {
                            let o = e.wordId.toString().trim().split("");
                            for (let s = 0; s <= o.length; s++) $('.item[data-col="' + e.numberStateCol + '"][data-row="' + i + '"]').addClass("solidBox boxNumber" + a).text(o[t - 1])
                        }
                        i += 1
                    }
                }
            }), setTimeout(function() {
                $(".item").each(function() {
                    $(this).css({
                        "-webkit-transform": "translate(0 , 0",
                        "-moz-transform": "translate(0, 0)",
                        opacity: 1
                    })
                })
            }, 0), $(".readaudio").attr("src", "./audio/music.mp3"), $(".readaudio").attr("loop", !0), $(".readaudio")[0].autoplay = !0, $(".readaudio")[0].play(), setTimeout(function() {
                $(".readaudioPlay").attr("src", "./audio/Hint/Hint.mp3"), $(".readaudioPlay").attr("loop", !1), $(".readaudioPlay")[0].autoplay = !0, $(".readaudioPlay")[0].play(), $("#boxNumber1").addClass("help")
            }, 1e3)
        },
        MouseMoveItem: function() {
            $("#boxNumber1").removeClass("help");
            let t = event.target.getAttribute("data-question");
            var e = $(event.target).attr("id");
            $("." + e).addClass("active"), $(".item.Button").each(function() {
                $(this).css({
                    "pointer-events": "none"
                })
            }), setTimeout(function() {
                $(".table").css({
                    opacity: 0,
                    "pointer-events": "none"
                }), $(".keyWords").css({
                    opacity: 1,
                    "pointer-events": "auto"
                }), animation.playSegments([0, 50], !0)
            }, 1e3), setTimeout(function() {
                $(".item").each(function() {
                    var t = Math.floor(50 * Math.random());
                    $(this).css({
                        "-webkit-transform": "translate(" + t + "vw, " + t + "vw)",
                        "-moz-transform": "translate(" + t + "vw, " + t + "vw)"
                    }), $(this).removeClass("active")
                })
            }, 1500), setTimeout(function() {
                $(".keyWords .topQuiz").css({
                    opacity: 1,
                    "pointer-events": "auto"
                }), $(".item.Button").not(".closed").each(function() {
                    $(this).css({
                        "pointer-events": "auto"
                    })
                })
            }, 2500), setTimeout(function() {
                $(" .keyWords .downKey").css({
                    opacity: 1,
                    "pointer-events": "auto"
                })
            }, 2500), setTimeout(function() {
                $("button.back").css({
                    opacity: 1,
                    "pointer-events": "auto"
                })
            }, 2e3), this.clickNumber = t, this.posts[this.clickNumber - 1].activeClass = !0;
            let a = event.target.getAttribute("data-name"),
                o = event.target.getAttribute("data-name").toString().trim().split("");
            setTimeout(function() {
                let t = "";
                for (let i = 0; i < a.length; i++) {
                    let a = $("." + e)[i];
                    $(a).hasClass("Finshed") ? (t += '<div class="item-True"  ">' + o[i] + "</div>", console.log("True")) : (t += '<div class="item-Square" data-character="' + o[i] + '"></div>', console.log("False"))
                }
                $(".items-Squares").append(t), $(".items-Squares").removeClass("active").addClass("active"), $(".jkey").css({
                    "pointer-events": "none"
                })
            }, 2500);
            setTimeout(function() {
                $(".jkey").css({
                    opacity: 1,
                    "pointer-events": "auto"
                })
            }, 2600), $(".readaudioPlay").each(function() {
                this.pause(), this.currentTime = 0
            }), $(".readaudioPlay").attr("src", "./audio/click_btn.mp3"), $(".readaudioPlay").attr("loop", !1), $(".readaudioPlay")[0].autoplay = !0, $(".readaudioPlay")[0].play()
        },
        charactersClicked: function() {
            if ($(".readaudioPlay").attr("src", "./audio/click_btn.mp3"), $(".readaudioPlay").attr("loop", !1), $(".readaudioPlay")[0].autoplay = !0, $(".readaudioPlay")[0].play(), 2 == this.stateQuiz && ($(".item-Square").empty().removeClass("True False"), this.QuizName = "", this.stateQuiz = 1), $(".item-Square").length >= this.QuizName.length + 1) {
                let t = $(event.target).text();
                this.QuizName += t, console.log($(".item-Square").length);
                for (let t = 1; t <= this.QuizName.length; t++) {
                    let e = $(".item-Square")[t - 1];
                    $(e).text(this.QuizName[t - 1])
                }
            }
        },
        wordSplitClicked: function() {
            if (2 == this.stateQuiz && ($(".item-Square").empty().removeClass("True False"), this.QuizName = "", this.stateQuiz = 1), $(".item-Square").empty(), "" != this.QuizName) {
                this.QuizName = this.QuizName.slice(0, -1);
                for (let t = 1; t <= this.QuizName.length; t++) {
                    let e = $(".item-Square")[t - 1];
                    $(e).text(this.QuizName[t - 1])
                }
            }
        },
        checkValue: function() {
            if ($(".readaudioPlay").each(function() {
                    this.pause(), this.currentTime = 0
                }), "" != this.QuizName)
                for (let t = 1; t <= $(".item-Square").length; t++) {
                    let e = $(".item-Square")[t - 1];
                    $(e).data("character") == $(e).text() ? $(e).addClass("True") : $(e).addClass("False")
                } else $(".item-Square").addClass("False");
            if (this.stateQuiz = 2, $(".item-Square").length == $(".item-Square.True").length) {
                $("#boxNumber" + this.clickNumber).addClass("Finshed"), $(".boxNumber" + this.clickNumber).addClass("Finshed"), $(".keyWords .topQuiz, .keyWords  .downKey").css({
                    opacity: 0,
                    "pointer-events": "none"
                }), animation.playSegments([50, 0], !0);
                let t = this.clickNumber;
                setTimeout(function() {
                    $("#feedBack ").css({
                        opacity: 1,
                        "pointer-events": "auto"
                    }), $("button.back").css({
                        opacity: 0,
                        "pointer-events": "none"
                    }), feedBack.playSegments([0, 50], !0)
                }, 900), setTimeout(function() {
                    $(".wonderFul, .GoHome").css({
                        opacity: 1,
                        "pointer-events": "auto"
                    }), $(".readaudioPlay").attr("src", "./audio/Hint/" + t + "_A1.mp3"), $(".readaudioPlay").attr("loop", !1), $(".readaudioPlay")[0].autoplay = !0, $(".readaudioPlay")[0].play()
                }, 1700)
            } else $(".readaudioPlay").attr("src", "./audio/Hint/" + this.clickNumber + "_A2.mp3"), $(".readaudioPlay").attr("loop", !1), $(".readaudioPlay")[0].autoplay = !0, $(".readaudioPlay")[0].play()
        },
        GoToHome: function() {
            $(".keyWords .topQuiz, .keyWords  .downKey").css({
                opacity: 0,
                "pointer-events": "none"
            }), animation.playSegments([50, 0], !0), setTimeout(function() {
                $(".item").each(function() {
                    $(this).css({
                        "-webkit-transform": "translate(0 , 0",
                        "-moz-transform": "translate(0, 0)",
                        opacity: 1
                    })
                }), $(".table").css({
                    opacity: 1,
                    "pointer-events": "auto"
                });
                this.clickNumber
            }, 1200), setTimeout(function() {
                $(".keyWords, button.back, .jkey").css({
                    opacity: 0,
                    "pointer-events": "none"
                })
            }, 1600), this.posts[this.clickNumber - 1].activeClass = !1, this.QuizName = "", $(".readaudioPlay").each(function() {
                this.pause(), this.currentTime = 0
            })
        },
        ClickBack: function() {
            feedBack.playSegments([50, 0], !0), $("#feedBack, button.GoHome").css({
                opacity: 0,
                "pointer-events": "none"
            }), setTimeout(function() {
                $(".readaudioPlay").each(function() {
                    this.pause(), this.currentTime = 0
                }), $(".item").each(function() {
                    $(this).css({
                        "-webkit-transform": "translate(0 , 0",
                        "-moz-transform": "translate(0, 0)",
                        opacity: 1
                    })
                }), $(".keyWords, button.back, .jkey").css({
                    opacity: 0,
                    "pointer-events": "none"
                }), $(".table").css({
                    opacity: 1,
                    "pointer-events": "auto"
                })
            }, 1500), this.posts[this.clickNumber - 1].activeClass = !1, this.QuizName = "", setTimeout(function() {
                $(".Button").length == $(".Button.Finshed").length && ($("#crossWord").addClass("FinshedLo"), feedBackEnd.playSegments([0, 50], !0),
                    setTimeout(function() {
                        window.parent.postMessage({
                            code: 4,
                        }, '*');
                        $("button.ReloadPage").css({
                            opacity: 1,
                            "pointer-events": "auto"
                        })
                    }, 1500))
            }, 4e3)
        },
        ReloadPage: function() {
            location.reload(!0)
        },
        ClosedSendScore: function() {
            $(".Button").length > $(".Button.Finshed").length ? (window.parent.postMessage({
                code: 1,
                points: $(".Button.Finshed").length,
                progress: 100 * $(".Button.Finshed").length / $(".Button").length,
                action: "closed"
            }, "*"), console.log("1")) : $(".Button").length == $(".Button.Finshed").length && (window.parent.postMessage({
                code: 4,
                points: $(".Button.Finshed").length,
                progress: 100 * $(".Button.Finshed").length / $(".Button").length,
                action: "closed"
            }, "*"), console.log("1")), $(".readaudioPlay").each(function() {
                this.pause(), this.currentTime = 0
            })
        }
    }
});