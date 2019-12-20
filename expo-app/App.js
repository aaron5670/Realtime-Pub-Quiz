import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import {mapping, light, dark} from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import AppNavigator from "./src/AppNavigator";
import combineReducers from './src/redux/Reducer';

const store = createStore(combineReducers);

const App = () => (
    <Provider store={store}>
        <React.Fragment>
            <IconRegistry icons={EvaIconsPack}/>
            <ApplicationProvider mapping={mapping} theme={dark}>
                <AppNavigator/>
            </ApplicationProvider>
        </React.Fragment>
    </Provider>
);

export default App;
