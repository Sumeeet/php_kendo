const getElement = id => document.getElementById(id)
const ModuleInstance = function() {
    const mainView = getElement('mainViewId')
    const footerView = getElement('applyId')

    function init(url) {
        // CT.Utils.LoadTemplates(['./core/templates/grid.tmpl.htm'])
        // .then(result => {
        //     document.body.insertAdjacentHTML('beforeend', result)
        //     const firstTemplate = kendo.template($("#boolean_template").html(), { useWithBlock: false } );
        //     const r = firstTemplate( {checked: true});
        //     //$( "#firstcontainer" ).html( result );
        // })
        // .catch(e => console.log(`There has been a problem with reading the source : ${e.message}`))

        //caches.delete('CT_cache');
        const limits_url = "./Modules/Age/valueProperties.json";
        const viewModel = new ViewModel(url)
        viewModel.init([limits_url])
        .then(result => {

            messageBroker.subscribe('onLoad',
                new EditCommand(this,
                    () => DataProxy().getData(url).then(response => console.log(response)))
            )

            messageBroker.subscribe('onClear',
                new EditCommand(this,
                    () => caches.delete('ct_cache'))
            )

            messageBroker.subscribe('onApply',
                new EditCommand(this,
                    () => {
                        viewModel.getChangedModel()
                        .then(response => DataProxy().postData(url, { method: 'POST', body: JSON.stringify(response) }))
                        .then(result => {
                            viewModel.reset();
                        });
                    })
            )

            viewModel.bind(result, mainView, footerView);

            // initialize all the controllers here
            new ViewController(viewModel)
        })
        .catch(e => console.log(`There has been a problem with reading the source : ${e.message}`))
    }
    return { init }
}

document.onreadystatechange = () => {
    // TODO: Module should or can be initialized from external trigger too
    const url = "./Modules/Age/test-data.json";
    const instance = new ModuleInstance()
    if (document.readyState === 'complete') instance.init(url)
}