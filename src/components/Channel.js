import React from 'react';
import Tone from 'tone';
import Slider from './Slider';
import Selector from './Selector';
import Timeline from './Timeline';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div>
        {'Channel ' + this.props.test}
        <Slider label='frequency' min={20} max={10000} />
        <Slider label='attack' min={0} max={2} />
        <Slider label='decay' min={0} max={2} />
        <Slider label='sustain' min={0} max={1} />
        <Slider label='release' min={0} max={5} />
        <Selector label='filter' options={['LPF','BPF','HPF']} />
        <Timeline />
      </div>
    );
  }
}

AppComponent.defaultProps = {
  test: 'default'
};

export default AppComponent;
