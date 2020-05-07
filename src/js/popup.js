class PopUp {
  constructor() {
    console.log("Hello, PopUp Script!");

    this.bgWindow = chrome.extension.getBackgroundPage();
    this.bgDms = this.bgWindow != undefined ? this.bgWindow.domains : undefined;
    this.bgEms = this.bgWindow != undefined ? this.bgWindow.emails : undefined;

    this.textBox = $(".inputCon #filterSearch");
    this.errorBox = $("#errorBox");
    this.totalDms = $(".resultCon #totalDomains");
    this.totalEms = $(".resultCon #totalEmails");
    this.startBtn = $(".buttonCon .buttons button#startPulling");
    this.resultCon = $(".resultCon .resultMain .result");
    this.copyEmailResBtn = $(".resultCon #copyEmailResultBtn");
    this.copyDomainResBtn = $(".resultCon #copyDomainResultBtn");
    this.resultEmails = $(".resultCon .resultMain .result#emails");
    this.resultDomains = $(".resultCon .resultMain .result#domains");

    this.exec();
  }

  // Begin the whole opertions
  startOperation() {
    this.bgWindow.locationUrl != ""
      ? this.textBox
          .attr("disabled", "disabled")
          .val(this.bgWindow.locationUrl) &&
        this.startBtn.attr("disabled", "disabled")
      : "";

    $('[name="filterForm"]').on("submit", (e) => {
      e.preventDefault();

      // this.bgWindow.locationUrl != this.textBox.val()
      //   ? chrome.tabs.create({ url: this.textBox.val() })
      //   : this.textBox.val(this.bgWindow.locationUrl);

      // var urlRegEx = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      var dmRegEx = /(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z][a-zA-Z]{0,61}[a-zA-Z]/g;

      // To make sure the textBox.val() is a domain
      // Place "https://" in front if not available and from=cheaplead if not available
      this.textBox.val().match(dmRegEx)
        ? (() => {
            if (this.textBox.val().includes("alibaba")) {
              if (!this.textBox.val().includes("http")) {
                this.textBox.val().match(/\./gi).length < 1
                  ? (() => {
                      this.bgWindow.locationUrl = `http://www.${this.textBox.val()}`;
                      this.getDomainFromUrl(`http://www.${this.textBox.val()}`);
                    })()
                  : (() => {
                      this.bgWindow.locationUrl = `http://${this.textBox.val()}`;
                      this.getDomainFromUrl(`http://${this.textBox.val()}`);
                    })();

                this.bgWindow.locationUrl.includes("?") &&
                !this.bgWindow.locationUrl.includes("=cheaplead")
                  ? (this.bgWindow.locationUrl = `${this.bgWindow.locationUrl}&from=cheaplead`)
                  : "";

                !this.bgWindow.locationUrl.includes("?")
                  ? (this.bgWindow.locationUrl = `${this.bgWindow.locationUrl}?from=cheaplead`)
                  : "";
              } else {
                this.bgWindow.locationUrl = `${this.textBox.val()}`;

                this.bgWindow.locationUrl.includes("?") &&
                !this.bgWindow.locationUrl.includes("=cheaplead")
                  ? (this.bgWindow.locationUrl = `${this.bgWindow.locationUrl}&from=cheaplead`)
                  : "";

                !this.bgWindow.locationUrl.includes("?")
                  ? (this.bgWindow.locationUrl = `${this.bgWindow.locationUrl}?from=cheaplead`)
                  : "";
              }
            } else {
              if (!this.textBox.val().includes("http")) {
                this.textBox.val().match(/\./gi).length < 1
                  ? (() => {
                      this.bgWindow.locationUrl = `http://www.${this.textBox.val()}`;
                      this.getDomainFromUrl(`http://www.${this.textBox.val()}`);
                    })()
                  : (() => {
                      this.bgWindow.locationUrl = `http://${this.textBox.val()}`;
                      this.getDomainFromUrl(`http://${this.textBox.val()}`);
                    })();

                this.bgWindow.locationUrl.includes("?") &&
                !this.bgWindow.locationUrl.includes("=cheaplead")
                  ? (this.bgWindow.locationUrl = `${this.bgWindow.locationUrl}&from=cheaplead&type=justDomain`)
                  : "";

                !this.bgWindow.locationUrl.includes("?")
                  ? (this.bgWindow.locationUrl = `${this.bgWindow.locationUrl}?from=cheaplead&type=justDomain`)
                  : "";
              } else {
                this.bgWindow.locationUrl = `${this.textBox.val()}`;

                this.bgWindow.locationUrl.includes("?") &&
                !this.bgWindow.locationUrl.includes("=cheaplead")
                  ? (this.bgWindow.locationUrl = `${this.bgWindow.locationUrl}&from=cheaplead&type=justDomain`)
                  : "";

                !this.bgWindow.locationUrl.includes("?")
                  ? (this.bgWindow.locationUrl = `${this.bgWindow.locationUrl}?from=cheaplead&type=justDomain`)
                  : "";
              }
            }
            chrome.tabs.create({
              url: this.bgWindow.locationUrl,
            });
            this.textBox.attr("disabled", "disabled");
            this.startBtn.attr("disabled", "disabled");
          })()
        : (() => {
            this.errorBox.html('Enter a correct domain, e.g "example.com"');
          })();
    });
  }

  getDomainFromUrl(urlBody) {
    var mtchs;
    var rgEx = /(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z][a-zA-Z]{0,61}[a-zA-Z]/g;
    var dmVal = urlBody.toLowerCase();

    // Checks if "dmVal" has a value. i.e not ['null'] nor ['undefined']
    if (dmVal != undefined || dmVal != null || dmVal != "") {
      mtchs = dmVal.match(rgEx).filter((mtch) => !mtch.includes("alibaba"));

      // If there is no result from mtchs? stop loading and close window.

      mtchs.forEach((mtch) =>
        mtch != null
          ? !mtch.includes("www.")
            ? this.bgDms.push(mtch)
            : (() => {
                mtch.split("www.")[1].includes("http")
                  ? mtch
                      .split("www.")[1]
                      .split("http")[0]
                      .match(rgEx)
                      .forEach((mval) => {
                        mval != null ? this.bgDms.push(mval) : "";
                      })
                  : mtch
                      .split("www.")[1]
                      .match(rgEx)
                      .forEach((mval) => {
                        mval != null ? this.bgDms.push(mval) : "";
                      });
              })()
          : ""
      );
    }
  }

  // Cleaans everything for the app, to start again
  clearAll() {
    $("#clear").click(() => {
      this.sendToStore({ domains: this.bgDms, emails: this.bgEms }, () => {
        this.bgWindow.locationUrl = "";
        this.bgWindow.domains = [];
        this.bgWindow.emails = [];
        this.bgDms = [];
        this.bgEms = [];

        this.errorBox.html("");
        this.textBox.val("").removeAttr("disabled", "disabled");
        this.startBtn.removeAttr("disabled", "disabled");

        this.resultCon.text("");
        this.copyEmailResBtn.hide("");
        this.copyDomainResBtn.hide("");

        this.totalDms.text("");
        this.totalEms.text("");

        $(".totalValsCon").hide();

        chrome.browserAction.setBadgeText({ text: "" });
        chrome.runtime.sendMessage({ type: "removeCustomElements" });
      });
    });
  }

  // Store and save every email from user
  sendToStore(data, callback) {
    var customDate = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
    var bag = {
      date: customDate,
      timeSent: Date.now(),
      startUrl: this.bgWindow.locationUrl,
      domains: data.domains,
      emails: data.emails,
    };
    var userBag = {
      _id: "admin@cheaplead.net",
      bags: [bag],
    };

    const isEmpty = (obj) => {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
      }
      return true;
    };

    const saveToStore = (_userBag) => {
      chrome.storage.sync.get(null, (result) => {
        isEmpty(result)
          ? (() => {
              chrome.storage.sync.set({ userBag: _userBag }, callback);
            })()
          : (() => {
              for (const key in result) {
                if (result.hasOwnProperty(key)) {
                  const resultJson = result[key];
                  _userBag.bags.forEach((bag) => resultJson.bags.push(bag));
                  chrome.storage.sync.set({ userBag: resultJson }, callback);
                }
              }
            })();
      });
    };

    saveToStore(userBag);
    callback();
  }

  // Copy to clipboard when use clicks the [copy] button
  copyToClipboard(str) {
    const el = document.createElement("textarea"); // Create a <textarea> element
    el.value = str; // Set its value to the string that you want copied
    el.setAttribute("readonly", ""); // Make it readonly to be tamper-proof
    el.style.position = "absolute";
    el.style.left = "-9999px"; // Move outside the screen to make it invisible
    document.body.appendChild(el); // Append the <textarea> element to the HTML document
    const selected =
      document.getSelection().rangeCount > 0 // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0) // Store selection if found
        : false; // Mark as false to know no selection existed before
    el.select(); // Select the <textarea> content
    document.execCommand("copy"); // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el); // Remove the <textarea> element
    if (selected) {
      // If a selection existed before copying
      document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
      document.getSelection().addRange(selected); // Restore the original selection
    }
  }

  // Display domains result in the result box
  displayDomains() {
    this.bgDms.forEach((bgDm) => {
      this.resultDomains.append(`<span id="dms">${bgDm}\n</span>`);
      if (this.bgDms.length > 0) {
        $(".totalValsCon").show();
        $("#totalDomainsCon").css("display", "inline");
        this.copyDomainResBtn.show();
        this.totalDms.text(`${this.bgDms.length} `);
      }
    });
  }

  // Display emails result in the result box
  displayEmails() {
    this.bgEms.forEach((bgEm) => {
      this.resultEmails.append(`<span id="ems">${bgEm}\n</span>`);
      if (this.bgEms.length > 0) {
        $(".totalValsCon").show();
        $("#totalEmailsCon").css("display", "inline");
        this.copyEmailResBtn.show();
        this.totalEms.text(`${this.bgEms.length} `);
      }
    });
  }

  // Copy results
  copyDomainResults() {
    this.copyDomainResBtn.click((e) => {
      this.copyToClipboard(this.resultDomains.text());
      this.copyDomainResBtn.text("Copied Domains!");
      setTimeout(() => {
        this.copyDomainResBtn.text("Copy Domains");
      }, 1500);
    });
  }

  copyEmailResults() {
    this.copyEmailResBtn.click((e) => {
      this.copyToClipboard(this.resultEmails.text());
      this.copyEmailResBtn.text("Copied Emails!");
      setTimeout(() => {
        this.copyEmailResBtn.text("Copy Emails");
      }, 1500);
    });
  }

  // Display the app version on the popup
  setVersion() {
    var version = chrome.app.getDetails().version;
    $("#version_number").text(version);
  }

  // Main method, the execute method.
  exec() {
    this.startOperation();
    this.copyDomainResults();
    this.copyEmailResults();
    this.displayDomains();
    this.displayEmails();
    this.clearAll();
    this.setVersion();
  }
}

new PopUp();
