'use strict';

let localStream = null;
let peer = null;
let existingCall = null;

navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function (stream) {
        // Success
        $('#my-video').get(0).srcObject = stream;
        localStream = stream;
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
});

peer.on('close', function(){
});

peer.on('disconnected', function(){
});

$('#make-call').submit(function(e){
    e.preventDefault();

    if(localStream.getVideoTracks().length == 2){
        // 既に２つのトラックが含まれる場合は、2つめのトラック（ScreenShare）を削除
        localStream.removeTrack(localStream.getVideoTracks()[1]);
    }

    // キャンパス情報追加
    var canvasVideo = document.getElementById("synthetic-canvas1");
    var paintStream = canvasVideo.captureStream(25);
    localStream.addTrack(paintStream.getVideoTracks()[0]);

    const call = peer.call($('#callto-id').val(), localStream);
    setupCallEventHandlers(call);
});

$('#end-call').click(function(){
    existingCall.close();
});

peer.on('call', function(call){
    call.answer(localStream);
    setupCallEventHandlers(call);
});

function setupCallEventHandlers(call){
    if (existingCall) {
        existingCall.close();
    };

    existingCall = call;

    call.on('stream', function(stream){
        addVideo(call,stream);
        setupEndCallUI();
        $('#their-id').text(call.remoteId);
    });
    call.on('close', function(){
        removeVideo(call.remoteId);
        setupMakeCallUI();
    });
}

function addVideo(call,stream){
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
    }else{
        $('#their-video').get(0).srcObject = stream;
    }
}

function removeVideo(peerId){
    $('#'+peerId).remove();
}

function setupMakeCallUI(){
    $('#make-call').show();
    $('#end-call').hide();
}

function setupEndCallUI() {
    $('#make-call').hide();
    $('#end-call').show();
}
