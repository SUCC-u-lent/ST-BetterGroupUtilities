import { SlashCommandParser, SlashCommand, SlashCommandNamedArgument } from "../../../slash-commands.js";

export default {
    name: "Macros Module",
    settings: {
        enableMacros_onLoad: true
    },
    cannotBeDisabled: true
}

jQuery(async()=>{
    SlashCommandParser.addCommandObject(
        SlashCommand.fromProps({
            name: "hello",            // `/hello`
            callback: (namedArgs, unnamedArgs) => {
                // namedArgs: object of `--option=value` flags
                // unnamedArgs: remainder string
                return `Hi there ${unnamedArgs || ""}`;
            },
            helpString: "Say hello with optional text",
            aliases: ["hi"],          // `/hi` also works
            // You can define arguments if you need them:
            namedArgumentList: [
                SlashCommandNamedArgument.fromProps({
                    name: "times",
                    description: "How many times to repeat greeting",
                    defaultValue: "1"
                })
            ]
        })
    );
})