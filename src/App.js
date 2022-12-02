import { ToastContainer, Zoom } from "react-toastify";
import Routes from "./routes";
import { Provider as ReduxProvider } from "react-redux";
import "./App.css";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import reducers from "./redux/reducers/index";
import "react-toastify/dist/ReactToastify.css";
import AuthContextProvider from "./contexts/AuthContext";
import { compose } from "redux";

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

const middlewares = [reduxThunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStoreWithMiddleware(
  reducers,
  composeEnhancers(applyMiddleware(...middlewares))
);

function App() {
  return (
    <ReduxProvider store={store}>
      <AuthContextProvider>
        <div className="App">
          <Routes />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnHover
            transition={Zoom}
            className="toast-container-custom"
          />
        </div>
      </AuthContextProvider>
    </ReduxProvider>
  );
}

export default App;
