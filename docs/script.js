'use strict';

let localStream = null;
let peer = null;
let existingCall = null;
let cameraFacing = false;

navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function (stream) {
        // Success
        $('#my-video').get(0).srcObject = stream;
        localStream = stream;

        // キャンパス情報追加
        var canvasVideo = document.getElementById("synthetic-canvas1");
        var paintStream = canvasVideo.captureStream(30);
        localStream.addTrack(paintStream.getVideoTracks()[0]);

    }).catch(function (error) {
    // Error
    console.error('mediaDevice.getUserMedia() error:', error);
    return;
});

peer = new Peer({
    key: '3ef530e9-4d86-4607-825c-eb41653e72cc',
    debug: 3
});

peer.on('open', function(){
    $('#my-id').text(peer.id);
});

peer.on('error', function(err){
    alert(err.message);
    if(localStream.getVideoTracks().length > 1){
        // 既に２つ以上トラックが含まれる場合は、2つ目以降のトラックを削除
        for(let i = 1; i < localStream.getVideoTracks().length; i++){
            localStream.removeTrack(localStream.getVideoTracks()[i]);
        }
    }
});

peer.on('close', function(){
    if(localStream.getVideoTracks().length > 1){
        // 既に２つ以上トラックが含まれる場合は、2つ目以降のトラックを削除
        for(let i = 1; i < localStream.getVideoTracks().length; i++){
            localStream.removeTrack(localStream.getVideoTracks()[i]);
        }
    }

    // ペイント関連を非表示にする。
    var paintgroup = document.getElementsByClassName("paint-wrapper");
    for(let i = 0; i < paintgroup.length; i++){
         paintgroup[i].style.display = "none";
    }
});

peer.on('disconnected', function(){
});

$('#make-call').submit(function(e){
    e.preventDefault();

    const call = peer.call($('#callto-id').val(), localStream);
    setupCallEventHandlers(call);
});

$('#end-call').click(function(){
    existingCall.close();
});

$('#chg-screen').click(function(e){
    e.preventDefault();

    var vi = document.getElementById('my-video');
    const mode = cameraFacing ? "environment" : "user";

    // フロントカメラをそのまま使うと、左右反転してしまうので、activeクラスとcssでミラー処理
    //cameraFacing ?  vi.classList.remove("active") : vi.classList.add("active");

    // Android Chromeでは、セッションを一時停止しないとエラーが出ることがある
    // stopStreamedVideo(vi);

    // カメラ切り替え
     navigator.mediaDevices.getUserMedia({ video: { facingMode: mode } })
            .then(function(stream){
                localStream.getVideoTracks()[0] = stream
            })
            .catch(err => alert(`${err.name} ${err.message}`)); 
    cameraFacing = !cameraFacing;
})

// videoセッション一時停止
function stopStreamedVideo(videoElem) {
    let stream = videoElem.srcObject;
    let tracks = stream.getTracks();

    tracks.forEach(function(track) {
        track.stop();
    });

    videoElem.srcObject = null;
}

peer.on('call', function(call){

    // ペイント関連を表示にする。
    var paintgroup = document.getElementsByClassName("paint-wrapper");
    for(let i = 0; i < paintgroup.length; i++){
         paintgroup[i].style.display = "block";
    }

    var _tracklengs = localStream.getVideoTracks().length;

    call.answer(localStream);
    setupCallEventHandlers(call);
});

function setupCallEventHandlers(call){
    if (existingCall) {
        existingCall.close();
    };

    existingCall = call;

    call.on('stream', function(stream){

        for(let i = 0; i < stream.getVideoTracks().length; i++){
            console.log(i + ":" + stream.getVideoTracks()[i].id);
        }

        addVideo(stream);
        setupEndCallUI();
        $('#their-id').text(call.remoteId);
    });
    call.on('close', function(){
        setupMakeCallUI();
    });
}

function addVideo(stream){
    var _tracklengs = stream.getVideoTracks().length;
    if( _tracklengs == 2){
        var _peerVideo = new webkitMediaStream();
        var _peerPaint = new webkitMediaStream();
        // 作成した２つの空のMediaStream Objectに、
        // それぞれビデオとキャプチャ用のTrackを追加する
        _peerVideo.addTrack(stream.getVideoTracks()[0]);
        _peerPaint.addTrack(stream.getVideoTracks()[1]);

        $('#my-video').get(0).srcObject = _peerPaint;
        $('#their-video').get(0).srcObject = _peerVideo;

        $('#my-audio').get(0).srcObject = _peerVideo;
        $('#their-audio').get(0).srcObject = _peerVideo;

    }else{
        $('#their-video').get(0).srcObject = stream;
    }
}

