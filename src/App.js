import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import ManageFiles from './components/ManageFiles';
import AddOrEditFile from './components/AddOrEditFile';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id={'moogle-drive'} className={'container'}>
        <Switch>
          <Redirect path={'/'} exact to={'/files'} />
          <Route exact path={'/files'} component={ManageFiles} />
          <Route exact path={'/editfile/:id'} component={AddOrEditFile} />
          <Route exact path={'/newfile'} component={AddOrEditFile} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
