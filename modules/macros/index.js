import {
    SlashCommandParser,
    SlashCommand,
    SlashCommandNamedArgument
} from "/scripts/slash-commands.js";

export default {
    name: "Macros Module",
    settings: {
        enableMacros_onLoad: true
    },
    cannotBeDisabled: true
};

jQuery(() => {
    SlashCommandParser.addCommandObject(
        SlashCommand.fromProps({
            name: "hello",
            helpString: "Say hello with optional text",
            aliases: ["hi"],
            namedArgumentList: [
                SlashCommandNamedArgument.fromProps({
                    name: "times",
                    description: "How many times to repeat greeting",
                    defaultValue: "1"
                })
            ],
            callback: (namedArgs, unnamedArgs) => {
                const times = Number(namedArgs.times ?? 1);
                return Array(times).fill(
                    `Hi there ${unnamedArgs || ""}`
                ).join("\n");
            }
        })
    );
});
