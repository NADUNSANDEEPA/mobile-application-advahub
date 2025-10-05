import Realm from "realm";

/**
 * Initialize Realm with provided schemas
 */
export const openRealm = async (schemas, path = "defaultRealm") => {
  const realm = await Realm.open({
    path,
    schema: schemas,
  });
  return realm;
};

/**
 * Create / Insert data
 */
export const createRecord = (realm, schemaName, data) => {
  let created;
  realm.write(() => {
    created = realm.create(schemaName, data);
  });
  return created;
};

/**
 * Read all records
 */
export const getAllRecords = (realm, schemaName) => {
  return realm.objects(schemaName);
};

/**
 * Update record by id
 */
export const updateRecord = (realm, schemaName, id, updates) => {
  realm.write(() => {
    const obj = realm.objectForPrimaryKey(schemaName, id);
    if (obj) {
      Object.keys(updates).forEach((key) => {
        obj[key] = updates[key];
      });
    }
  });
};

/**
 * Delete record by id
 */
export const deleteRecord = (realm, schemaName, id) => {
  realm.write(() => {
    const obj = realm.objectForPrimaryKey(schemaName, id);
    if (obj) {
      realm.delete(obj);
    }
  });
};

/**
 * Delete all records from schema
 */
export const deleteAllRecords = (realm, schemaName) => {
  realm.write(() => {
    const all = realm.objects(schemaName);
    realm.delete(all);
  });
};
