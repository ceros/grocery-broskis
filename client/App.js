import React from 'react';
import './app.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import RegistrationForm from "./containers/RegisterUser";
import LoginScreen from "./components/LoginScreen";
import ListCreator from "./containers/CreateList";

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
                <Router>
                    <Switch>
                        <Route path="/signup">
                            <RegistrationForm />
                        </Route>
                        <Route exact path="/">
                            <LoginScreen />
                        </Route>
                        <Route path="/new-list">
                            <ListCreator />
                        </Route>
                    </Switch>
                </Router>
            </section>
        );
    }
}
