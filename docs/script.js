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
            <video hidden id="their-video" playsinline autoplay></video>
            <canvas id="synthetic-canvas1">お使いのブラウザはHTML5のCanvas要素に対応していません。</canvas>
            <canvas id="synthetic-canvas2">お使いのブラウザはHTML5のCanvas要素に対応していません。</canvas>
        </div>
        <audio id="their-audio" autoplay></audio>
        <div class="paint-wrapper" id="paint-group1">
            <ul>
                <li style="background-color:#000"></li>
                <li style="background-color:#f00"></li>
                <li style="background-color:#0f0"></li>
                <li style="background-color:#00f"></li>
                <li style="background-color:#ff0"></li>
                <li style="background-color:#fff"></li>
            </ul>
        </div>
        <div id="button">
            <input type="button" id="save" value="保存" />
            <input type="button" id="clear" value="消去" />
        </div> 
        <video id="my-video" muted playsinline autoplay></video>
        <audio id="my-audio" autoplay></audio>
    </div>

    <!-- Steps -->
    <div class="pure-u-1-3">
        <h2>SkyWay Video Chat<br>(ペイント機能追加)</h2>

        <p>Your id: <span id="my-id">...</span></p>
        <p>本IDを連絡相手に通知することで、<br>連絡相手と通話できます。</p>
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
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
</html>
