import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cns from 'classnames';
import Dropzone from 'react-dropzone';

class DropzoneFileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previews: [],
      error: false,
    };
  }

  static propTypes = {
    onUpload: PropTypes.func,
    className: PropTypes.string,
    accept: PropTypes.string,
    text: PropTypes.string,
    dropzoneClass: PropTypes.string,
  };

  handleChange = ([newFile]) => {
    const newPreviews = [];
    newPreviews.push({
      name: newFile.name,
      preview: newFile.preview,
    });
    const reader = new FileReader();
    reader.readAsArrayBuffer(newFile);
    reader.onloadend = () => {
      const file = reader.result;
      const param = {
        file,
        name: newFile.name,
        size: newFile.size,
        type: newFile.type,
      };
      return this.props.onUpload(param).catch(err => {
        console.log(err);
        this.setState(() => ({
          error: true,
        }));
      });
    };
  };

  render() {
    const {
      className,
      dropzoneClass,
      text = 'Drop or upload a file',
      accept = 'image/*, application/vnd.ms-powerpoint, application/pdf, application/vnd.ms-excel, application/msword, text/plain, video/mp4, video/x-m4v, video/*, audio/mp3, audio/*',
    } = this.props;
    const { error } = this.state;

    return (
      <div className={className}>
        <Dropzone
          multiple={false}
          className={cns('dropzone-upload', dropzoneClass)}
          onDrop={this.handleChange}
          accept={accept}
        >
          {error ? 'There seems to have been an issue uploading your files' : text}
        </Dropzone>
      </div>
    );
  }
}

export default DropzoneFileUpload;
