const getElement = (id) => document.getElementById(id);
const ModuleInstance = function () {
  const mainView = getElement("mainViewId");
  const footerView = getElement("footerId");

  function init(url) {
    //caches.delete('CT_cache');
    //const limits_url = "./Modules/Age/valueProperties.json";
    const viewModel = new ViewModel(url);
    viewModel
      .init([])
      .then((result) => {
        CT.Observable.fromEvent(getElement("loadId"), "click")
          .filter((e) => e.button === MOUSE_BUTTON.left)
          .subscribe({
            next(e) {
              DataProxy()
                .getData(url)
                .then((response) => Log(response));
            },
          });

        CT.Observable.fromEvent(getElement("cacheId"), "click")
          .filter((e) => e.button === MOUSE_BUTTON.left)
          .subscribe({
            next(e) {
              caches.delete("ct_cache");
            },
          });

        CT.Observable.fromEvent(getElement("changeId"), "click")
          .filter((e) => e.button === MOUSE_BUTTON.left)
          .subscribe({
            next(e) {
              viewModel
                .getChangedModel()
                .then((response) =>
                  DataProxy().postData(url, {
                    method: "POST",
                    body: JSON.stringify(response),
                  })
                )
                .then((result) => {
                  viewModel.reset();
                });
            },
          });

        // initialize all the controllers here
        new ViewController(viewModel);

        viewModel.bind(result, mainView, footerView);
      })
      .catch((e) =>
        Log(`There has been a problem with reading the source : ${e.message}`)
      );
  }
  return { init };
};

document.onreadystatechange = () => {
  // TODO: Module should or can be initialized from external trigger too
  const url = "./Modules/Age/test-data.json";
  const instance = new ModuleInstance();
  if (document.readyState === "complete") instance.init(url);
};
