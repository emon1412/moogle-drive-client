import React, { Component } from 'react';
import cns from 'classnames';
import { Form, InputGroup } from 'react-bootstrap';

class SearchTextInput extends Component {
  _onClear = () => {
    const { value } = this.props;
    if (this.props.onClear) {
      this.props.onClear(value);
    }
  };

  _onSubmit = e => {
    const { onSubmit, value } = this.props;
    e.preventDefault();
    if (onSubmit && !!value) {
      onSubmit();
    }
  };

  render() {
    const { value = '', disabled = false, placeholder, onChange, className = '' } = this.props;

    return (
      <form onSubmit={this._onSubmit} className={'search'}>
        <i
          className={cns('search__icon fas fa-fw', { 'fa-search': !value }, { 'fa-times-circle': value })}
          style={value ? { cursor: 'pointer' } : {}}
          onClick={value ? this._onClear : this._onSubmit}
        />
        <input
          className={'search__input'}
          onChange={onChange}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          type={'text'}
          name={this.props.name}
        />
      </form>
    );
  }
}

export default SearchTextInput;
