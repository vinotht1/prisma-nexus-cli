const templateType = require("./templateType");
const wizardType = require("./wizardType");
const path = require("path");
const fs = require("fs");
const toSpaceCase = require("to-space-case");
exports.getGeneratorQuestions = function (type, settings, name) {
    let questions;

    switch (type) {
        case wizardType.WIZARD: {
            questions = [
                askType(),
                askName(name),
                askDestination(
                    templateType.APPWITHAUTH,
                    settings.appDestination,
                    true
                )
            ];
            break;
        }

    }

    return questions;
};
function askName(defaultName) {
    return {
        type: "input",
        name: "name",
        message: "What name do you want to use?",
        default: defaultName || "",
        filter(value) {
            return value.trim();
        },
        validate(value) {
            return value.trim().length == 0 ? "No name given" : true;
        }
    };
}
function askType() {
    return {
        type: "list",
        name: "type",
        message: "What do you want to generate ?",
        choices: Object.keys(templateType).map(key => templateType[key])
    };
}
function askCopyDestination(defaultDestination) {
    return {
        type: "input",
        name: "destination",
        message: "destination",
        default: defaultDestination || "."
    };
}

function askDestination(name, defaultDestination, optional = false) {
    return {
        type: "input",
        name: "destination",
        message: "Where do you want to create the " + name + "?",
        default: defaultDestination || "",
        when(answers) {
            return !optional || (optional && answers.type == name);
        },
        validate(input) {
            const destination = path.resolve(input);

            if (!fs.existsSync(destination)) {
                return `path: ${destination} doesn't exist`;
            }
            return true;
        }
    };
}