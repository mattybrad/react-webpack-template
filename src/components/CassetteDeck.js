import React from 'react';

var cassetteReference = require('../images/cassette.jpg');

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext('2d');
    var self = this;
    function doRender() {
      self.renderCanvas();
      window.requestAnimationFrame(doRender);
    }
    this.refImg = new Image();
    this.refImg.src = cassetteReference;
    window.requestAnimationFrame(doRender);
  }

  renderCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.width);
    this.ctx.save();
    //this.drawMechanism();
    // N.B. ideal cassette aspect ratio is 1.6
    var cassetteWidth = 0.8 * this.ctx.canvas.width;
    this.drawCassette((this.ctx.canvas.width - cassetteWidth)/2, 0.1 * this.ctx.canvas.height, cassetteWidth, cassetteWidth / 1.6);
    this.ctx.globalAlpha = 0;
    this.ctx.drawImage(this.refImg, 0, 0);
    this.ctx.restore();
    this.drawCover();
  }

  drawMechanism() {
    this.ctx.fillStyle = 'silver';
    this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
  }

  drawCover() {
    this.ctx.fillStyle = 'rgba(32,32,32,0.7)';
    this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
  }

  drawCassette(x, y, w, h) {
    this.ctx.lineWidth = Math.ceil(w/200);

    var spoolOffset = {x:0.29*w,y:0.45*h};
    var spoolRadius = 0.06 * w;
    this.drawSpool(x+spoolOffset.x,y+spoolOffset.y,spoolRadius,0.2*h);
    this.drawSpool(x+w-spoolOffset.x,y+spoolOffset.y,spoolRadius,0.3*h);

    this.ctx.fillStyle = 'rgba(128,128,128,0.5)';
    this.ctx.strokeStyle = 'rgba(192,192,192,0.8)';

    this.drawRoundedRect(this.ctx, x, y, w, h, w/50);
    this.ctx.stroke();
    this.ctx.fill();

    var indentOffset = {x:0.056*w, y: 0.077*h};
    this.drawRoundedRect(this.ctx, x+indentOffset.x, y+indentOffset.y, w-indentOffset.x*2, 0.63*h, w/50);
    this.ctx.stroke();

    var centreOffset1 = {x:0.2*w, y:0.31*h};
    this.drawRoundedRect(this.ctx, x+centreOffset1.x, y+centreOffset1.y, w-centreOffset1.x*2, 0.26*h, w/100);
    this.ctx.stroke();

    var centreOffset2 = {x:0.38*w, y:0.35*h};
    this.drawRoundedRect(this.ctx, x+centreOffset2.x, y+centreOffset2.y, w-centreOffset2.x*2, 0.18*h, w/100);
    this.ctx.stroke();

    var trapezoid = {x:0.15*w,y:0.76*h,x2:0.19*w};
    this.ctx.beginPath();
    this.ctx.moveTo(x+trapezoid.x, y+h);
    this.ctx.lineTo(x+trapezoid.x2, y+trapezoid.y);
    this.ctx.lineTo(x+w-trapezoid.x2, y+trapezoid.y);
    this.ctx.lineTo(x+w-trapezoid.x, y+h);
    this.ctx.stroke();

    //var circles = [];
  }

  drawRoundedRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y,   x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x,   y+h, r);
    ctx.arcTo(x,   y+h, x,   y,   r);
    ctx.arcTo(x,   y,   x+w, y,   r);
    ctx.closePath();
  }

  drawSpool(x, y, r, r2) {
    var tapeRadius = r2;
    var outerRadius = r;
    var innerRadius = 0.8*r;
    var spikeLength = 0.2*r;
    var spikeHeight = 0.2*r;
    var spikeOverlap = (outerRadius - innerRadius) / 2;

    this.ctx.beginPath();
    this.ctx.arc(x, y, tapeRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#000';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(x, y, outerRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#FFF';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(x, y, innerRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#333';
    this.ctx.fill();

    this.ctx.fillStyle = '#FFF';
    this.ctx.save();
    var initAngle = (Date.now() / 1000) % (2 * Math.PI);
    for(var i = 0; i < 6; i ++) {
      this.ctx.translate(x, y);
      this.ctx.rotate(2 * Math.PI / 6 + (i == 0 ? initAngle : 0));
      this.ctx.translate(-x, -y);
      this.ctx.fillRect(x-innerRadius-spikeOverlap, y-spikeHeight / 2, spikeLength+spikeOverlap, spikeHeight);
    }
    this.ctx.restore();
  }

  render() {
    return (
      <div className='cassetteDeck'>
        <canvas ref='canvas' width={400} height={250}></canvas>
      </div>
    );
  }
}

AppComponent.defaultProps = {

};

export default AppComponent;
