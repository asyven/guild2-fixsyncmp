const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const ini = require('ini');
const prompts = require('prompts');
const sleep = util.promisify(setTimeout);

const config_file_path = "./config.ini";

var args = process.argv.slice(2);

(async () => {
    console.log("Enabling Fix Mode...");
    let status = await enableFixMode();
    if (!status) {
        console.log("Fix Mode enabling error");
        console.log("Please, move this file to root The Guild 2 Renaissance directory and run again");
    }

    console.log("Fix Mode successfully enabled");

    let result_answer;

    if(args.length < 1){
        result_answer = await prompts([{
            type: 'select',
            name: 'value',
            message: 'How many second u need for fixing?',
            choices: [
                {title: '15 seconds', value: 15000},
                {title: '30 seconds', value: 30000},
                {title: '45 seconds', value: 45000},
                {title: '60 seconds', value: 60000}
            ],
            initial: 1
        }]);
    }else{
        result_answer = {value: args[0] * 1000};
    }

    console.log(`Fixing at ${result_answer.value / 1000} seconds...`);
    await sleep(result_answer.value);


    console.log("Disabling Fix Mode...");
    status = await disableFixMode();
    if (!status) {
        console.log("Fix Mode disabling error");
        process.exit(1);
    }
    console.log("Done! Fix Mode successfully disabled. gl&hf");
    process.exit(1);

})();

async function enableFixMode() {
    try {
        const raw_config = await readFile(config_file_path, 'utf-8');
        const config = ini.parse(raw_config);

        config.NETWORK.UseSyncLogger = 1;
        config.NETWORK.AsyncFatal = 1;

        await writeFile(config_file_path, ini.stringify(config));
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function disableFixMode() {
    try {
        const raw_config = await readFile(config_file_path, 'utf-8');
        const config = ini.parse(raw_config);

        config.NETWORK.UseSyncLogger = 1;
        config.NETWORK.AsyncFatal = 1;

        await writeFile(config_file_path, ini.stringify(config));
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}