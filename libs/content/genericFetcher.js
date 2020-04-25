class GenericFetcher {
  constructor() {
    console.log("Hi, from GenericFetcher");
    this.bodyHtml = document.body.innerHTML;
    this.extLinks = [];
    this.gnExtnlEms = [];
    this.domain = "";

    !location.hostname.includes("www.")
      ? (this.domain = location.hostname)
      : (() => {
          this.domain =
            location.hostname.split("www.").length <= 1
              ? location.hostname.split("www.")[0]
              : location.hostname.split("www.")[1];
        })();

    this.url = `https://www.bing.com/search?q=[@${this.domain}]&from=cheaplead`;
    this.exec();
  }

  // Set multiple attribute to element
  setAttributes(el, attrs) {
    for (var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

  // Fetches all it's emails
  fetchEmails() {
    var eMtchs,
      regEx = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
      // regEx = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/gi,
      bodyText = document.body.innerText.toLowerCase().trim().match(regEx);

    // Checks if "bodyText" has a value. i.e not ['null'] nor ['undefined']
    if (bodyText != null) {
      eMtchs = bodyText.filter(
        (eM) =>
          !eM.includes("gmail") &&
          !eM.includes("mail") &&
          !eM.includes("ymail") &&
          !eM.includes("bing") &&
          !eM.includes("zoho") &&
          !eM.includes("hotmail") &&
          !eM.includes("htomain") &&
          !eM.includes("hotmali") &&
          !eM.includes("live") &&
          !eM.includes("msn") &&
          !eM.includes("outlook") &&
          !eM.includes("linkedin") &&
          !eM.includes("google") &&
          !eM.includes("alibaba") &&
          !eM.includes("aibaba") &&
          !eM.includes("ablibaba") &&
          !eM.includes("abilbaba") &&
          !eM.includes("allibaba") &&
          !eM.includes("aliexpress") &&
          !eM.includes("made-in-china") &&
          !eM.includes("1688") &&
          !eM.includes("126") &&
          !eM.includes("163") &&
          !eM.includes("ebay") &&
          !eM.includes("shopify") &&
          !eM.includes("amazon") &&
          !eM.includes("youtube") &&
          !eM.includes("skype") &&
          !eM.includes("facebook") &&
          !eM.includes("instagram") &&
          !eM.includes("whatsapp") &&
          !eM.includes("yahoo") &&
          !eM.includes("yandex") &&
          !eM.includes("duckduckgo") &&
          !eM.includes("wordpress") &&
          !eM.includes("asp") &&
          !eM.includes("html") &&
          !eM.includes("qq") &&
          !eM.includes("icloud")
      );
      eMtchs.forEach((eMtch) => {
        eMtch = eMtch.trim().toLowerCase();
        !this.gnExtnlEms.includes(eMtch)
          ? (() => {
              // get email's tld (.com, .net etc...) and get rid of all other words joined to those tlds
              var emailTld = eMtch.split(/\./gi)[
                eMtch.split(/\./gi).length - 1
              ];

              emailTld.charAt(0) == "c" &&
              emailTld.charAt(1) == "o" &&
              emailTld.charAt(2) == "m"
                ? this.gnExtnlEms.push(eMtch.replace(emailTld, "com"))
                : emailTld.charAt(0) == "c" && emailTld.charAt(1) == "n"
                ? this.gnExtnlEms.push(eMtch.replace(emailTld, "cn"))
                : this.gnExtnlEms.push(eMtch);
            })()
          : "";
      });
    }

    chrome.runtime.sendMessage({
      type: "arrangeEmails",
      data: { ems: this.gnExtnlEms },
    });
  }

  // Build iframes Container
  buildIframeCon() {
    // Creates iframe container for the iframes created
    var ifrmCon = document.createElement("section");
    ifrmCon.style.cssText = `width: 100%; overflow: hidden; display: none`;
    this.setAttributes(ifrmCon, { id: "ifrmCon" });
    document.body.prepend(ifrmCon);
  }

  // Creates iframes
  createIframe(url) {
    // Get the first word before "://" and the first dot "."
    var ifrmId = url.split("://")[1].split(".")[0].includes("www")
      ? url.split("://")[1].split(".")[1]
      : url.split("://")[1].split(".")[0];

    // Create iframe and set it's attributes
    var ifrm = document.createElement("iframe");
    this.setAttributes(ifrm, { id: ifrmId, src: url });

    // Append it to ifrmCon
    document.getElementById("ifrmCon").prepend(ifrm);
  }

  openIframe(url = "") {
    this.createIframe(url);
    this.handleStatus("loading", `Pulling leads...`);
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
        z-index: 4999;
        background-color: #ffffff !important;
        padding: 10px 15px;
        border: 1.5px solid #fcb917;
        border-right: none !important;
        transition: all 0.25s !important;
        border-radius: 50px 0px 0px 50px;
        cursor: pointer;
      }

      .status #statusMsg * {
        color: #28324a !important;
      }
      
    </style>
    <section class="status" id="status">
        <img src="" width="20" alt="https://cheaplead.net"/>
        <div id="statusMsg" style="margin-left: 5px; font-size: 13px;">
          <span></span>
        </div>
    </section>`;

    $(html).prependTo("body");

    $("#status").click(() => {
      $("#statusMsg span").css("display") == "inline"
        ? $("#statusMsg span").css("display", "none")
        : $("#statusMsg span").css("display", "inline");
    });
  }

  // Print message to the status popup
  handleStatus(state, msg) {
    state = state.toLowerCase().trim();
    state == "loading"
      ? $("#status img").attr(
          "src",
          chrome.runtime.getURL("src/img/loader.gif")
        )
      : state == "done" || state == "failed"
      ? $("#status img").attr("src", chrome.runtime.getURL("src/img/icon.png"))
      : "";
    $("#statusMsg span").text(msg);
  }

  // Find "location.hostname/about" links in bodyHtml
  fetchAndOpenLinkUrl(htmlBody) {
    var linkAbouts, linkContacts;
    const regEx = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi;
    var linksRes = htmlBody.toLowerCase().trim().match(regEx);

    if (linksRes != null) {
      linkAbouts = linksRes.filter(
        (link) =>
          link.trim().includes("about") &&
          !link.trim().includes("/#") &&
          !link.trim().includes("#")
      );
      linkContacts = linksRes.filter(
        (link) =>
          link.trim().includes("contact") &&
          !link.trim().includes("/#") &&
          !link.trim().includes("#")
      );

      linkAbouts.forEach((lA) =>
        !this.extLinks.includes(lA)
          ? (() => {
              lA =
                lA.split(`href="`)[1].split(`"`)[0] ||
                lA.split(`href='`)[1].split(`'`)[0];

              var la = lA.split("?")[0];
              la.includes("about")
                ? !this.extLinks.includes(`${la}`)
                  ? this.extLinks.push(`${la}`)
                  : ""
                : "";
            })()
          : ""
      );
      linkContacts.forEach((lC) =>
        !this.extLinks.includes(lC)
          ? (() => {
              lC =
                lC.split(`href="`)[1].split(`"`)[0] ||
                lC.split(`href='`)[1].split(`'`)[0];

              var lc = lC.split("?")[0];
              lc.includes("contact")
                ? !this.extLinks.includes(`${lc}`)
                  ? this.extLinks.push(`${lc}`)
                  : ""
                : "";
            })()
          : ""
      );

      this.extLinks.forEach((ext, index) => {
        if (!ext.includes("://")) {
          ext.charAt(0).includes("/")
            ? (() => {
                this.extLinks.splice(
                  index,
                  1,
                  `${location.protocol}//${location.host}${ext}`
                );
              })()
            : (() => {
                this.extLinks.splice(
                  index,
                  1,
                  `${location.protocol}//${location.host}/${ext}`
                );
              })();
        }
      });

      this.extLinks.forEach((linkUrl) =>
        this.openIframe(`${linkUrl}?from=cheaplead&type=justDomain`)
      );
    }
  }

  // Main method, the execute method.
  exec() {
    this.buildStatus();
    this.buildIframeCon();
    this.openIframe(this.url);
    this.fetchEmails();
    this.fetchAndOpenLinkUrl(this.bodyHtml);

    document.onreadystatechange = () => {
      document.readyState === "complete"
        ? document.getElementById("ifrmCon") != null
          ? this.handleStatus("done", "Pulling completed!")
          : this.handleStatus("failed", `Cheaplead wasn't allowed!`)
        : "";
    };
  }
}

new GenericFetcher();
