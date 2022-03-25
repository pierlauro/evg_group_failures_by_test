const minimalist = require('minimist')     // to parse cmd line arguments
const readYaml = require('read-yaml-file') // to read EVG conf file
const request = require('sync-request')    // to perform sync HTTP requests
const {promisify} = require('util')
const sleep = promisify(setTimeout)        // to throttle requests

function printUsage(){
    console.log('Usage: nodejs evg_get_failing_tests.js --patch_id <patch id> [--throttle_ms <millis>]');
}

const argv = minimalist(process.argv.slice(2))
const patch_id = argv.patch_id
if(!patch_id){
    printUsage();
    throw 'Missing required argument patch_id'
}

const throttling_ms = argv.throttle_ms || 2000;

const evgData = readYaml.sync(require('os').homedir() + '/.evergreen.yml');
if(!evgData){
    throw 'The `.evergreen.yml` configuration file is needed in the home directory'
}

const key = evgData.api_key;
const user = evgData.user;

const headers = {
    'User-Agent': 'Mozilla/5.0 (X11 Linux x86_64 rv:91.0) Gecko/20100101 Firefox/91.0',
    'Accept': 'text/html,application/xhtml+xml,application/xmlq=0.9,image/webp,*/*q=0.8',
    'Accept-Language': 'en-US,enq=0.5',
    'Connection': 'keep-alive',
    'Api-Key': key,
    'Api-User': user,
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'DNT': '1',
    'Sec-GPC': '1',
    'Cache-Control': 'max-age=0',
    'TE': 'trailers'
}

function rest(url){
    return JSON.parse(request('GET', url, {headers: headers}).getBody('utf8'))
}

function getFailingTaskIds(){
    const url = 'https://evergreen.mongodb.com/api/rest/v2/versions/' + patch_id + '/annotations'
    const failing_tasks = rest(url)
    // Relevant output format: [ {task_id: 'id'}, ... ]
    return failing_tasks.map(task => task.task_id)
}

function getFailingTestNames(task_id){
    const url = 'https://evergreen.mongodb.com/rest/v2/tasks/' + task_id + '/tests'
    const tests = rest(url)
    // Relevant output format: [ {test_file: 'jstests/something.js'}, ... ]
    const failing_test_names = tests.filter(test => test.status == 'fail').map(test => test.test_file)
    return failing_test_names
}

const failing_tasks_ids = getFailingTaskIds()
const numFailingTasks = failing_tasks_ids.length;

var numProcessedTasks = 1;
const failing_tests = {}

const processFailingTasksWithThrottling = async (millis) => {
    for(const task_id of failing_tasks_ids){
        console.log('Processing failing tasks: ' + numProcessedTasks++ + '/' + numFailingTasks + ' ...')
        const testNames = getFailingTestNames(task_id)
        testNames.forEach(function(name){
            if(!failing_tests[name]){
                failing_tests[name] = [task_id]
            } else {
                failing_tests[name].push(task_id)
            }
        })
        await sleep(millis)
    }

    console.log('\n===========\n')
    Object.keys(failing_tests).forEach(function(test){
        console.log('--- Test: \033[1m' + test + '\033[0m')
        console.log('--- Failed in \033[1m' + failing_tests[test].length + '\033[0m variants/suites:')
        failing_tests[test].forEach(suite => console.log('- ' + suite))
        console.log('\n')
    })
}

processFailingTasksWithThrottling(throttling_ms)
