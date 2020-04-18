class Ali {
  constructor() {
    this.cntLnkArr = [];
    this.srch = {
      path: "/trade/search",
      path_2: "/corporations",
      query: "indexarea=company_en",
    };
    this.exec(location.href.toLowerCase());
  }

  // Get all user's contacts URLs Listed from Ali
  getContactLinks() {
    // Fetch contact properties
    var cntPgLnkArr = $(
      "#J-items-content > div > div > div.top > div.corp > div.company > a.cd"
    ).children();

    // Extract and push.
    for (let i = 0; i < cntPgLnkArr.prevObject.length; i++) {
      this.cntLnkArr.push(cntPgLnkArr.prevObject[i].href);
    }

    // Return cntLnkArr value
    return this.cntLnkArr;
  }

  // Open all links in iframes!
  openContactLinks(urlArr) {
    const setAttributes = (el, attrs) => {
      for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
    };

    const validateAndAppendFromCheaplead = (url = "") => {
      url = !url.includes("https") ? url.replace("http", "https") : "";
      url = url.includes("?")
        ? `${url}&from=cheaplead`
        : `${url}?from=cheaplead`;

      return url;
    };

    const openIFramesForLinks = (url = "") => {
      // Get the first word before "://" and the first dot "."
      var ifrmId = url.split("://")[1].split(".")[0];

      // Create iframe and set it's attributes
      var ifrm = document.createElement("iframe");
      setAttributes(ifrm, { id: ifrmId, src: url });

      // Append it to ifrmCon
      this.handleStatus(`Pulling leads...`);
      document.getElementById("ifrmCon").prepend(ifrm);
    };

    const closeIframesWithHttp = () => {
      var ifrms = document.getElementsByTagName("iframe");
      for (let i = 0; i < ifrms.length; i++) {
        const ifrm = ifrms[i];
        !ifrm.src.includes("https")
          ? document
              .getElementById(ifrm.id)
              .parentNode.removeChild(document.getElementById(ifrm.id))
          : "";
      }
    };

    // Open's a new Window for the new operation
    if (confirm(`Cheaplead is about opening ${urlArr.length} pages, Ok?`)) {
      var ifrmCon = document.createElement("section");
      ifrmCon.style.cssText = `width: 100%; overflow: hidden; display: none`;
      setAttributes(ifrmCon, { id: "ifrmCon" });
      document.body.prepend(ifrmCon);

      urlArr.forEach((url) => {
        url = validateAndAppendFromCheaplead(url);
        if (url.includes("https://")) {
          openIFramesForLinks(url);
        } else {
          closeIframesWithHttp();
        }
      });
    } else {
      this.handleStatus(`Cheaplead wasn't allowed!`);
    }
  }

  // Build the status popup floating box at the right hand that shows all progress on the extraction
  buildStatus() {
    var html = `
    <style>
      @font-face {
        font-family: "BreeSerif";
        src: url(${chrome.runtime.getURL(
          "src/fonts/BreeSerif/BreeSerif-Regular.otf"
        )})
      }

      .status#status {
        display: flex;
        align-items: center;
        position: fixed;
        top: 15%;
        right: 0;
        max-width: 300px;
        min-height: 20px;
        max-height: 100px;
        font-family: "BreeSerif", sans-serif !important;
        z-index: 2999;
        background-image: linear-gradient(to bottom, #434e83, #28334a 80%);
        padding: 10px 15px;
        transition: linear 0.25s;
        border-radius: 50px 0px 0px 50px;
      }

      .status #statusMsg * {
        color: #fcb917ff !important;
      }
      
    </style>
    <section class="status" id="status">
        <img src="${chrome.runtime.getURL(
          "icons/icon.png"
        )}" width="20" alt="https://cheaplead.net"/>
        <div id="statusMsg" style="margin-left: 5px; margin-top: -2px; font-size: 13px;">
          <span></span>
        </div>
    </section>`;

    $(html).prependTo("body");
  }

  // Print message to the status popup
  handleStatus(msg) {
    $("#statusMsg span").text(msg);
  }

  // Test connection to all iframes created.
  testConnectionToFrames() {
    var isTop = true;
    chrome.runtime.onMessage.addListener(function (req) {
      if (req.type == "testingConnections") {
        console.info(`Frames: ${req.data.connection} connected!`);
      }
    });
  }

  // Removes all custom made html elements when user click ["clear"] button
  removeCustomElementsOnClearBtn() {
    var ifrmCon = document.getElementById("ifrmCon");
    var statusCon = document.getElementById("status");
    var statusMsg = document.getElementById("statusMsg");

    chrome.runtime.onMessage.addListener(function (req) {
      if (req.type == "removeCustomElementsOnClearBtn") {
        if (ifrmCon != null) {
          statusMsg.innerHTML = "";
          statusCon.style.display = "none";
          ifrmCon.parentNode.removeChild(ifrmCon);
        }
      }
    });
  }

  // Delete all Frames without domains and frames after extraction of domains
  deleteFrames() {
    chrome.runtime.onMessage.addListener(function (req) {
      if (req.type == "deleteFrames") {
        document
          .getElementById(req.data.id)
          .parentNode.removeChild(document.getElementById(req.data.id));
      }
    });
  }

  // Change src attr to req.data.url, to start search engines
  setUrlToSrc() {
    chrome.runtime.onMessage.addListener(function (req) {
      if (req.type == "setUrlToSrc") {
        document.getElementById(req.data.id).src = req.data.url;
      }
    });
  }

  // Main method, the execute method.
  exec(locHref) {
    // Run only id it's from cheaplead, i.e on if location.href has "from=cheaplead"
    if (locHref.includes("from=cheaplead")) {
      // Only runs in "trade/search" and "company_en" urls
      if (
        (locHref.includes(this.srch.path) &&
          locHref.includes(this.srch.query)) ||
        locHref.includes(this.srch.path_2)
      ) {
        this.buildStatus();
        this.testConnectionToFrames();
        this.removeCustomElementsOnClearBtn();
        this.deleteFrames();
        this.setUrlToSrc();

        this.getContactLinks();
        this.openContactLinks(this.cntLnkArr);
        document.onreadystatechange = () => {
          document.readyState === "complete"
            ? document.getElementById("ifrmCon") != null
              ? this.handleStatus("Pulling completed!")
              : this.handleStatus(`Cheaplead wasn't allowed!`)
            : "";
        };
      }
    }
  }
}

new Ali();
