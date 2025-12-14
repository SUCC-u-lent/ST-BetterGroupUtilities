const extensionName = "ST-BetterGroupUtilities";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

const ModulePaths = [
    `./modules/macros`,
];

let Modules = [];

async function loadModules() {
    const loaded = await Promise.all(
        ModulePaths.map(path =>
            import(path + '/index.js').then(module => {
                console.log(`Loaded module from ${path}`);
                return module.default;
            })
        )
    );

    Modules = loaded.filter(Boolean);
}


// Helper function to create setting UI elements
function createSettingElement(settingKey, settingValue, module) {
    const container = $('<div class="setting-item"></div>');
    const label = $('<label></label>').text(settingKey);
    
    let input;
    
    // Handle different types of settings
    if (typeof settingValue === 'boolean') {
        input = $('<input type="checkbox">')
            .prop('checked', settingValue)
            .on('change', function() {
                module.settings[settingKey] = $(this).prop('checked');
                // Save settings if module has a save function
                if (module.saveSettings) {
                    module.saveSettings();
                }
            });
    } else if (typeof settingValue === 'number') {
        input = $('<input type="number">')
            .val(settingValue)
            .on('input', function() {
                module.settings[settingKey] = parseFloat($(this).val());
                if (module.saveSettings) {
                    module.saveSettings();
                }
            });
    } else {
        input = $('<input type="text">')
            .val(settingValue)
            .on('input', function() {
                module.settings[settingKey] = $(this).val();
                if (module.saveSettings) {
                    module.saveSettings();
                }
            });
    }
    
    container.append(label).append(input);
    return container;
}

jQuery(async () => {
    await loadModules();

    const settingsHtml = await $.get(`${extensionFolderPath}/mainHtml.html`);
    const $settings = $(settingsHtml);

    $('#extensions_settings').append($settings);
    console.log("Loaded extension settings HTML");

    const moduleContainerTemplate = $settings.find('#module-container-template');

    Modules.forEach(module => {
        module.settings ??= {};

        const moduleContainer = moduleContainerTemplate.clone(true, true);
        moduleContainer.removeAttr('id hidden');

        if (module.name) {
            moduleContainer.find('.inline-drawer-toggle b').text(module.name);
        }

        const contentArea = moduleContainer.find('.inline-drawer-content');

        if (!module.cannotBeDisabled) {
            contentArea.append(createSettingElement('Enabled', true, module));
        }

        Object.entries(module.settings).forEach(([key, value]) => {
            contentArea.append(createSettingElement(key, value, module));
        });

        $settings.append(moduleContainer);
    });
});