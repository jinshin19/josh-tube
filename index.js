const toggleButton = document.querySelector('.wrapper .header .toggle-wrapper'),
searchInputValue = document.querySelector('.search-wrapper input'),
searchButton = document.querySelector('.search-wrapper button'),
videosContainer = document.querySelector('.videos-container'),
videoPlayerWrapper = document.querySelector('.video-player-wrapper'),
closeVideoPlayerWrapper = videoPlayerWrapper.querySelector('button'),
_video = videoPlayerWrapper.querySelector('.video'),
END_POINT = 'https://youtube.googleapis.com/youtube/v3/search?',
SNIPPET = 'part=snippet&',
VIDEO_TYPE = 'type=video&',
MAX_RESULT = 'maxResults=6&',
API_KEY = 'key=AIzaSyD2KQqwwXpHxiAzxl0vfnGTfZFw_By29rA';

// Windows Onload
window.onload = e => {

  if(localStorage.getItem('mode') === 'dark') {
    
    toggleButton.classList.add('dark');
    const mode = new Modes;
    mode.darkModeOn();

  } else {

    toggleButton.classList.remove('dark');
    const mode = new Modes;
    mode.darkModeOff();

  }

}

// Regular Funcions
function videoData (value) {

  _video.innerHTML += `
    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${value}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  `;

}

function clearResults () {

  Array.from(videosContainer.children).forEach(data => data.remove());

}

function getResults (arg) {

  searchInputValue.value = '';

  let url = END_POINT + SNIPPET + VIDEO_TYPE + 'q=' + arg + '&' + MAX_RESULT + API_KEY;

  fetch(url).then(data => {

    return data.json();

  }).then(data => {

    
    let datas = data.items;
    
    datas.forEach(data => {

      videosContainer.innerHTML += `
  
      <button class="content-wrapper" type="button">
        <input type="hidden" value="${data.id.videoId}">
        <img src="${data.snippet.thumbnails.medium.url}" alt="">
        <hr>
        <h1>${data.snippet.title}</h1>
        <div class="label">
          <h3>${data.snippet.channelTitle}</h3>
          <p>${data.snippet.publishTime}</p>
        </div>
      </button>`;

    })

  })

  searchButton.disabled = false;

  setTimeout(() => {
    
    videosContainer.querySelectorAll('button').forEach(data => {

      data.onclick = e => {

        closeVideoPlayerWrapper.disabled = false;
        e.currentTarget.disabled = true;

        videoPlayerWrapper.classList.add('show');

        videoPlayerWrapper.onanimationend = e => {

          console.log(data.querySelector('input'))

          videoData(data.querySelector('input').value);

        }

        setTimeout(() => data.disabled = false, 200);

      }

    })

  }, 1500)

}

// Class
class Modes {

  constructor(classValue) {
    this.class = classValue;
  }

  valueChecker () {

    if(this.class.includes('dark')) {

      this.darkModeOn();

    } else {

      this.darkModeOff();

    }

  }

  darkModeOn () {

    document.querySelector('body').classList.add('dark');
    localStorage.setItem('mode', 'dark');
    
  }
  
  darkModeOff () {
    
    document.querySelector('body').classList.remove('dark');
    localStorage.setItem('mode', 'white');

  }

}

// Onclicks
toggleButton.onclick = e => {

  toggleButton.classList.toggle('dark');

  const mode = new Modes(toggleButton.classList.value);
  mode.valueChecker();

}

searchButton.onclick = e => {

  e.target.disabled = true;
  
  e.currentTarget.classList.add('clicked');
  setTimeout(() => searchButton.classList.remove('clicked'), 100);
  
  if(searchInputValue.value.length === 0) {
    
    searchInputValue.classList.add('red')
    e.target.disabled = false;

  } else {

    videosContainer.classList.add('contents');

    if(videosContainer.children.length > 0) {

      clearResults();
  
      setTimeout(() => getResults(searchInputValue.value), 200);
  
    } else {
  
      getResults(searchInputValue.value);
  
    }

  }

}

closeVideoPlayerWrapper.onclick = e => {

  e.currentTarget.classList.add('clicked');
  setTimeout(() => closeVideoPlayerWrapper.classList.remove('clicked'), 100);

  e.currentTarget.disabled = true;

  setTimeout(() => {

    videoPlayerWrapper.classList.remove('show');

    Array.from(_video.children).forEach(data => data.remove());

  }, 200);

}

// Keypress
searchInputValue.onkeypress = e => {

  if(e.target.value.length > 0) {

    searchInputValue.classList.remove('red');

  }

  if(e.key === 'Enter') {
    
    if(searchInputValue.value.length === 0) {
  
      searchInputValue.classList.add('red');

    } else {

      videosContainer.classList.add('contents');
  
      if(videosContainer.children.length > 0) {

        clearResults();
    
        setTimeout(() => getResults(searchInputValue.value), 200);
    
      } else {
    
        getResults(searchInputValue.value);
    
      }
  
    }

  }

}