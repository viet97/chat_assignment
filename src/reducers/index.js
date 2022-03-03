import { combineReducers } from 'redux';
import UserReducer from './UserReducer';
import SettingReducer from './SettingReducer';

const rootReducer = combineReducers({
    UserReducer,
    SettingReducer,
});

export default rootReducer;
