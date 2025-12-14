import { MacrosParser } from "/scripts/macros.js";
import { getContext } from '/scripts/extensions.js';

const getMacroValue = () => {
    return "Example Value";
};
jQuery(() => {
    const context = getContext();
    console.log(context);
    MacrosParser.registerMacro("chargroup", ()=>getMacroValue(), "This macro is replaced by a list of all characters within the group");
});

export default {
    name: "Macros Module",
    settings: {
        enableMacros_onLoad: true
    },
    cannotBeDisabled: true
};
