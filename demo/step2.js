/*
- Go to gitlab: http://127.0.0.1:8090/ and provide the initial password
- log-in
- Go to Settings/Access Tokens: http://127.0.0.1:8090/profile/personal_access_tokens
    - Create an api + read_user token for @root
    - Something like `-x-AyJ-9ULh1JytxMRs9`
    - Paste it below.


- Go to: http://127.0.0.1:8090/admin/application_settings
    - Scroll down to "Outbound requests"
    - Check the checkbox and save.
*/
//
module.exports = {
    gitlabUrl: 'http://127.0.0.1:8090',
    rootAccessToken: 'RogEtsjxizyt6vEDd2bC'
};