import React from 'react';
import { Badge, Table } from 'react-bootstrap';
import dateFormatter from 'date-and-time';
import { downloadFile } from '../actions/index';
import { getFileSize } from '../utils/numberUtils';

const FilesTable = ({ files = [], history }) => (
  <Table striped={true} bordered={false} hover={true} className={'files-table'}>
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th style={{ maxWidth: '20vw' }}>Tags</th>
        <th>Type</th>
        <th>Size</th>
        <th>Last Modified</th>
      </tr>
    </thead>
    <tbody>
      {files.map(({ _id, name, extension, size, updatedOn, tags }) => (
        <tr key={_id} className={'files-table-row'}>
          <td className={'file-actions'}>
            <i
              style={{ cursor: 'pointer', marginRight: '10px' }}
              className={'fas fa-download'}
              onClick={e => {
                e.stopPropagation();
                downloadFile(_id);
              }}
            ></i>
            <i
              style={{ cursor: 'pointer' }}
              className={'fas fa-pencil-alt'}
              onClick={() => history.push(`/editfile/${_id}`)}
            ></i>
          </td>
          <td>{name}</td>
          <td style={{ maxWidth: '20vw' }}>
            {(tags || []).map(tag => (
              <>
                <Badge key={tag} variant={'primary'} style={{ marginRight: '5px' }}>
                  {tag}
                </Badge>
              </>
            ))}
          </td>
          <td>{extension}</td>
          <td>{getFileSize(size)}</td>
          <td>{dateFormatter.format(new Date(updatedOn), 'ddd, MMM DD YYYY')}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default FilesTable;
