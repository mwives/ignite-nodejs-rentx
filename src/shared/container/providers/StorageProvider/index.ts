import { container } from "tsyringe";

import { LocalStorageProvider } from "./implementations/LocalStorageProvider";
import { S3StorageProvider } from "./implementations/S3StorageProvider";
import { IStorageProvider } from "./IStorageProvider";

let storageProvider:
  | typeof LocalStorageProvider
  | typeof S3StorageProvider
  | null = null;

switch (process.env.STORAGE_PROVIDER) {
  case "local":
    storageProvider = LocalStorageProvider;
    break;
  case "s3":
    storageProvider = S3StorageProvider;
    break;
  default:
    break;
}

if (!storageProvider) {
  throw new Error("Storage provider not specified.");
}

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  storageProvider
);
