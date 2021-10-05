window.fbAsyncInit = function () {
  FB.init({
    appId: '962941260956932',
    cookie: true,
    xfbml: true,
    version: 'v12.0',
  });

  FB.AppEvents.logPageView();
  checkLoginState();
};

(function (d, s, id) {
  let js;
  const fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLoginState() {
  FB.getLoginStatus((response) => {
    statusChangeCallback(response);
  });
}

function statusChangeCallback(response) {
  if (response.status === 'connected') {
    console.log('Is in');
    setElements(true);
    APIFB();
  } else {
    console.log('Not in');
    setElements(false);
  }
}

function APIFB() {
  FB.api(
    '/me',
    'GET',
    { fields: 'name,email,birthday,photos,picture' },
    (response) => {
      if (response && !response.error) {
        buildProfile(response);
      }
    },
  );
  FB.api(
    '/me',
    'GET',
    { fields: 'feed' },
    (response) => {
      if (response && !response.error) {
        buildFeed(response);
      }
    },
  );
}

function buildProfile(user) {
  document.getElementById('profile').innerHTML = `
    <div class="profile-image">
      <img src="${user.picture.data.url}" alt="profile picture">
    </div>
    <div class="profile-username">
      <h3>${user.name}</h3>
    </div>
    <ul class="profile-list">
      <li class="profile-item"><h4>Email: ${user.email}</li></h4>
      <li class="profile-item"><h4>Tanggal Lahir: ${user.birthday}</li></h4>
    </ul>
  `;
}

function buildFeed(post) {
  let output = '';
  for (const i in post.feed.data) {
    if (post.feed.data[i].message) {
      output += `
        <div class="post-item">
          <p class="post-msg">${post.feed.data[i].message.substring(0, 300)} ...</p>
          <p class="post-time">${post.feed.data[i].created_time.substring(0, 10)}</p>
        </div>
      `;
    }
  }

  document.getElementById('post').innerHTML = output;
}

function setElements(isLoggedIn) {
  if (isLoggedIn) {
    document.getElementById('login-index').style.display = 'block';
    document.getElementById('default-index').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('logout').style.display = 'block';
  } else {
    document.getElementById('login-index').style.display = 'none';
    document.getElementById('default-index').style.display = 'block';
    document.getElementById('login').style.display = 'block';
    document.getElementById('logout').style.display = 'none';
  }
}

function logout() {
  FB.logout(() => {
    setElements(false);
  });
}
