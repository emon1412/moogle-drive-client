import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';

const createOption = label => ({
  label,
  value: label,
});

class MultiSelectTextInput extends Component {
  constructor(props) {
    super(props);
    console.log(props.value, 'props.value');
    this.state = {
      inputValue: '',
      value: props.value || [],
    };
  }

  handleChange = (value, actionMeta) => {
    this.props.onChange(value, actionMeta);
    this.setState({ value });
  };

  handleInputChange = inputValue => {
    this.setState({ inputValue });
  };

  handleKeyDown = event => {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    if (event.key === 'Enter' || event.key === 'Tab') {
      const newValue = [...value, createOption(inputValue)];
      this.props.onChange(newValue, { action: 'add-value' });
      this.setState({
        inputValue: '',
        value: newValue,
      });
      event.preventDefault();
    }
  };

  render() {
    const { inputValue, value } = this.state;
    const { className, placeholder = 'Type something and press enter...' } = this.props;
    return (
      <CreatableSelect
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        placeholder={placeholder}
        value={value}
        className={className}
      />
    );
  }
}

export default MultiSelectTextInput;
