const extensionName = "st-extension-example";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

var ModulePaths = [
    `${extensionFolderPath}/modules/macros/index.js`,
]
var Modules = [];
// Modules each require an index.js file that exports their public API
ModulePaths.forEach(path => {
    import(path + '/index.js').then(module => {
        Modules.push(module);
        console.log(`Loaded module from ${path}`);
    });
});

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

jQuery(async ()=>{
    const settingsHtml = await $.get(`${extensionFolderPath}/mainHtml.html`);
    $('#extension-settings').append(settingsHtml);
    const moduleContainerTemplate = $(settingsHtml).find('#module-container-template')
    
    Modules.forEach(module=>{
        if (module.settings == undefined){
            console.warn(`Module ${module.name} has no settings defined.`);
            return;
        }
        // Clone the template for this module
        const moduleContainer = moduleContainerTemplate.clone(true, true);
        moduleContainer.removeAttr('id'); // Remove template id
        moduleContainer.removeAttr('hidden'); // Make it visible
        
        // Set module title if provided
        if (module.name) {
            moduleContainer.find('.inline-drawer-toggle b').text(module.name);
        }
        
        const contentArea = moduleContainer.find('.inline-drawer-content');
        
        // Generate settings UI for each setting
        Object.keys(module.settings).forEach(settingKey => {
            const settingValue = module.settings[settingKey];
            const settingElement = createSettingElement(settingKey, settingValue, module);
            contentArea.append(settingElement);
        });
        
        // Append the module container to the main settings
        $('#extension-settings').append(moduleContainer);
    })
})