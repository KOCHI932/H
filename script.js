const video = document.getElementById('video');
const input = document.getElementById('streamUrl');
const playBtn = document.getElementById('playBtn');
let hls;

function playStream(url){
  if(!url){
    alert('Please enter a valid m3u8 URL');
    return;
  }

  input.value = url;

  if(hls){
    hls.destroy();
    hls = null;
  }

  if(Hls.isSupported()){
    hls = new Hls({enableWorker:true, lowLatencyMode:true});
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(()=>{}));
    hls.on(Hls.Events.ERROR, function(event, data){
      if(data.fatal){
        alert('Stream load error. URL/CORS/server problem হতে পারে।');
      }
    });
  } else if(video.canPlayType('application/vnd.apple.mpegurl')){
    video.src = url;
    video.play().catch(()=>{});
  } else {
    alert('Your browser does not support HLS playback.');
  }
}

playBtn.addEventListener('click', () => playStream(input.value.trim()));

document.querySelectorAll('.channel').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const url = btn.dataset.url;
    if(url) playStream(url);
    else alert('এই channel URL এখনো add করা হয়নি।');
  });
});

const params = new URLSearchParams(window.location.search);
const urlParam = params.get('url');
if(urlParam){
  playStream(urlParam);
}
