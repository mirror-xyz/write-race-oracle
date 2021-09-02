import MerkleTree from "./merkle-tree";
import { BigNumber, utils } from "ethers";

export default class BalanceTree {
  private readonly tree: MerkleTree;
  constructor(
    balances: {
      address: string;
      index: BigNumber;
    }[]
  ) {
    this.tree = new MerkleTree(
      balances.map(({ address, index }, i) => {
        return BalanceTree.toNode(address, index);
      })
    );
  }

  public static verifyProof(
    address: string,
    index: BigNumber,
    proof: Buffer[],
    root: Buffer
  ): boolean {
    let pair = BalanceTree.toNode(address, index);
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item);
    }

    return pair.equals(root);
  }

  public static toNode(
    address: string,
    index: BigNumber
  ): Buffer {
    return Buffer.from(
      utils
        .solidityKeccak256(
          ["address", "uint256"],
          [address, index]
        )
        .substr(2),
      "hex"
    );
  }

  public getHexRoot(): string {
    return this.tree.getHexRoot();
  }

  // returns the hex bytes32 values of the proof
  public getProof(
    address: string,
    index: BigNumber
  ): string[] {
    return this.tree.getHexProof(
      BalanceTree.toNode(address, index)
    );
  }
}
