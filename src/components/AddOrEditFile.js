import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { includes, isEqual } from 'lodash';
import DropzoneFileUpload from './DropzoneFileUpload';
import MultiSelectTextInput from './MultiSelectTextInput';
import { postFile, getFile, putFile } from '../actions/index';
import { getFileSize } from '../utils/numberUtils';

class AddOrEditFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
    };
  }

  componentDidMount() {
    const {
      match: { params },
      getFile,
    } = this.props;
    if (params.id) {
      return getFile({ id: params.id });
    }
    return null;
  }

  _onFileSelect = ({ file, name, type, size }) =>
    new Promise(() => {
      this.setState(() => ({
        file,
        type,
        name,
        size,
      }));
    });

  _onUpload = () => {
    const { file, name, type, tags = [], size } = this.state;
    const { currentFile = {}, putFile, postFile } = this.props;
    this.setState({ isUploading: true });
    const newFile = {
      ...currentFile,
      file,
      name,
      type,
      tags,
      size,
    };

    let submitPromise;

    if (!newFile._id) {
      submitPromise = postFile({
        body: newFile,
      });
    } else if (!isEqual(newFile, currentFile)) {
      submitPromise = putFile({
        id: newFile._id,
        body: newFile,
      });
    } else {
      submitPromise = Promise.resolve();
    }

    return submitPromise.then(() => {
      this.setState({ isUploading: false });
      this.props.history.push('/files');
    });
  };

  onTagsChange = value => {
    this.setState({
      tags: value.map(tag => tag.value),
    });
  };

  render() {
    const { file, name, size, isUploading } = this.state;
    const {
      currentFile,
      match: { path },
      history,
    } = this.props;
    const isNew = includes(path, 'new');
    return (
      <div className={'add-or-edit-file'}>
        <h3>{`${isNew ? 'New' : 'Edit'} File`}</h3>
        {isNew ? (
          <div className={'dropzone-row row'}>
            <DropzoneFileUpload className={'col-12'} onUpload={this._onFileSelect} />
          </div>
        ) : null}
        {!!file && (
          <Alert variant={'primary'} className={'uploaded-file'}>
            <i className={'far fa-file'} />
            {`${name}   -   ${getFileSize(size)}`}
          </Alert>
        )}
        <br />
        <div className={'name-input-row row'}>
          <div className={'col-12'}>
            <Form.Control
              onChange={e => {
                this.setState({
                  name: e.target.value,
                });
              }}
              value={name || currentFile.name}
              disabled={!isNew || !file}
              placeholder={`File's name`}
              rows={'1'}
              type={'text'}
            />
          </div>
        </div>
        <div className={'tags-input-row row'}>
          <MultiSelectTextInput
            value={(currentFile.tags || []).map(tag => ({ label: tag, value: tag }))}
            onChange={this.onTagsChange}
            placeholder={'Add a tag and press enter...'}
            className={'col-12'}
          />
        </div>
        <Button variant={'outline-primary'} onClick={this._onUpload}>
          {isNew ? 'UPLOAD' : 'UPDATE'}
        </Button>
        <Button variant={'light'} onClick={() => history.push('/files')}>
          CANCEL
        </Button>
        {isUploading ? <i class={'fas fa-cog fa-spin'}></i> : null}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    files: { byId },
  } = state;
  const fileId = ownProps.match.params.id;
  const currentFile = fileId ? byId[fileId] : {};
  return {
    currentFile,
  };
};

const mapDispatchToProps = dispatch => ({
  postFile: params => dispatch(postFile(params)),
  getFile: params => dispatch(getFile(params)),
  putFile: params => dispatch(putFile(params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddOrEditFile));
