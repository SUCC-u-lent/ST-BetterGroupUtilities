import { MacrosParser } from "/scripts/macros.js";

const getMacroValue = () => {
    return "Example Value";
};
jQuery(() => {
    MacrosParser.registerMacro("chargroup", ()=>getMacroValue(), "This macro is replaced by a list of all characters within the group");
});

export default {
    name: "Macros Module",
    settings: {
        enableMacros_onLoad: true
    },
    cannotBeDisabled: true
};
