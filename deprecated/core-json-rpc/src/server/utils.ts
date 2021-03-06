import { Crypto, Identities, Interfaces, Managers } from "@arkecosystem/crypto";
import wif from "wif";
import { IWallet } from "../interfaces";
import { database } from "./services/database";

export const decryptWIF = (encryptedWif, userId, bip38password): IWallet => {
    const decrypted: Interfaces.IDecryptResult = Crypto.bip38.decrypt(
        encryptedWif.toString("hex"),
        bip38password + userId,
    );

    const encodedWIF: string = wif.encode(
        Managers.configManager.get("network.wif"),
        decrypted.privateKey,
        decrypted.compressed,
    );

    return { keys: Identities.Keys.fromWIF(encodedWIF), wif: encodedWIF };
};

export const getBIP38Wallet = async (userId, bip38password): Promise<IWallet> => {
    const encryptedWif: string = await database.get(Crypto.HashAlgorithms.sha256(Buffer.from(userId)).toString("hex"));

    return encryptedWif ? decryptWIF(encryptedWif, userId, bip38password) : undefined;
};
