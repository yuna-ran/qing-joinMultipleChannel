
/*
 *  These procedures use Agora Video Call SDK for Web to enable local and remote
 *  users to join and leave a Video Call channel managed by Agora Platform.
 */

/*
 *  Create an {@link https://docs.agora.io/en/Video/API%20Reference/web_ng/interfaces/iagorartcclient.html|AgoraRTCClient} instance.
 *
 * @param {string} mode - The {@link https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/clientconfig.html#mode| streaming algorithm} used by Agora SDK.
 * @param  {string} codec - The {@link https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/clientconfig.html#codec| client codec} used by the browser.
 */
var client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
var client2 = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
//var client2 = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
/*
 * Clear the video and audio tracks used by `client` on initiation.
 */
var localTracks = {
  videoTrack: null,
  audioTrack: null
};

var localTracks2 = {
  videoTrack: null,
  audioTrack: null
};


/*
 * On initiation no users are connected.
 */
var remoteUsers = {};
var remoteUsers2 = {};

/*
 * On initiation. `client` is not attached to any project or channel for any specific user.
 */
var options = {
  appid: null,
  channel: null,
  uid: null,
  token: null
};

var options2 = {
  appid: null,
  channel: null,
  uid: null,
  token: null
};

/*
 * When this page is called with parameters in the URL, this procedure
 * attempts to join a Video Call channel using those parameters.
 */
$(() => {
  var urlParams = new URL(location.href).searchParams;
  options.appid = urlParams.get("appid");
  options.channel = urlParams.get("channel");
  options.token = urlParams.get("token");
  options.uid = urlParams.get("uid");
  if (options.appid && options.channel) {
    $("#uid").val(options.uid);
    $("#appid").val(options.appid);
    $("#token").val(options.token);
    $("#channel").val(options.channel);
    $("#join-form").submit();
  }
})

/*
 * When a user clicks Join or Leave in the HTML form, this procedure gathers the information
 * entered in the form and calls join asynchronously. The UI is updated to match the options entered
 * by the user.
 */
$("#join-form").submit(async function (e) {
  e.preventDefault();
  $("#join").attr("disabled", true);
  
  try {
    options.appid = $("#appid").val();
    options.token = $("#token").val();
    options.channel = $("#channel").val();
    options.uid = $("#uid").val();
    options2.appid = $("#appid").val();
    options2.token = $("#token-2").val();
    options2.channel = $("#channel-2").val();
    options2.uid = $("#uid-2").val();
    await Promise.all(join(), join2());

    
    //await join2();

    if(options.token) {
      $("#success-alert-with-token").css("display", "block");
    } else {
      $("#success-alert a").attr("href", `index.html?appid=${options.appid}&channel=${options.channel}&token=${options.token}`);
      $("#success-alert").css("display", "block");
    }
    if(options2.token) {
      $("#success-alert-with-token").css("display", "block");
    } else {
      $("#success-alert a").attr("href", `index.html?appid=${options2.appid}&channel=${options2.channel}&token=${options2.token}`);
      $("#success-alert").css("display", "block");
    }

  } catch (error) {
    console.error(error);
  } finally {
    $("#leave").attr("disabled", false);
  }
})

$("#join-form-2").submit(async function (e) {
  e.preventDefault();
  console.log("join 2 button clicked");
  $("#join-2").attr("disabled", true);
  
  try {
    options2.appid = $("#appid").val();
    options2.token = $("#token-2").val();
    options2.channel = $("#channel-2").val();
    options2.uid = $("#uid-2").val();
    await join2();
    if(options2.token) {
      $("#success-alert-with-token").css("display", "block");
    } else {
      $("#success-alert a").attr("href", `index.html?appid=${options2.appid}&channel=${options2.channel}&token=${options2.token}`);
      $("#success-alert").css("display", "block");
    }
  } catch (error) {
    console.error(error);
  } finally {
    $("#leave-2").attr("disabled", false);
  }
})


/*
 * Called when a user clicks Leave in order to exit a channel.
 */
$("#leave").click(function (e) {
  leave();
  leave2();
})


/*
 * Join a channel, then create local video and audio tracks and publish them to the channel.
 */
async function join() {

  // Add an event listener to play remote tracks when remote user publishes.
  client.on("user-published", handleUserPublished);
  client.on("user-unpublished", handleUserUnpublished);

  

  // Join a channel and create local tracks. Best practice is to use Promise.all and run them concurrently.
  [ options.uid, localTracks.audioTrack, localTracks.videoTrack ] = await Promise.all([
    // Join the channel.
    client.join(options.appid, options.channel, options.token || null, options.uid || null),
    // Create tracks to the local microphone and camera.
  // AgoraRTC.createMicrophoneAudioTrack(),
   //AgoraRTC.createCameraVideoTrack()
  ]);

  // Play the local video track to the local browser and update the UI with the user ID.
  //localTracks.videoTrack.play("local-player");
  //$("#local-player-name").text(`localVideo(${options.uid})`);

  // Publish the local video and audio tracks to the channel.
  //await client.publish(Object.values(localTracks));
  console.log("publish 1 success");
}

