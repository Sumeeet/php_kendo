const getElement = id => document.getElementById(id)
const ModuleInstance = function() {
    const applyButton = getElement('applyId')
    const cacheButton = getElement('cacheId')
    const loadButton = getElement('loadId')
    const mainView = getElement('mainViewId')
    const footerView = getElement('footerViewId')

    function init(url) {
        //caches.delete('CT_cache');
        const limits_url = "./Modules/Module1/valueProperties.json";
        const viewModel = new ViewModel(url)
        viewModel.init([limits_url])
        .then(result => {
            viewModel.bind(result, mainView, footerView);

            // initialize all the controllers here
            new BmiController(viewModel)
            //new UndoRedoController(viewModel, history)

            applyButton.addEventListener('click', (event) => {
                event.stopPropagation();
                viewModel.getChangedModel()
                .then(response => DataProxy().postData(url, { method: 'POST', body: JSON.stringify(response) }))
                .then(result => {
                    viewModel.reset();
                });
            })

            loadButton.addEventListener('click', (event) => {
                event.stopPropagation();
                DataProxy().getData(url).then(response => console.log(response));
            }, false);

            cacheButton.addEventListener('click', (event) => {
                event.stopPropagation();
                caches.delete('ct_cache')
            })

            // run validations first time
            //viewModel.runValidations()
        })
        .catch(e => console.log(`There has been a problem with reading the source : ${e.message}`))
    }
    return { init }
}

document.onreadystatechange = () => {
    // TODO: Module should or can be initialized from external trigger too
    const url = "./Modules/Module1/test-data.json";
    const instance = new ModuleInstance()
    if (document.readyState === 'complete') instance.init(url)
}