<!DOCTYPE html>
<html>
<head lang="ja">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>SkyWay JS SDK Tutorial</title>
    <link rel="stylesheet" href="style.css">
</head>
<div class="pure-g">

    <!-- Video area -->
    <div class="pure-u-2-3" id="video-container">
        <div class="canvas-wrapper" id="their-canvas">
            <video hidden id="their-video" autoplay></video>
            <canvas id="synthetic-canvas1">お使いのブラウザはHTML5のCanvas要素に対応していません。</canvas>
            <canvas id="synthetic-canvas2">お使いのブラウザはHTML5のCanvas要素に対応していません。</canvas>
        </div>
        <ul>
            <li style="background-color:#000"></li>
            <li style="background-color:#f00"></li>
            <li style="background-color:#0f0"></li>
            <li style="background-color:#00f"></li>
            <li style="background-color:#ff0"></li>
            <li style="background-color:#fff"></li>
            </ul>
            <div id="button">
            <input type="button" id="save" value="保存" />
            <input type="button" id="clear" value="消去" />
            </div>
        <video id="my-video" muted="true" autoplay></video>
    </div>

    <!-- Steps -->
    <div class="pure-u-1-3">
        <h2>SkyWay Video Chat</h2>

        <p>Your id: <span id="my-id">...</span></p>
        <p>Share this id with others so they can call you.</p>
        <h3>Make a call</h3>
        <form id="make-call" class="pure-form">
            <input type="text" placeholder="Call user id..." id="callto-id">
            <button href="#" class="pure-button pure-button-success" type="submit">Call</button>
        </form>
        <form id="end-call" class="pure-form">
            <p>Currently in call with <span id="their-id">...</span></p>
            <button href="#" class="pure-button pure-button-success" type="submit">End Call</button
        </form>
    </div>
</div>
<script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="https://cdn.webrtc.ecl.ntt.com/skyway-latest.js"></script>
<script type="text/javascript" src="script.js"></script>
</html>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>

<script type="text/javascript">
$(function() {
    var startX;
    var startY;
    var flag = false;
    var video = document.getElementById("their-video");
    var canvasVideo = document.getElementById("synthetic-canvas1");
    var canvasPaint = document.getElementById("synthetic-canvas2");

    // Canvasのサイズを揃える
    canvasPaint.width = canvasVideo.width;
    canvasPaint.height = canvasVideo.height;

    var contextPaint = canvasPaint.getContext('2d');
    var contextVideo = canvasVideo.getContext('2d');

    //描画処理
    draw();
    
    $('#their-canvas').mousedown(function(e) {
        flag = true;
        var raitoX = canvasVideo.width/canvasVideo.clientWidth;
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
        contextPaint.clearRect(0, 0, $('#their-canvas').width(), $('#their-canvas').height());
        contextVideo.clearRect(0, 0, $('#their-canvas').width(), $('#their-canvas').height());
        // 描画
        draw();
    });
 
    $('#save').click(function() {
        var d = canvasVideo.toDataURL('image/png');
        d = d.replace('image/png', 'image/octet-stream');
        window.open(d, 'save');
    });

    function draw(){
        // ビデオの内容をクリア
        //displayContext.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
        contextVideo.clearRect(0, 0, canvasVideo.width, canvasVideo.height);

        //video2の加工
        if (video != null){
            contextVideo.drawImage(video, 0, 0, canvasVideo.width, canvasVideo.height);
        }

        //描画の加工
        //displayContext.drawImage(displayCanvas, 0, 0, displayCanvas.width, displayCanvas.height);

        //重ね合わせ
        contextVideo.drawImage(canvasPaint,0,0)

        //次フレームの描画時に処理を呼び出す
        requestAnimationFrame(draw);
    };
});
</script>
