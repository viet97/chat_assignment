import ActionType from './ActionType';

const enableLoading = enable => ({ type: ActionType.ENABLE_LOADING, data: enable });

const SettingAction = {
    enableLoading,
};
export default SettingAction;
