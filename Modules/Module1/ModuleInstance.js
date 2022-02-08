const ModuleInstance = function() {
    const undoButton = getElement('undo')
    const redoButton = getElement('redo')
    const loadButton = getElement('load')
    const cacheButton = getElement('cache')
    const applyButton = getElement('apply')
    const history = new History()

    function init(url) {
        //caches.delete('CT_cache');
        const limits_url = "./Modules/Module1/valueProperties.json";
        const viewModel = new ViewModel(url)
        viewModel.init([limits_url])
        .then(result => {
            viewModel.bind(result, mainView, footerView);

            // initialize all the controllers here
            new Controller(viewModel, history)

            undoButton.addEventListener('click', (event) => {
                event.stopPropagation();
                history.playBack()
            }, false);

            redoButton.addEventListener('click', (event) => {
                event.stopPropagation();
                history.playForward()
            }, false);


            loadButton.addEventListener('click', (event) => {
                event.stopPropagation();
                DataProxy().getData(url).then(response => console.log(response));
            }, false);

            cacheButton.addEventListener('click', (event) => {
                event.stopPropagation();
                caches.delete('ct_cache')
            })

            applyButton.addEventListener('click', (event) => {
                event.stopPropagation();
                viewModel.getChangedModel()
                .then(response => DataProxy().postData(url, { method: 'POST', body: JSON.stringify(response) }))
                .then(result => {
                    viewModel.reset();
                });
            })

            // run validations first time
            //viewModel.runValidations()

            $("#tabstrip").kendoTabStrip({
                animation:  {
                    open: {
                        effects: "fadeIn"
                    }
                }
            });
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