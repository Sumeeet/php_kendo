var CT = CT || {};
CT.Templates = CT.Templates || {};

CT.Templates.getBooleanTemplate = (checked) => {
    if(checked) return "<input type='checkbox' checked = 'checked'/>"
    return "<input type='checkbox'/>"
}


