const button = document.querySelector('.btn');
const audio = document.querySelector('.audio');

// VoiceRSS Javascript SDK
const VoiceRSS = {
  speech(e) {
    this._validate(e);
    this._request(e);
  },
  _validate(e) {
    if (!e) throw "The settings are undefined";
    if (!e.key) throw "The API key is undefined";
    if (!e.src) throw "The text is undefined";
    if (!e.hl) throw "The language is undefined";
    if (e.c && "auto" != e.c.toLowerCase()) {
      let a = !1;
      switch (e.c.toLowerCase()) {
        case "mp3":
          a = new Audio().canPlayType("audio/mpeg").replace("no", "");
          break;
        case "wav":
          a = new Audio().canPlayType("audio/wav").replace("no", "");
          break;
        case "aac":
          a = new Audio().canPlayType("audio/aac").replace("no", "");
          break;
        case "ogg":
          a = new Audio().canPlayType("audio/ogg").replace("no", "");
          break;
        case "caf":
          a = new Audio().canPlayType("audio/x-caf").replace("no", "");
      }
      if (!a) throw `The browser does not support the audio codec ${e.c}`;
    }
  },
  _request(e) {
    const a = this._buildRequest(e);
    const t = this._getXHR();
    t.onreadystatechange = function () {
      if (4 == t.readyState && 200 == t.status) {
        if (0 == t.responseText.indexOf("ERROR")) throw t.responseText;
        let e = t.responseText;
        audio.src = e;
        audio.onloadedmetadata = () => {
          audio.play();
        };
      }
    };
    t.open("POST", "https://api.voicerss.org/", !0);
    t.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
    t.send(a);
  },
  _buildRequest(e) {
    const a =
      e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec();
    return `key=${e.key || ""}&src=${e.src || ""}&hl=${e.hl || ""}&r=${e.r || ""}&c=${
      a || ""
    }&f=${e.f || ""}&ssml=${e.ssml || ""}&b64=true`;
  },
  _detectCodec() {
    const e = new Audio();
    return e.canPlayType("audio/mpeg").replace("no", "")
      ? "mp3"
      : e.canPlayType("audio/wav").replace("no", "")
      ? "wav"
      : e.canPlayType("audio/aac").replace("no", "")
      ? "aac"
      : e.canPlayType("audio/ogg").replace("no", "")
      ? "ogg"
      : e.canPlayType("audio/x-caf").replace("no", "")
      ? "caf"
      : "";
  },
  _getXHR() {
    try {
      return new XMLHttpRequest();
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml3.XMLHTTP");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {}
    try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}
    throw "The browser does not support HTTP request";
  },
};

function toggleButton () {
    button.disabled = !button.disabled;
}

async function getJokes() {
    const apiUrl = 'https://v2.jokeapi.dev/joke/Programming,Dark?blacklistFlags=nsfw,religious';
    let joke = '';
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.setup) {
            joke = `${data.setup} ... ${data.delivery}`;
        } else {
            joke = data.joke;
        }
        
        tellMe(joke);
        toggleButton();
    } catch (error) {
        console.log('Api not fetched', error);
    }
}

function tellMe(joke) {
    VoiceRSS.speech({
        key: '336e049c34564901ba181777ecafbfc1',
    src: joke,
    hl: 'en-us',
    v: 'Linda',
    r: 0,
    c: 'mp3',
    f: '44khz_16bit_stereo',
    ssml: false,
 })
}

button.addEventListener('click', getJokes);
audio.addEventListener('ended', toggleButton)
