import ActionType from "./ActionType";

const saveProfile = profile => ({ type: ActionType.SAVE_PROFILE, data: profile })

const UserAction = {
    saveProfile
}
export default UserAction