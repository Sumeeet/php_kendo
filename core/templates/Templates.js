var CT = CT || {};
CT.Templates = CT.Templates || {};

CT.Templates.getBooleanTemplate = (checked) => `<input type='checkbox' #= ${checked} ? checked = 'checked' : '' # />`

