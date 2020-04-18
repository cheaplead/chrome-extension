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
    this.copyResBtn = $(".resultCon #copyResultBtn");
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
                this.bgWindow.locationUrl = `http://${this.textBox.val()}`;

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
                this.bgWindow.locationUrl = `http://${this.textBox.val()}`;

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

  // Cleaans everything for the app, to start again
  clearAll() {
    $("#clear").click(() => {
      this.bgWindow.locationUrl = "";
      this.bgWindow.domains = [];
      this.bgWindow.emails = [];

      this.errorBox.html("");
      this.textBox.val("").removeAttr("disabled", "disabled");
      this.startBtn.removeAttr("disabled", "disabled");

      this.resultCon.text("");
      this.copyResBtn.hide("");

      this.totalDms.text("");
      this.totalEms.text("");

      $(".totalValsCon").hide();

      chrome.browserAction.setBadgeText({ text: "" });
      chrome.runtime.sendMessage({ type: "removeCustomElements" });
    });
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
        $(".resultCon .resultMain")
          .addClass("inResultBox")
          .css("background-image", "none");

        $(".totalValsCon").show();
        $("#totalDomainsCon").css("display", "inline");
        this.copyResBtn.show();
        this.totalDms.text(`${this.bgDms.length} `);
        this.resultDomains.html("");
        this.resultDomains.hide();
      } else {
        $(".resultCon .resultMain")
          .removeClass("inResultBox")
          .css("background-image", `url("../img/loading.gif")`);
      }
    });
  }

  // Display emails result in the result box
  displayEmails() {
    this.bgEms.forEach((bgEm) => {
      this.resultEmails.append(`<span id="ems">${bgEm}\n</span>`);
      if (this.bgEms.length > 0) {
        $(".resultCon .resultMain")
          .addClass("inResultBox")
          .css("background-image", "none");

        $(".totalValsCon").show();
        $("#totalEmailsCon").css("display", "inline");
        this.copyResBtn.show();
        this.totalEms.text(`${this.bgEms.length} `);
      } else {
        $(".resultCon .resultMain")
          .removeClass("inResultBox")
          .css("background-image", `url("../img/loading.gif")`);
      }
    });
  }

  // Copy results
  copyResults() {
    this.copyResBtn.click((e) => {
      this.copyToClipboard(this.resultEmails.text());
      this.copyResBtn.text("Copied!");
      setTimeout(() => {
        this.copyResBtn.text("Copy");
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
    this.copyResults();
    this.displayDomains();
    this.displayEmails();
    this.clearAll();
    this.setVersion();
  }
}

new PopUp();
