import React from 'react';
import EmbossedLabel from './EmbossedLabel';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragHappening: false,
      anchorX: null,
      anchorY: null,
      initDragValue: null,
      value: this.calculateRawValue(this.props.start)
    }
  }

  componentDidMount() {
    this.renderCanvas();
    window.addEventListener('mouseup', this.stopListening.bind(this));
    var self = this;
    function doRender() {
      self.renderCanvas();
      window.requestAnimationFrame(doRender);
    }
    window.requestAnimationFrame(doRender);
    this.props.onChange(this.props.label, this.calculateKnobValue(this.state.value));
  }

  renderCanvas() {
    // outer circle
    var ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(ctx.canvas.width/2,ctx.canvas.width/2,ctx.canvas.width/2,0,2*Math.PI);
    ctx.fill();

    // indicator
    ctx.save();
    ctx.translate(ctx.canvas.width/2,ctx.canvas.width/2);
    ctx.rotate(1.5*Math.PI*this.state.value - 0.75*Math.PI);
    ctx.translate(-ctx.canvas.width/2,-ctx.canvas.width/2);
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.moveTo(ctx.canvas.width/2, ctx.canvas.width/2);
    ctx.lineTo(ctx.canvas.width/2, 0);
    ctx.stroke();
    ctx.restore();

    // inner circle
    ctx.fillStyle = 'silver';
    ctx.beginPath();
    ctx.arc(ctx.canvas.width/2,ctx.canvas.width/2,ctx.canvas.width/3,0,2*Math.PI);
    ctx.fill();
    ctx.fillStyle = 'white';
  }

  startListening(ev) {
    this.setState({
      dragHappening: true
    })
    this.handleMovement = this.handleMovement.bind(this);
    window.addEventListener('mousemove', this.handleMovement);
    this.handleMovement(ev);
  }

  stopListening() {
    window.removeEventListener('mousemove', this.handleMovement);
    this.setState({
      dragHappening: false
    })
  }

  handleMovement(ev) {
    ev.preventDefault();

    var canvasRect = this.refs.canvas.getBoundingClientRect();
    var middle = {
      x: canvasRect.left + this.refs.canvas.width / 2,
      y: canvasRect.top + this.refs.canvas.height / 2
    }
    var newMouseAngle = Math.atan2(ev.clientY - middle.y, ev.clientX - middle.x) - 0.75*Math.PI;
    while(newMouseAngle < 0) newMouseAngle += 2 * Math.PI;
    if(newMouseAngle > 1.75 * Math.PI) newMouseAngle -= 2 * Math.PI;
    var newValue = Math.max(0, Math.min(1, (newMouseAngle) / (1.5 * Math.PI)));
    this.props.onChange(this.props.label, this.calculateKnobValue(newValue));
    this.setState({
      value: newValue
    })
  }

  calculateKnobValue(raw) {
    return this.props.min + (this.props.max-this.props.min) * raw;
  }

  calculateRawValue(knobValue) {
    return (knobValue - this.props.min) / (this.props.max - this.props.min);
  }

  reset() {
    this.setState({
      value: this.calculateRawValue(this.props.start)
    })
  }

  render() {
    var knobSize = 60;
    return (
      <div className='knob'>
        <canvas
          ref='canvas'
          width={knobSize}
          height={knobSize}
          onMouseDown={this.startListening.bind(this)}
          onDoubleClick={this.reset.bind(this)}
        ></canvas><br/>
        <EmbossedLabel info={this.props.info}>{this.props.label}</EmbossedLabel>
      </div>
    );
  }
}

AppComponent.defaultProps = {
  onChange: function(){},
  label: 'something',
  min: 0,
  max: 1,
  start: 0
};

export default AppComponent;
