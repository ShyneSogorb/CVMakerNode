import fs from "fs";

export class DataFile{
    constructor(File){
        const FileFormat = File.split(".");
        this.Name = FileFormat[0];
        this.Lang = FileFormat[1];
        this.Format = FileFormat[2];
    }

    Path(){
        return `${this.Name}.${this.Lang}.${this.Format}`
    }
}

export function GetAllFiles(Src){
    return fs.readdirSync(Src, {recursive: true}).map(f=> new DataFile(f));
}

// export function GetAllFiles(Src){
//     return fs.readdirSync(Src, {recursive: true});
//}

export function GetAllFilesNameOnly(Src) {
    const data = GetAllFiles(Src);
    return data.map( elem => elem.split(".")[0])
}

//module.export = {GetAllFilesNameOnly, GetAllFiles}