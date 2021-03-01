import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import cns from 'classnames';

export default class VerbTable extends PureComponent {
  static propTypes = {
    isStriped: PropTypes.bool,
    isBordered: PropTypes.bool,
    isHover: PropTypes.bool,
    bodyComponent: PropTypes.object,
    headerComponent: PropTypes.object,
    className: PropTypes.string,
    useTableTag: PropTypes.bool,
    children: PropTypes.any,
  };

  render() {
    const {
      isStriped = false,
      isBordered = false,
      isHover = true,
      className,
      headerComponent,
      bodyComponent,
      useTableTag = true,
    } = this.props;

    if (!useTableTag) {
      // custom table made without table tags.
      // TODO: pre-set css for the custom table
      return (
        <div className={cns('verb-table', className, { striped: isStriped, bordered: isBordered })}>
          {headerComponent}
          {this.props.children || bodyComponent}
        </div>
      );
    }
    return (
      <Table striped={isStriped} bordered={isBordered} hover={isHover} className={cns('verb-table', className)}>
        {headerComponent}
        {this.props.children || bodyComponent}
      </Table>
    );
  }
}
