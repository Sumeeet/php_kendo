const getElement = (id) => document.getElementById(id);
const ModuleInstance = function () {
  const mainView = getElement("mainViewId");
  const footerView = getElement("footerId");
  const u = CT.Utils;
  const g = CT.GridUtils;

  function init(url) {
    //const paramLimits = "./Modules/Age/valueProperties.json";
    const transformInfo = {
      ageGridAux: g.gridTransform("ageGridParam", "ageGrid"),
    };

    const vm = new ViewModel();
    const execute = u.asyncCompose(
      vm.bind(mainView, footerView),
      //vm.merge(paramLimits),
      vm.transform(transformInfo),
      vm.init
    );

    execute(url)
      .then((res) => {
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
              vm.getChangedModel()
                .then((response) =>
                  DataProxy().postData(url, {
                    method: "POST",
                    body: JSON.stringify(response),
                  })
                )
                .then((result) => {
                  vm.reset();
                });
            },
          });
        new ViewController(vm);
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
