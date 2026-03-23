import fs from "fs";

export function GetAllFiles(Src){
    return fs.readdirSync(Src, {recursive: true});
}

export function GetAllFilesNameOnly(Src) {
    const data = GetAllFiles(Src);
    return data.map( elem => elem.split(".")[0])
}

//module.export = {GetAllFilesNameOnly, GetAllFiles}