function setupMakeCallUI(){
    $('#make-call').show();
    $('#end-call').hide();
    // ペイント関連を非表示にする。
    var paintgroup = document.getElementsByClassName("paint-wrapper");
    for(let i = 0; i < paintgroup.length; i++){
         paintgroup[i].style.display = "none";
    }

    // 描画情報削除
    var canvasVideo = document.getElementById("synthetic-canvas1");
    var canvasPaint = document.getElementById("synthetic-canvas2");
    var contextPaint = canvasPaint.getContext('2d');
    var contextVideo = canvasVideo.getContext('2d');
    contextPaint.clearRect(0, 0, canvasPaint.width, canvasPaint.height);
    contextVideo.clearRect(0, 0, canvasVideo.width, canvasVideo.height);
}

function setupEndCallUI() {
    $('#make-call').hide();
    $('#end-call').show();
}

$(function() {
    var startX;
    var startY;
    var flag = false;
    var video = document.getElementById("their-video");
    var canvasVideo = document.getElementById("synthetic-canvas1");
    var canvasPaint = document.getElementById("synthetic-canvas2");

    // Canvasのサイズを揃える
//    canvasVideo.width = canvasVideo.width * 2
//    canvasVideo.height = canvasVideo.height * 2
//    canvasPaint.width = canvasVideo.width;
//    canvasPaint.height = canvasVideo.height;
    setResolution(canvasVideo);
    setResolution(canvasPaint);

    var contextPaint = canvasPaint.getContext('2d');
    var contextVideo = canvasVideo.getContext('2d');

    // ペイント関連を非表示にする。
    var paintgroup = document.getElementsByClassName("paint-wrapper");
    for(let i = 0; i < paintgroup.length; i++){
         paintgroup[i].style.display = "none";
    }

    //描画処理
    draw();
    
    $('#their-canvas').mousedown(function(e) {

        var paintgroup = document.getElementById("paint-group1");
        if(paintgroup.style.visibility != "hidden"){
            flag = true;
        }
        var raitoX =  canvasVideo.width/canvasVideo.clientWidth;
        var raitoY = canvasVideo.height/canvasVideo.clientHeight;

        startX = (e.pageX - $('#their-canvas').offset().left) * raitoX;
        startY = (e.pageY - $('#their-canvas').offset().top) * raitoY;

        return false; // for chrome
    });
 
    $('#their-canvas').mousemove(function(e) {
        if (flag) {
            var raitoX = canvasVideo.width/canvasVideo.clientWidth;
            var raitoY = canvasVideo.height/canvasVideo.clientHeight;

            var endX = (e.pageX - $('#their-canvas').offset().left) * raitoX;
            var endY = (e.pageY - $('#their-canvas').offset().top) * raitoY;

            contextPaint.lineWidth = 2;
            contextPaint.beginPath();
            contextPaint.moveTo(startX, startY);
            contextPaint.lineTo(endX, endY);
            contextPaint.stroke();
            contextPaint.closePath();
            startX = endX;
            startY = endY;
        }

    });
 
    $('#their-canvas').on('mouseup', function() {
        flag = false;
    });
 
    $('#their-canvas').on('mouseleave', function() {
        flag = false;
    });
 
    $('li').click(function() {
        contextPaint.strokeStyle = $(this).css('background-color');
    });
 
    $('#clear').click(function(e) {
        e.preventDefault();
        contextPaint.clearRect(0, 0, canvasPaint.width, canvasPaint.height);
        contextVideo.clearRect(0, 0, canvasVideo.width, canvasVideo.height);
        // 描画
        draw();
    });
 
    $('#save').click(function() {
        var d = canvasVideo.toDataURL('image/png');
        d = d.replace('image/png', 'image/octet-stream');
        window.open(d, 'save');
    });

    function setResolution(c) {
        c.width = 720;
        c.height = 480;

    }

    function draw(){
        // ビデオの内容をクリア
        //displayContext.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
        contextVideo.clearRect(0, 0, canvasVideo.width, canvasVideo.height);

        //video2の加工
        contextVideo.drawImage(video, 0, 0, canvasVideo.width, canvasVideo.height);

        //描画の加工
        //displayContext.drawImage(displayCanvas, 0, 0, displayCanvas.width, displayCanvas.height);

        //重ね合わせ
        contextVideo.drawImage(canvasPaint,0,0)

        //次フレームの描画時に処理を呼び出す
        requestAnimationFrame(draw);
    };
});

