import React from 'react';
import Tone from 'tone';
import Slider from './Slider';
import Selector from './Selector';
import Timeline from './Timeline';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    }
    this.ampEnv = new Tone.AmplitudeEnvelope({
      'attack': 0.001,
      'decay': 0.2,
      'sustain': 0.5,
      'release': 1.5
    });
    this.noteLength = 0.5;
    this.filter = new Tone.Filter(800, 'bandpass');
    this.props.audioSource.connect(this.ampEnv);
    this.ampEnv.connect(this.filter);
    this.volume = new Tone.Volume();
    this.filter.connect(this.volume);
    this.volume.toMaster();

    this.part = new Tone.Part(function(time){
      this.ampEnv.triggerAttackRelease(this.noteLength+'s', time);
    }.bind(this), []);
    this.part.start('0:0:0');
  }

  addNote(time) {
    this.part.add(time);
    this.setState(prevState => ({
      notes: [...prevState.notes, time]
    }));
  }

  removeNote(time) {
    this.part.remove(time);
    var newNoteArray = [];
    for(var i = 0; i < this.state.notes.length; i++) {
      if(this.state.notes[i] != time) newNoteArray.push(this.state.notes[i]);
    }
    this.setState({
      notes: newNoteArray
    })
  }

  updateParam(param, value) {
    switch(param) {
      case 'volume':
      this.volume.volume.value = value;
      break;

      case 'frequency':
      this.filter.frequency.value = value;
      break;

      case 'attack':
      value = Math.max(0.0001, value);
      this.ampEnv.attack = value;
      break;

      case 'decay':
      value = Math.max(0.0001, value);
      this.ampEnv.decay = value;
      break;

      case 'sustain':
      this.ampEnv.sustain = value;
      break;

      case 'release':
      value = Math.max(0.0001, value);
      this.ampEnv.release = value;
      break;

      case 'note length':
      value = Math.max(0.001, value);
      this.noteLength = value;
      break;

      case 'filter':
      this.filter.type = value;
      break;
    }
  }

  render() {
    return (
      <div>
        <Timeline onNewNote={this.addNote.bind(this)} onRemoveNote={this.removeNote.bind(this)} notes={this.state.notes} />
        <Slider onChange={this.updateParam.bind(this)} label='volume' min={-24} max={6} />
        <Slider onChange={this.updateParam.bind(this)} label='frequency' min={20} max={10000} />
        <Slider onChange={this.updateParam.bind(this)} label='attack' min={0} max={2} />
        <Slider onChange={this.updateParam.bind(this)} label='decay' min={0} max={2} />
        <Slider onChange={this.updateParam.bind(this)} label='sustain' min={0} max={1} />
        <Slider onChange={this.updateParam.bind(this)} label='release' min={0} max={5} />
        <Slider onChange={this.updateParam.bind(this)} label='note length' min={0} max={2} />
        <Selector onChange={this.updateParam.bind(this)} label='filter' options={['lowpass','bandpass','highpass']} />
      </div>
    );
  }
}

AppComponent.defaultProps = {
  test: 'default'
};

export default AppComponent;