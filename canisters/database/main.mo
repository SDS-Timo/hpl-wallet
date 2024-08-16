import AssocList "mo:base/AssocList";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Vector "mo:vector";

import DB "db";

actor class WalletDatabase() {

  type StableStorage<Asset, Contact, Allowance, HplSubaccount, HplVirtual, HplAsset, HplCount, HplContact, Service> = AssocList.AssocList<Principal, (DB.DbInit<Asset, Text>, DB.DbInit<Contact, Text>, DB.DbInit<Allowance, Text>, DB.DbInit<HplSubaccount, Text>, DB.DbInit<HplVirtual, Text>, DB.DbInit<HplAsset, Text>, DB.DbInit<HplCount, Text>, DB.DbInit<HplContact, Text>, DB.DbInit<Service, Text>)>;

  type AssetDocument_v0 = {
    sortIndex : Nat32;
    updatedAt : Nat32;
    deleted : Bool;
    address : Text;
    symbol : Text;
    name : Text;
    tokenName : Text;
    tokenSymbol : Text;
    decimal : Text;
    shortDecimal : Text;
    subAccounts : [{
      name : Text;
      sub_account_id : Text;
      address : Text;
      amount : Text;
      currency_amount : Text;
      transaction_fee : Text;
      decimal : Nat32;
      symbol : Text;
    }];
    index : Text;
    logo : Text;
    supportedStandards : [Text];
  };

  type ContactDocument_v0 = {
    name : Text;
    principal : Text;
    accountIdentifier : Text;
    accounts : [{
      name : Text;
      subaccount : Text;
      subaccountId : Text;
      tokenSymbol : Text;
    }];
    updatedAt : Nat32;
    deleted : Bool;
  };

  type AllowanceDocument_v0 = {
    asset : {
      logo : Text;
      name : Text;
      symbol : Text;
      address : Text;
      decimal : Text;
      tokenName : Text;
      tokenSymbol : Text;
      supportedStandards : [Text];
    };
    id : Text;
    subAccountId : Text;
    spender : Text;
    updatedAt : Nat32;
    deleted : Bool;
  };

<<<<<<< HEAD
  type HplSubAccountDocument_v0 = {
    id : Text;
    name : Text;
    ftId : Text;
    ledger : Text;
    updatedAt : Nat32;
    deleted : Bool;
  };

  type HplVirtualDocument_v0 = {
    id : Text;
    name : Text;
    ftId : Text;
    accesBy : Text;
    isMint : Bool;
    updatedAt : Nat32;
    ledger : Text;
    deleted : Bool;
  };

  type HplAssetDocument_v0 = {
    id : Text;
    name : Text;
    symbol : Text;
    controller : Text;
    decimals : Text;
    description : Text;
    updatedAt : Nat32;
    ledger : Text;
    deleted : Bool;
  };

  type HplCountDocument_v0 = {
    nFtAssets : Text;
    nVirtualAccounts : Text;
    nAccounts : Text;
    updatedAt : Nat32;
    principal : Text;
    ledger : Text;
    deleted : Bool;
  };

  type HplContactDocument_v0 = {
    principal : Text;
    name : Text;
    remotes : [{
      name : Text;
      index : Text;
      status : Text;
      expired : Text;
      amount : Text;
      ftIndex : Text;
      code : Text;
    }];
    updatedAt : Nat32;
    ledger : Text;
    deleted : Bool;
  };
=======
>>>>>>> icrc1-new-features
  type ServiceDocument_v0 = {
    name : Text;
    principal : Text;
    assets : [{
      tokenSymbol : Text;
      logo : Text;
      tokenName : Text;
      decimal : Text;
      shortDecimal : Text;
      principal : Text;
    }];
    updatedAt : Nat32;
    deleted : Bool;
  };

<<<<<<< HEAD
  stable var storage_v0 : StableStorage<AssetDocument_v0, ContactDocument_v0, AllowanceDocument_v0, HplSubAccountDocument_v0, HplVirtualDocument_v0, HplAssetDocument_v0, HplCountDocument_v0, HplContactDocument_v0, ServiceDocument_v0> = null;
=======
  stable var storage_v0 : StableStorage<AssetDocument_v0, ContactDocument_v0, AllowanceDocument_v0, ServiceDocument_v0> = null;
>>>>>>> icrc1-new-features

  type AssetDocument = AssetDocument_v0;
  type ContactDocument = ContactDocument_v0;
  type AllowanceDocument = AllowanceDocument_v0;
<<<<<<< HEAD
  type HplSubAccountDocument = HplSubAccountDocument_v0;
  type HplVirtualDocument = HplVirtualDocument_v0;
  type HplAssetDocument = HplAssetDocument_v0;
  type HplCountDocument = HplCountDocument_v0;
  type HplContactDocument = HplContactDocument_v0;
  type ServiceDocument = ServiceDocument_v0;

  var databasesCache : AssocList.AssocList<Principal, (DB.DbUse<AssetDocument, Text>, DB.DbUse<ContactDocument, Text>, DB.DbUse<AllowanceDocument, Text>, DB.DbUse<HplSubAccountDocument, Text>, DB.DbUse<HplVirtualDocument, Text>, DB.DbUse<HplAssetDocument, Text>, DB.DbUse<HplCountDocument, Text>, DB.DbUse<HplContactDocument, Text>, DB.DbUse<ServiceDocument, Text>)> = null;

  private func getDatabase(owner : Principal, notFoundStrategy : { #create; #returnNull }) : ?(DB.DbUse<AssetDocument, Text>, DB.DbUse<ContactDocument, Text>, DB.DbUse<AllowanceDocument, Text>, DB.DbUse<HplSubAccountDocument, Text>, DB.DbUse<HplVirtualDocument, Text>, DB.DbUse<HplAssetDocument, Text>, DB.DbUse<HplCountDocument, Text>, DB.DbUse<HplContactDocument, Text>, DB.DbUse<ServiceDocument, Text>) {
    switch (AssocList.find(databasesCache, owner, Principal.equal)) {
      case (?db) ?db;
      case (null) {
        let (tInit, cInit, aInit, hsInit, hvInit, haInit, hnInit, hcInit, sInit) = switch (AssocList.find(storage_v0, owner, Principal.equal)) {
=======
  type ServiceDocument = ServiceDocument_v0;

  var databasesCache : AssocList.AssocList<Principal, (DB.DbUse<AssetDocument, Text>, DB.DbUse<ContactDocument, Text>, DB.DbUse<AllowanceDocument, Text>, DB.DbUse<ServiceDocument, Text>)> = null;

  private func getDatabase(owner : Principal, notFoundStrategy : { #create; #returnNull }) : ?(DB.DbUse<AssetDocument, Text>, DB.DbUse<ContactDocument, Text>, DB.DbUse<AllowanceDocument, Text>, DB.DbUse<ServiceDocument, Text>) {
    switch (AssocList.find(databasesCache, owner, Principal.equal)) {
      case (?db) ?db;
      case (null) {
        let (tInit, cInit, aInit, sInit) = switch (AssocList.find(storage_v0, owner, Principal.equal)) {
>>>>>>> icrc1-new-features
          case (?store) store;
          case (null) {
            switch (notFoundStrategy) {
              case (#returnNull) return null;
              case (#create) {
<<<<<<< HEAD
                let store = (DB.empty<AssetDocument, Text>(), DB.empty<ContactDocument, Text>(), DB.empty<AllowanceDocument, Text>(), DB.empty<HplSubAccountDocument, Text>(), DB.empty<HplVirtualDocument, Text>(), DB.empty<HplAssetDocument, Text>(), DB.empty<HplCountDocument, Text>(), DB.empty<HplContactDocument, Text>(), DB.empty<ServiceDocument, Text>());
=======
                let store = (DB.empty<AssetDocument, Text>(), DB.empty<ContactDocument, Text>(), DB.empty<AllowanceDocument, Text>(), DB.empty<ServiceDocument, Text>());
>>>>>>> icrc1-new-features
                let (upd, _) = AssocList.replace(storage_v0, owner, Principal.equal, ?store);
                storage_v0 := upd;
                store;
              };
            };
          };
        };
        let db = (
          DB.use<AssetDocument, Text>(tInit, func(x) = x.address, Text.compare, func(x) = x.updatedAt),
          DB.use<ContactDocument, Text>(cInit, func(x) = x.principal, Text.compare, func(x) = x.updatedAt),
          DB.use<AllowanceDocument, Text>(aInit, func(x) = x.id, Text.compare, func(x) = x.updatedAt),
<<<<<<< HEAD
          DB.use<HplSubAccountDocument, Text>(hsInit, func(x) = x.id, Text.compare, func(x) = x.updatedAt),
          DB.use<HplVirtualDocument, Text>(hvInit, func(x) = x.id, Text.compare, func(x) = x.updatedAt),
          DB.use<HplAssetDocument, Text>(haInit, func(x) = x.id, Text.compare, func(x) = x.updatedAt),
          DB.use<HplCountDocument, Text>(hnInit, func(x) = x.principal, Text.compare, func(x) = x.updatedAt),
          DB.use<HplContactDocument, Text>(hcInit, func(x) = x.principal, Text.compare, func(x) = x.updatedAt),
=======
>>>>>>> icrc1-new-features
          DB.use<ServiceDocument, Text>(sInit, func(x) = x.principal, Text.compare, func(x) = x.updatedAt),
        );
        let (upd, _) = AssocList.replace(databasesCache, owner, Principal.equal, ?db);
        databasesCache := upd;
        ?db;
      };
    };
  };

  public shared ({ caller }) func pushAssets(docs : [AssetDocument]) : async [AssetDocument] {
<<<<<<< HEAD
    let ?(tdb, _, _, _, _, _, _, _, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
=======
    let ?(tdb, _, _, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
>>>>>>> icrc1-new-features
    DB.pushUpdates(tdb, docs);
  };

  public shared ({ caller }) func pushContacts(docs : [ContactDocument]) : async [ContactDocument] {
<<<<<<< HEAD
    let ?(_, cdb, _, _, _, _, _, _, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
=======
    let ?(_, cdb, _, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
>>>>>>> icrc1-new-features
    DB.pushUpdates(cdb, docs);
  };

  public shared ({ caller }) func pushAllowances(docs : [AllowanceDocument]) : async [AllowanceDocument] {
<<<<<<< HEAD
    let ?(_, _, adb, _, _, _, _, _, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(adb, docs);
  };

  public shared ({ caller }) func pushHplSubaccounts(docs : [HplSubAccountDocument]) : async [HplSubAccountDocument] {
    let ?(_, _, _, hsdb, _, _, _, _, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(hsdb, docs);
  };

  public shared ({ caller }) func pushHplVirtuals(docs : [HplVirtualDocument]) : async [HplVirtualDocument] {
    let ?(_, _, _, _, hvdb, _, _, _, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(hvdb, docs);
  };

  public shared ({ caller }) func pushHplAssets(docs : [HplAssetDocument]) : async [HplAssetDocument] {
    let ?(_, _, _, _, _, hadb, _, _, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(hadb, docs);
  };

  public shared ({ caller }) func pushHplCount(docs : [HplCountDocument]) : async [HplCountDocument] {
    let ?(_, _, _, _, _, _, hndb, _, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(hndb, docs);
  };

  public shared ({ caller }) func pushHplContacts(docs : [HplContactDocument]) : async [HplContactDocument] {
    let ?(_, _, _, _, _, _, _, hcdb, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(hcdb, docs);
  };
  public shared ({ caller }) func pushServices(docs : [ServiceDocument]) : async [ServiceDocument] {
    let ?(_, _, _, _, _, _, _, _, sdb) = getDatabase(caller, #create) else Debug.trap("Can never happen");
=======
    let ?(_, _, adb, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(adb, docs);
  };

  public shared ({ caller }) func pushServices(docs : [ServiceDocument]) : async [ServiceDocument] {
    let ?(_, _, _, sdb) = getDatabase(caller, #create) else Debug.trap("Can never happen");
>>>>>>> icrc1-new-features
    DB.pushUpdates(sdb, docs);
  };

  public shared query ({ caller }) func pullAssets(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [AssetDocument] {
    switch (getDatabase(caller, #returnNull)) {
<<<<<<< HEAD
      case (?(tdb, _, _, _, _, _, _, _, _)) DB.getLatest(tdb, updatedAt, lastId, limit);
=======
      case (?(tdb, _, _, _)) DB.getLatest(tdb, updatedAt, lastId, limit);
>>>>>>> icrc1-new-features
      case (null) [];
    };
  };

  public shared query ({ caller }) func pullContacts(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [ContactDocument] {
    switch (getDatabase(caller, #returnNull)) {
<<<<<<< HEAD
      case (?(_, cdb, _, _, _, _, _, _, _)) DB.getLatest(cdb, updatedAt, lastId, limit);
=======
      case (?(_, cdb, _, _)) DB.getLatest(cdb, updatedAt, lastId, limit);
>>>>>>> icrc1-new-features
      case (null) [];
    };
  };

  public shared query ({ caller }) func pullAllowances(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [AllowanceDocument] {
    switch (getDatabase(caller, #returnNull)) {
<<<<<<< HEAD
      case (?(_, _, adb, _, _, _, _, _, _)) DB.getLatest(adb, updatedAt, lastId, limit);
=======
      case (?(_, _, adb, _)) DB.getLatest(adb, updatedAt, lastId, limit);
>>>>>>> icrc1-new-features
      case (null) [];
    };
  };

<<<<<<< HEAD
  public shared query ({ caller }) func pullHplSubaccounts(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [HplSubAccountDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, _, _, hsdb, _, _, _, _, _)) DB.getLatest(hsdb, updatedAt, lastId, limit);
      case (null) [];
    };
  };
  public shared query ({ caller }) func pullHplVirtuals(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [HplVirtualDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, _, _, _, hvdb, _, _, _, _)) DB.getLatest(hvdb, updatedAt, lastId, limit);
      case (null) [];
    };
  };
  public shared query ({ caller }) func pullHplAssets(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [HplAssetDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, _, _, _, _, hadb, _, _, _)) DB.getLatest(hadb, updatedAt, lastId, limit);
      case (null) [];
    };
  };
  public shared query ({ caller }) func pullHplCount(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [HplCountDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, _, adb, _, _, _, hndb, _, _)) DB.getLatest(hndb, updatedAt, lastId, limit);
      case (null) [];
    };
  };
  public shared query ({ caller }) func pullHplContacts(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [HplContactDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, _, adb, _, _, _, _, hcdb, _)) DB.getLatest(hcdb, updatedAt, lastId, limit);
      case (null) [];
    };
  };
  public shared query ({ caller }) func pullServices(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [ServiceDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, _, _, _, _, _, _, _, sdb)) DB.getLatest(sdb, updatedAt, lastId, limit);
=======
  public shared query ({ caller }) func pullServices(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [ServiceDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, _, _, sdb)) DB.getLatest(sdb, updatedAt, lastId, limit);
>>>>>>> icrc1-new-features
      case (null) [];
    };
  };

<<<<<<< HEAD
  public shared query ({ caller }) func dump() : async [(Principal, ([?AssetDocument], [?ContactDocument], [?AllowanceDocument], [?HplSubAccountDocument], [?HplVirtualDocument], [?HplAssetDocument], [?HplCountDocument], [?HplContactDocument], [?ServiceDocument]))] {
    Iter.toArray<(Principal, ([?AssetDocument], [?ContactDocument], [?AllowanceDocument], [?HplSubAccountDocument], [?HplVirtualDocument], [?HplAssetDocument], [?HplCountDocument], [?HplContactDocument], [?ServiceDocument]))>(
      Iter.map<(Principal, (DB.DbInit<AssetDocument, Text>, DB.DbInit<ContactDocument, Text>, DB.DbInit<AllowanceDocument, Text>, DB.DbInit<HplSubAccountDocument, Text>, DB.DbInit<HplVirtualDocument, Text>, DB.DbInit<HplAssetDocument, Text>, DB.DbInit<HplCountDocument, Text>, DB.DbInit<HplContactDocument, Text>, DB.DbInit<ServiceDocument, Text>)), (Principal, ([?AssetDocument], [?ContactDocument], [?AllowanceDocument], [?HplSubAccountDocument], [?HplVirtualDocument], [?HplAssetDocument], [?HplCountDocument], [?HplContactDocument], [?ServiceDocument]))>(
        List.toIter(storage_v0),
        func((p, (t, c, a, hs, hv, ha, hn, hc, s))) = (p, (Vector.toArray<?AssetDocument>(t.db.vec), Vector.toArray<?ContactDocument>(c.db.vec), Vector.toArray<?AllowanceDocument>(a.db.vec), Vector.toArray<?HplSubAccountDocument>(hs.db.vec), Vector.toArray<?HplVirtualDocument>(hv.db.vec), Vector.toArray<?HplAssetDocument>(ha.db.vec), Vector.toArray<?HplCountDocument>(hn.db.vec), Vector.toArray<?HplContactDocument>(hc.db.vec), Vector.toArray<?ServiceDocument>(s.db.vec))),
=======
  public shared query ({ caller }) func dump() : async [(Principal, ([?AssetDocument], [?ContactDocument], [?AllowanceDocument], [?ServiceDocument]))] {
    Iter.toArray<(Principal, ([?AssetDocument], [?ContactDocument], [?AllowanceDocument], [?ServiceDocument]))>(
      Iter.map<(Principal, (DB.DbInit<AssetDocument, Text>, DB.DbInit<ContactDocument, Text>, DB.DbInit<AllowanceDocument, Text>, DB.DbInit<ServiceDocument, Text>)), (Principal, ([?AssetDocument], [?ContactDocument], [?AllowanceDocument], [?ServiceDocument]))>(
        List.toIter(storage_v0),
        func((p, (t, c, a, s))) = (p, (Vector.toArray<?AssetDocument>(t.db.vec), Vector.toArray<?ContactDocument>(c.db.vec), Vector.toArray<?AllowanceDocument>(a.db.vec), Vector.toArray<?ServiceDocument>(s.db.vec))),
>>>>>>> icrc1-new-features
      )
    );
  };

  public shared query ({ caller }) func doesStorageExist() : async Bool {
    switch (AssocList.find(databasesCache, caller, Principal.equal)) {
      case (?db) true;
      case (null) false;
    };
  };

};
