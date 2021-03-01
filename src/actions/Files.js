import Config from 'config';
import download from 'downloadjs';
import { MoogleDriveFetch } from '../MoogleDriveFetch';
import { ACTIONS } from '../Constants';
import { buildQueryString } from '../utils/StringUtils';

const postToSignedUrl = ({ file, name = '', type }) => {
  const params = {
    method: 'POST',
    body: {
      name,
      type,
    },
  };
  return MoogleDriveFetch(`${Config.serverUrl}/fileuploadurl`, params)
    .then(uploadURL =>
      fetch(uploadURL, {
        method: 'PUT',
        body: new Blob([file], { type }),
      })
    )
    .catch(err => {
      throw new Error(err);
    });
};

export const getFile = params => {
  const { id } = params;

  return dispatch =>
    MoogleDriveFetch(`${Config.serverUrl}/files/${id}`)
      .then(body => {
        dispatch({
          type: ACTIONS.GET_FILE,
          payload: {
            file: body,
          },
        });
      })
      .catch(err => {
        throw new Error(err);
      });
};

export const postFile = params => {
  const { body } = params;
  const { file, name, type, tags, size } = body;
  return dispatch =>
    postToSignedUrl({ file, name, type, tags, size })
      .then(() =>
        MoogleDriveFetch(`${Config.serverUrl}/filesmetadata`, {
          method: 'POST',
          body: { name, type, tags, size },
        })
      )
      .then(body => {
        dispatch({
          type: ACTIONS.POST_FILE,
          payload: {
            file: body,
          },
        });
        return body;
      })
      .catch(err => {
        throw new Error(err);
      });
};

export const getManyFiles = params => {
  const baseUrl = `${Config.serverUrl}/files`;
  const url = buildQueryString(params, baseUrl);
  return dispatch =>
    MoogleDriveFetch(url)
      .then(body => {
        dispatch({
          type: ACTIONS.GET_MANY_FILES,
          payload: {
            files: body,
          },
        });
        return body;
      })
      .catch(err => {
        throw new Error(err);
      });
};

export const downloadFile = fileId => {
  const params = {
    method: 'POST',
    body: {
      fileId,
    },
  };
  return MoogleDriveFetch(`${Config.serverUrl}/filedownloadurl`, params)
    .then(returnedUrl => download(returnedUrl))
    .catch(err => {
      throw new Error(err);
    });
};

export const putFile = params => {
  const { id, body } = params;
  const url = `${Config.serverUrl}/filesmetadata/${id}`;
  const fetchOptions = {
    method: 'PUT',
    body,
  };
  return dispatch =>
    MoogleDriveFetch(url, fetchOptions)
      .then(response => {
        dispatch({
          type: ACTIONS.PUT_FILE,
          payload: {
            file: response,
          },
        });
        return response;
      })
      .catch(err => {
        throw new Error(err);
      });
};
