class GenericFetcher {
  constructor() {
    console.log("Hi, from GenericFetcher");
    this.bodyHtml = document.body.innerHTML;
    this.extLinks = [];
    this.domain = "";

    !location.hostname.includes("www.")
      ? (this.domain = location.hostname)
      : (() => {
          this.domain =
            location.hostname.split("www.").length <= 1
              ? location.hostname.split("www.")[0]
              : location.hostname.split("www.")[1];
        })();

    // nextUrl = `https://search.yahoo.com/search?p=[@${this.domain}]&from=cheaplead`;
    this.url = `https://www.bing.com/search?q=[@${this.domain}]&from=cheaplead`;

    this.exec();
  }

  // Set multiple attribute to element
  setAttributes(el, attrs) {
    for (var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

  // Opens iframes
  openIframes(url = "") {
    // Creates iframe container for the iframes created
    var ifrmCon = document.createElement("section");
    ifrmCon.style.cssText = `width: 100%; overflow: hidden; display: none`;
    this.setAttributes(ifrmCon, { id: "ifrmCon" });
    document.body.prepend(ifrmCon);

    this.createIframe(url);
    this.handleStatus(`Pulling leads...`);
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
        background-color: #28324a;
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

  // Find "location.hostname/about" links in bodyHtml
  fetchAndOpenLinkUrl(htmlBody) {
    var linkAbouts, linkContacts;
    const regEx = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi;
    var linksRes = htmlBody.toLowerCase().trim().match(regEx);

    if (linksRes != null) {
      linkAbouts = linksRes.filter(
        (link) => link.trim().includes("about") && !link.trim().includes("/#")
      );
      linkContacts = linksRes.filter(
        (link) => link.trim().includes("contact") && !link.trim().includes("/#")
      );

      linkAbouts.forEach((lA) =>
        !this.extLinks.includes(lA)
          ? (() => {
              lA = lA.split(`"`) || lA.split(`'`);
              lA.forEach((la) => {
                la = la.split("?")[0];
                la.includes("about")
                  ? !this.extLinks.includes(la)
                    ? !la.includes("://")
                      ? this.extLinks.push(
                          `${location.protocol}//${location.host}/${la}`
                        )
                      : this.extLinks.push(`${la}`)
                    : ""
                  : "";
              });
            })()
          : ""
      );
      linkContacts.forEach((lC) =>
        !this.extLinks.includes(lC)
          ? (() => {
              lC = lC.split(`"`) || lC.split(`'`);
              lC.forEach((lc) => {
                lc = lc.split("?")[0];
                lc.includes("contact")
                  ? !this.extLinks.includes(lc)
                    ? !lc.includes("://")
                      ? this.extLinks.push(
                          `${location.protocol}//${location.host}/${lc}`
                        )
                      : this.extLinks.push(`${lc}`)
                    : ""
                  : "";
              });
            })()
          : ""
      );

      console.log("external Links: ", this.extLinks);
      this.handleStatus(`Routing to pages...`);
      this.extLinks.forEach((linkUrl) => this.createIframe(linkUrl));
    }
  }

  // Main method, the execute method.
  exec() {
    this.buildStatus();
    this.openIframes(this.url);
    this.fetchAndOpenLinkUrl(this.bodyHtml);

    // document.onreadystatechange = () => {
    //   document.readyState === "complete"
    //     ? document.getElementById("ifrmCon") != null
    //       ? this.handleStatus("Pulling completed!")
    //       : this.handleStatus(`Cheaplead wasn't allowed!`)
    //     : "";
    // };
  }
}

new GenericFetcher();
