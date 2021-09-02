
import fs from "fs";
const {accounts} = require("./treeData.json");
import BalanceTree from "./merkle-tree/balance-tree";

async function main() {

    const tree = new BalanceTree(accounts);
    const root = tree.getHexRoot();

    const accountProofs = [];
    for (let i = 0; i < accounts.length; i++) {
        const proofs = tree.getProof(accounts[i].address, accounts[i].index);
        
        accountProofs.push({
            address: accounts[i].address,
            index: accounts[i].index,
            proofs: "[" + proofs.join() + "]",
        });
    }

    const blob = {
        root,
        proofs: accountProofs,
    }

    const path = `${__dirname}/proofs.json`;

    fs.writeFileSync(
      path,
      JSON.stringify(blob, null, 2)
    );

    console.log(`Wrote proofs to: ${path}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
