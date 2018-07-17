#[macro_use]
extern crate neon;
extern crate neon_runtime;
//extern crate p8n_types as types;

use neon::vm::{Call, JsResult};
use neon::js::{
    JsString,
    JsArray,
    JsNumber,
    JsObject,
    Object,
    Variant,
    Value,
};
use neon::scope::Scope;

fn current(call: Call) -> JsResult<JsObject> {
    let scope = call.scope;
    let global = scope.global();
    // "hidden" global to avoid recreating the object at every call.
    let k0 = JsString::new(scope, "__panopticon").unwrap();

    match global.get(scope, k0).unwrap().variant() {
        Variant::Object(obj) => Ok(obj),
        _ => {
            let ret = JsObject::new(scope);
            let items = JsArray::new(scope, 1000);

            for i in 0..1000usize {
                let key = JsNumber::new(scope, i as f64);
                let value = JsString::new(scope, &format!("value{}", i)).unwrap();

                items.set(key, value).unwrap();
            }

            let k1 = JsString::new(scope, "name").unwrap();
            let v1 = JsString::new(scope, "test value set").unwrap();
            ret.set(k1, v1).unwrap();

            let k2 = JsString::new(scope, "version").unwrap();
            let v2 = JsNumber::new(scope, 1.0);
            ret.set(k2, v2).unwrap();


            let k3 = JsString::new(scope, "items").unwrap();
            ret.set(k3, items).unwrap();
            global.set(k0,ret).unwrap();

            println!("object created");
            Ok(ret)
        }
    }
}
/*
fn peek(call: Call) -> JsResult<JsObject> {
    use types::Content;
    use std::path::Path;

    let scope = call.scope;
    let path = call.arguments
        .require(scope, 0)?
        .check::<JsString>()?
        .to_string(scope)?
        .value();
    println!("peek({})",path);

    match Content::load(&Path::new(&path)) {
        Ok(fst) => {
            println!("got: {:?}", fst);
        }
        Err(e) => {
            println!("err: {:?}", e);
        }
    }

    Ok(JsObject::new(scope))
}

fn open(call: Call) -> JsResult<JsObject> {
    use types::{Machine,Content};
    use std::path::Path;

    let scope = call.scope;
    let path = call.arguments
        .require(scope, 0)?
        .check::<JsString>()?
        .to_string(scope)?
        .value();
    println!("open({})",path);

    match Content::load(&Path::new(&path)) {
        Ok(fst) => {
            // TODO
            println!("got: {:?}", fst);
        }
        Err(e) => {
            println!("err: {:?}", e);
        }
    }

    Ok(JsObject::new(scope))
}
*/
register_module!(m, {
    m.export("current", current)?;
  //  m.export("peek", peek)?;
    Ok(())
});
