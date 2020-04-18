class GenericFetcher {
  constructor() {
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

  // Opens iframes for searches
  openIframes(_url = "") {
    const setAttributes = (el, attrs) => {
      for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
    };

    // Creates iframes for search
    const createIframesForSearch = (url) => {
      // Get the first word before "://" and the first dot "."
      var ifrmId = "searchFrame";

      // Create iframe and set it's attributes
      var ifrm = document.createElement("iframe");
      setAttributes(ifrm, { id: ifrmId, src: url });

      // Append it to ifrmCon
      document.getElementById("ifrmCon").prepend(ifrm);
    };

    // Creates iframe container for the iframes created
    const createIframeContainer = (url) => {
      var ifrmCon = document.createElement("section");
      ifrmCon.style.cssText = `width: 100%; overflow: hidden; display: none`;
      setAttributes(ifrmCon, { id: "ifrmCon" });
      document.body.prepend(ifrmCon);

      createIframesForSearch(url);
      this.handleStatus(`Pulling leads...`);
    };

    createIframeContainer(_url);
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

  // Main method, the execute method.
  exec() {
    this.buildStatus();
    this.openIframes(this.url);

    document.onreadystatechange = () => {
      document.readyState === "complete"
        ? document.getElementById("ifrmCon") != null
          ? this.handleStatus("Pulling completed!")
          : this.handleStatus(`Cheaplead wasn't allowed!`)
        : "";
    };
  }
}

new GenericFetcher();
