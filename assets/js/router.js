import React from 'react';
import {
    Link, BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import CommitListContainer from './containers/CommitListContainer';
import RepoCreateContainer from './containers/RepoCreateContainer';
import RepoListContainer from './containers/RepoListContainer';

export default (
    <Router>
        <div id="wrapper" className="toggled">
            <div id="sidebar-wrapper" style={{ display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
                <div style={{ padding: '20px', marginBottom: '20px' }}>
                    <ul className="sidebar-nav">
                        <li className="sidebar-brand">
                            <Link to="/">
                                Github Monitor
                            </Link>
                        </li>
                    </ul>
                </div>
                <div style={{ overflowY: 'scroll'}}>
                    <RepoListContainer />
                </div>
            </div>

            <div id="page-content-wrapper">
                <div className="container-fluid">
                    <RepoCreateContainer />
                    <Switch>
                        <Route path="/" exact component={CommitListContainer} />
                    </Switch>
                </div>
            </div>

        </div>
    </Router>
);
