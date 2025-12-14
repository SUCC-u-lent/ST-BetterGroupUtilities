const extensionName = "ST-BetterGroupUtilities";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

const ModulePaths = [
    "./modules/macros",
];

let Modules = [];

/* ---------------------------
   Module loading
---------------------------- */
async function loadModules() {
    Modules = (await Promise.all(
        ModulePaths.map(async path => {
            try {
                const mod = await import(`${path}/index.js`);
                console.log(`Loaded module from ${path}`);
                return mod.default;
            } catch (err) {
                console.error(`Failed to load module at ${path}`, err);
                return null;
            }
        })
    )).filter(Boolean);
}

/* ---------------------------
   Setting UI helper
---------------------------- */
function createSettingElement(key, value, module) {
    const $container = $('<div class="setting-item"></div>');
    const $label = $('<label></label>').text(key);
    let $input;

    if (typeof value === "boolean") {
        $input = $('<input type="checkbox">')
            .prop("checked", value)
            .on("change", function () {
                module.settings[key] = this.checked;
                module.saveSettings?.();
            });

    } else if (typeof value === "number") {
        $input = $('<input type="number">')
            .val(value)
            .on("input", function () {
                module.settings[key] = Number(this.value);
                module.saveSettings?.();
            });

    } else {
        $input = $('<input type="text">')
            .val(value)
            .on("input", function () {
                module.settings[key] = this.value;
                module.saveSettings?.();
            });
    }

    return $container.append($label, $input);
}

/* ---------------------------
   Init
---------------------------- */
jQuery(async () => {
    await loadModules();

    // Create ONE live DOM tree from the HTML
    const $settingsRoot = $(await $.get(
        `${extensionFolderPath}/mainHtml.html`
    ));

    // Attach extension settings
    $("#extensions_settings").append($settingsRoot);
    console.log("Loaded extension settings HTML");

    // Target the drawer content of "Better Group Utilities"
    const $modulesParent =
        $settingsRoot
            .find(".inline-drawer > .inline-drawer-content")
            .first();

    // Template lives INSIDE the parent content
    const $template =
        $modulesParent.find("#module-container-template");

    Modules.forEach(module => {
        module.settings ??= {};

        const $moduleDrawer =
            $template.clone(true)
                .removeAttr("id hidden");

        if (module.name) {
            $moduleDrawer
                .find(".inline-drawer-toggle b")
                .text(module.name);
        }

        const $content =
            $moduleDrawer.find(".inline-drawer-content");

        if (!module.cannotBeDisabled) {
            $content.append(
                createSettingElement("Enabled", true, module)
            );
        }

        for (const [key, value] of Object.entries(module.settings)) {
            $content.append(
                createSettingElement(key, value, module)
            );
        }

        // ✅ Correct nesting
        $modulesParent.append($moduleDrawer);
    });

    // Remove template so it cannot leak into UI
    $template.remove();
});
