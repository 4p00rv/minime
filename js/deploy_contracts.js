const TestRPC = require('ethereumjs-testrpc');
const Web3 = require('web3');
const chai = require('chai');

const MiniMeToken = require('./minimetoken');
const MiniMeTokenFactory = require('./minimetokenfactory');

const tokenDefaults = require('./deployment_config').token_defaults;
const deploymentDefaults = require('./deployment_config').deployment_defaults;

// If testing locally please start the testrpc first.
let web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

/**
 * tokenOptions: Options related to token deployment.
 * deploymentOptions: Testnet address.
**/

function deploy(tokenOptions, deploymentOptions) {
    web3.eth.net.isListening().then((listening) => {
        if(listening) {
            MiniMeTokenFactory.new(web3).then((tokenFactory, ...a) => {
                console.log(tokenFactory, a);
            });
        } else {
            console.error('Please check the Web3 providers');
        }
    });
}

// Check if the script is required in other module or is run in CLI.
if(require.main === module) { // CLI
    deploy();
}

exports.deploy = deploy;
