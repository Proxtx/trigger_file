let pathInput = triggerGui.getElementsByClassName("pathInput")[0];

getTriggerConfiguration(() => {
  return {
    text: "New File in " + pathInput.component.value,
    data: {
      path: pathInput.component.value,
    },
  };
});

(async () => {
  if (triggerPresetData) {
    await uiBuilder.ready(pathInput);
    pathInput.component.value = triggerPresetData.path;
  }
})();
