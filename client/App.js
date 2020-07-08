import React from 'react';
import {Router, Route} from "react-router-dom";
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import {history} from './helpers/history.js';
import usersReducer from './reducers/users.js';
import {PrivateRoute} from './components/PrivateRoute.js';
import RegisterUser from './containers/RegisterUser.js';
import SamplePage from './containers/SamplePage.js';
import LoginUser from './containers/LoginUser.js';
import './app.css';

const middlewares = [thunk];
createStore(usersReducer, applyMiddleware(...middlewares));
/**
 * App component acts as the root for the component tree, loading the layout and all other
 * components.
 *
 * Usage:
 * ```
 * <App />
 * ```
 */
export default class App extends React.Component {

    /**
     * Takes no props.
     */
    constructor(props) {
        super(props);
    }

    /**
     * Render the header, navigation.
     */
    render() {
        return (
            <section className="app">
                <header>
                    <h1>Grocery</h1>
                    	<Router history={history}>
							<PrivateRoute exact path="/" component={SamplePage} />
                            <Route path="/register">
                                <RegisterUser />
                            </Route>
                            <Route exact path="/login">
                                <LoginUser />
                            </Route>
                    </Router>        
                </header>
            </section>
        );
    }
}
