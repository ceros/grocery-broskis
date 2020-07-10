import React from 'react';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import {history} from './helpers/history.js';
import usersReducer from './reducers/users.js';
import {PrivateRoute} from './components/PrivateRoute.js';
import RegisterUser from './containers/RegisterUser.js';
import LoginUser from './containers/LoginUser.js';
import './app.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import LandingScreen from "./components/LandingScreen";
import WelcomeScreen from "./containers/WelcomeScreen";
import ListCreator from "./containers/CreateList";
import AvailableLists from "./containers/AvailableLists";
import Header from "./containers/Header";
import ShowList from "./containers/ShowList";

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
            <section className="app blue">
                    <Header />
                    <Router history={history}>
						<Route exact path="/" component={LandingScreen} />
						<PrivateRoute exact path="/shop-list/:id" component={ShowList} />
						<PrivateRoute exact path="/new-list" component={ListCreator} />
                        <PrivateRoute exact path="/lists" component={AvailableLists} />
                        <Route path="/signup">
                        	<RegisterUser />
                        <PrivateRoute path="/welcome" component={WelcomeScreen}/>
                        </Route>
                        <Route exact path="/login">
                             <LoginUser />
                        </Route>
                    
                </Router>
            </section>
        );
    }
}