async function join2() {

  // Add an event listener to play remote tracks when remote user publishes.
  client2.on("user-published", handleUserPublished2);
  client2.on("user-unpublished", handleUserUnpublished2);

  // Join a channel and create local tracks. Best practice is to use Promise.all and run them concurrently.
  [ options2.uid, localTracks2.audioTrack, localTracks2.videoTrack ] = await Promise.all([
    // Join the channel.
    client2.join(options2.appid, options2.channel, options2.token || null, options2.uid || null),
    // Create tracks to the local microphone and camera.
   // AgoraRTC.createMicrophoneAudioTrack(),
   // AgoraRTC.createCameraVideoTrack()
  ]);

  // Play the local video track to the local browser and update the UI with the user ID.
 // localTracks2.videoTrack.play("local-player");
 // $("#local-player-name-2").text(`localVideo(${options2.uid})`);

  // Publish the local video and audio tracks to the channel.
  await client2.publish(Object.values(localTracks2));
  console.log("publish 2 success");
}


/*
 * Stop all local and remote tracks then leave the channel.
 */
async function leave() {
  for (trackName in localTracks) {
    var track = localTracks[trackName];
    if(track) {
      track.stop();
      track.close();
      localTracks[trackName] = undefined;
    }
  }

  // Remove remote users and player views.
  remoteUsers = {};
  $("#remote-playerlist").html("");

  // leave the channel
  await client.leave();

  //$("#local-player-name").text("");
  $("#join").attr("disabled", false);
  $("#leave").attr("disabled", true);
  console.log("client leaves channel success");
}

async function leave2() {
  for (trackName in localTracks2) {
    var track = localTracks2[trackName];
    if(track) {
      track.stop();
      track.close();
      localTracks2[trackName] = undefined;
    }
  }

  // Remove remote users and player views.
  remoteUsers2= {};
  $("#remote-playerlist-2").html("");

  // leave the channel
  await client2.leave();

  //$("#local-player-name-2").text("");
  $("#join-2").attr("disabled", false);
  $("#leave-2").attr("disabled", true);
  console.log("client leaves channel success");
}


/*
 * Add the local use to a remote channel.
 *
 * @param  {IAgoraRTCRemoteUser} user - The {@link  https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/iagorartcremoteuser.html| remote user} to add.
 * @param {trackMediaType - The {@link https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/itrack.html#trackmediatype | media type} to add.
 */
async function subscribe(user, mediaType) {
  const uid = user.uid;
  // subscribe to a remote user
  await client.subscribe(user, mediaType);
  console.log("subscribe 1 success");
  if (mediaType === 'video') {
    const player = $(`
      <div id="player-wrapper-${uid}">
        <p class="player-name">remoteUser(${uid})</p>
        <div id="player-${uid}" class="player"></div>
      </div>
    `);
    $("#remote-playerlist").append(player);
    user.videoTrack.play(`player-${uid}`);
  }
  if (mediaType === 'audio') {
    user.audioTrack.play();
  }
}


async function subscribe2(user, mediaType) {
  const uid = user.uid;
  // subscribe to a remote user
  await client2.subscribe(user, mediaType);
  console.log("subscribe 2 success");
  if (mediaType === 'video') {
    const player = $(`
      <div id="player-wrapper-${uid}">
        <p class="player-name">remoteUser(${uid})</p>
        <div id="player-${uid}" class="player"></div>
      </div>
    `);
    $("#remote-playerlist-2").append(player);
    user.videoTrack.play(`player-${uid}`);
  }
  if (mediaType === 'audio') {
    user.audioTrack.play();
  }
}




/*
 * Add a user who has subscribed to the live channel to the local interface.
 *
 * @param  {IAgoraRTCRemoteUser} user - The {@link  https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/iagorartcremoteuser.html| remote user} to add.
 * @param {trackMediaType - The {@link https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/itrack.html#trackmediatype | media type} to add.
 */
function handleUserPublished(user, mediaType) {
  const id = user.uid;
  remoteUsers[id] = user;
  subscribe(user, mediaType);
}

/*
 * Remove the user specified from the channel in the local interface.
 *
 * @param  {string} user - The {@link  https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/iagorartcremoteuser.html| remote user} to remove.
 */
function handleUserUnpublished(user) {
  const id = user.uid;
  delete remoteUsers[id];
  $(`#player-wrapper-${id}`).remove();
}

function handleUserPublished2(user, mediaType) {
  const id = user.uid;
  remoteUsers2[id] = user;
  subscribe2(user, mediaType);
}

/*
 * Remove the user specified from the channel in the local interface.
 *
 * @param  {string} user - The {@link  https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/iagorartcremoteuser.html| remote user} to remove.
 */
function handleUserUnpublished2(user) {
  const id = user.uid;
  delete remoteUsers2[id];
  $(`#player-wrapper-${id}`).remove();
}
