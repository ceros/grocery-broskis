import { createBrowserHistory } from 'history';
//
let history = {}

// It's required to keep tests running
if (typeof document !== 'undefined') {
  	history = createBrowserHistory()
}

export { history }
