const DB_NAME = "mantouji-db";
const DB_VERSION = 1;
const STORE = "coopRegistrationProofs";

type StoredProof = {
  blob: Blob;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed"));
  });
}

function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const store = tx.objectStore(STORE);
        const req = fn(store);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error("IndexedDB request failed"));
        tx.oncomplete = () => db.close();
        tx.onerror = () => {
          db.close();
          reject(tx.error ?? new Error("IndexedDB transaction failed"));
        };
      })
  );
}

export function buildProofStorageKey(requestId: string, docId: string) {
  return `coopReg:${requestId}:${docId}`;
}

export async function putProofBlob(
  storageKey: string,
  file: File
): Promise<void> {
  const value: StoredProof = {
    blob: file,
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
  };
  await withStore("readwrite", (s) => s.put(value, storageKey));
}

export async function getProofBlob(storageKey: string): Promise<StoredProof | null> {
  const result = await withStore<StoredProof | undefined>("readonly", (s) =>
    s.get(storageKey)
  );
  return result ?? null;
}

export async function deleteProofBlob(storageKey: string): Promise<void> {
  await withStore("readwrite", (s) => s.delete(storageKey));
}

