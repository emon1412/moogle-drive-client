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
      <div className={cns(className, 'search-text-input-container')}>
        <form onSubmit={this._onSubmit}>
          <InputGroup className={'search-text-input'}>
            <Form.Control
              className={'searchbox'}
              onChange={onChange}
              value={value}
              disabled={disabled}
              placeholder={placeholder}
              rows={1}
              type={'text'}
              name={this.props.name}
            />
            <div
              onClick={value ? this._onClear : this._onSubmit}
              className={'endcap'}
              style={value ? { cursor: 'pointer' } : {}}
            >
              <i className={cns('fas', 'fa-fw', { 'fa-search': !value }, { 'fa-times-circle': value })} />
            </div>
          </InputGroup>
        </form>
      </div>
    );
  }
}

export default SearchTextInput;
