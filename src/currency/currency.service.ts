import { Injectable } from '@nestjs/common';
import { ethers, Wallet, Contract, ContractFactory } from 'ethers';
require('dotenv').config();

@Injectable()
export class CurrencyService {
  async transferEther(senderPrivateKey: string, recipientAddress: string, amount: Number): Promise<Object> {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545'); // Local Ganache node

    const wallet = new Wallet(senderPrivateKey, provider);

    const transaction = {
      to: recipientAddress,
      value: ethers.parseEther(amount.toString())
    };

    const tx = await wallet.sendTransaction(transaction);
    await tx.wait();
    return tx;
  }

  async setValueInContract(senderPrivateKey: string, value: Number): Promise<void> {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545'); // Local Ganache node

    const wallet = new Wallet(senderPrivateKey, provider);

    //copied from ./build/SimpleStorage.abi
    const abi = [{"constant":false,"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"setValue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]

    //copide from ./build/SimpleStorage.bin
    const bytecode = '0x608060405234801561001057600080fd5b5060ab8061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80633fa4f2451460375780635524107714604f575b600080fd5b603d606b565b60408051918252519081900360200190f35b606960048036036020811015606357600080fd5b50356071565b005b60005481565b60005556fea265627a7a72315820487c74fec0e007be608b5adf044a489cfb32c2c1861892e0c0ea52cc27117e7264736f6c63430005100032'

    const deployedAddress = await this.deployContract(senderPrivateKey, bytecode, abi);
    const contract = new Contract(deployedAddress, abi, wallet); // Use the deployed address

    // Set a value in the contract
    const tx = await contract.setValue(value);
    await tx.wait();
    return tx;
  }

  async deployContract(senderPrivateKey: string, bytecode: string, abi: any): Promise<string> {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545'); // Local Ganache node

    const wallet = new Wallet(senderPrivateKey, provider);

    const factory = new ContractFactory(abi, bytecode, wallet);

    // Deploy the contract
    const contract = await factory.deploy();

    await contract.waitForDeployment();

    return contract.getAddress();
  }
}
