// https://docs.gitlab.com/ce/api/README.html#namespaced-path-encoding

function isNumeric(num){
    return !isNaN(num)
}

function encodeGroupProjectPath(projectId) {
    if (isNumeric(projectId)) {
        return projectId;
    }
    const orgNameProjectName = projectId;
    if (orgNameProjectName.includes('%')) {
        return orgNameProjectName
    } else {
        return encodeURIComponent(orgNameProjectName);
    }
}

export { encodeGroupProjectPath };