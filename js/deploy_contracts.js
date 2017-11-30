const TestRPC = require('ethereumjs-testrpc');
const Web3 = require('web3');
const chai = require('chai');

const MiniMeToken = require('./minimetoken');
const MiniMeTokenFactory = require('./minimetokenfactory');

const tokenDefaults = require('./config').token_defaults;
const deploymentDefaults = require('./config').deployment_defaults;

/*
 * Async function used for deploying contracts.
 * On resolve returns an array of the contract address for TokenFactory and Token respectively.
 * tokenOptions: Options related to token deployment.
 * deploymentOptions: Testnet address.
 */
function deploy(tokenOptions, deploymentOptions) {
    deploymentOptions = Object.assign(deploymentDefaults, deploymentOptions);
    tokenOptions = Object.assign(tokenDefaults, tokenOptions);

    // If testing locally please start the testrpc first.
    // For Mist enabled browsers Web3.givenProvider will point to the current Ether network in use.
    let web3 = new Web3(Web3.givenProvider || deploymentOptions.testnet);

    return new Promise((resolve, reject) => {
        web3.eth.net.isListening().then((listening) => {
            if(listening) {
                MiniMeTokenFactory.new(web3).then((tokenFactory) => {
                    const tokenFactoryAddress = tokenFactory.$address;
                    MiniMeToken.new(web3, tokenFactoryAddress,
                        tokenOptions.parentToken, tokenOptions.parentSnapShotBlock,
                        tokenOptions.tokenName, tokenOptions.decimalUnits,
                        tokenOptions.tokenSymbol, tokenOptions.transfersEnabled
                    ).then((token) => {
                        resolve([tokenFactoryAddress, token.$address]);
                    })
                });
            } else {
                console.error('Please check the Web3 providers');
            }
        });
    });
}

exports.deploy = deploy;
