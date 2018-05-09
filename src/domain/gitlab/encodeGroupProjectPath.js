// https://docs.gitlab.com/ce/api/README.html#namespaced-path-encoding

function encodeGroupProjectPath(orgNameProjectName) {
    if (orgNameProjectName.includes('%')) {
        return orgNameProjectName
    } else {
        return encodeURIComponent(orgNameProjectName);
    }
}

module.exports = encodeGroupProjectPath;