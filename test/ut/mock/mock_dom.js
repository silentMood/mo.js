module.exports = '\
		<div id="app" main="scene1"></div>\
    <script type="text/template" scene="scene1">\
      <div class="scene" d-AnimationController="" d-EnterAnimation="0/fade-enter" d-go="scene2">\
        <p d-EnterAnimation="1/fade-enter" d-LeftAnimation="5/fade-left">scene1</p>\
        <p d-EnterAnimation="2/fade-enter" d-LeftAnimation="4/fade-left">scene2</p>\
        <p d-EnterAnimation="3/fade-enter" d-LeftAnimation="3/fade-left">scene3</p>\
        <p d-EnterAnimation="4/fade-enter" d-LeftAnimation="2/fade-left">scene4</p>\
        <p d-EnterAnimation="5/fade-enter" d-LeftAnimation="1/fade-left">scene5</p>\
      </div>\
    </script>\
    <script type="text/template" scene="scene2">\
      <div class="scene" d-AnimationController="" d-EnterAnimation="0/fade-enter" d-go="scene1">\
        <p d-EnterAnimation="1/fade-enter" d-LeftAnimation="5/fade-left">scene6</p>\
        <p d-EnterAnimation="2/fade-enter" d-LeftAnimation="4/fade-left">scene7</p>\
        <p d-EnterAnimation="3/fade-enter" d-LeftAnimation="3/fade-left">scene8</p>\
        <p d-EnterAnimation="4/fade-enter" d-LeftAnimation="2/fade-left">scene9</p>\
        <p d-EnterAnimation="5/fade-enter" d-LeftAnimation="1/fade-left">scene10</p>\
      </div>\
    </script>';