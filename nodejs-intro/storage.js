const fs = require('fs');
let data = {};
let dataFile = 'storage.dat';

let validateKeyAsString = (key) => {
    if (typeof key !== 'string'){
        throw new Error('Key must be a string');
    } 
};

let validateKeyExists = (key) => {
    if (!data.hasOwnProperty(key)){
        throw new Error('Key could not be found')
    }
};

let put = (key, value) => {
    validateKeyAsString(key);
    if(data.hasOwnProperty(key)){
        throw new Error('Key already exists');
    }

    data[key] = value;
};

let get = (key) => {
    validateKeyAsString(key);
    validateKeyExists(key);
  
    return data[key];
};

let update = (key, value) => {
    validateKeyAsString(key);
    validateKeyExists(key);
    data[key] = value;
};

let deleteItem = (key) => {
    validateKeyAsString(key);
    validateKeyExists(key);

    delete data[key];
};

let save = (/**callback*/) => {
    return new Promise((resolve, reject) => {
        let dataAsString = JSON.stringify(data);
        fs.writeFile(dataFile, dataAsString, err => {
            if(err){
                reject(err);
                return;
            }

            resolve();
        });
    })

    //let dataAsString = JSON.stringify(data);
    //fs.writeFile(dataFile, dataAsString, (error, data) => {
    //    if (error){
    //        console.log(error);
    //
    //        return;
    //    }
    //
    //    callback();
    //});
};

let load = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(dataFile, 'utf8', (err, dataJson) => {
            if(err){
                if (err){
                    reject(err);

                    return;
                }
            }
    
            data = JSON.parse(dataJson);
            resolve();
        });
    })
   
};

let clear = () => {
    delete data;
}
module.exports = {
    put: put,
    get: get,
    update: update,
    delete: deleteItem,
    save: save,
    clear: clear,
    load: load
}