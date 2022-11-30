import React, { useEffect, useState, useContext } from 'react';
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { isPlatform } from "@ionic/react";
// import { stringify } from 'querystring';

export const writeFile = (jsonProps) => {
    // if platform is ios or android, use Filesystem.writeFile
    if ((isPlatform("ios") || isPlatform("android")) && !isPlatform("mobileweb")) {
       return Filesystem.writeFile(jsonProps);
    } else if (isPlatform("desktop") || isPlatform("mobileweb")) {
        // if the path ends with .png, return null
        if (jsonProps.path.endsWith(".png")) {
            return new Promise((resolve, reject) => {
                // resolve with the path of the file uri
                resolve();
                // resolve();
            })
        }

        // make an mtime
        const mtime = new Date().getTime();

        // get the filename
        const filename = jsonProps.path.split("/").pop();

        console.log("jsonProps: ", jsonProps);
        
        // define atob
        const atob = (str) => {
            return Buffer.from(str, 'base64').toString('binary');
        }

        const data = atob(jsonProps.data);


        console.log("data: ", data);


        const svgStore = {
            time: mtime,
            uri: jsonProps.path,
            data: data,
            name: filename,
            type: 'file'
        };

        // stringify the svgStore
        const svgStoreString = JSON.stringify(svgStore);

        localStorage.setItem(jsonProps.path, svgStoreString);


        // return a promise
        return new Promise((resolve, reject) => {
            // resolve with the path of the file uri
            resolve(svgStore);
            // resolve();
        });
    }
  };


  export const readFile = (jsonProps) => {
    if ((isPlatform("ios") || isPlatform("android"))&& !isPlatform("mobileweb")) {
       return Filesystem.readFile(jsonProps);
    } else if (isPlatform("desktop") || isPlatform("mobileweb")) {
        // get item from local storage
        console.log('jsonProps.path: ', jsonProps.path);
        const item = localStorage.getItem(jsonProps.path);

        // parse the item
        const parsedItem = JSON.parse(item);
        
        console.log('The item: ',item);
        return new Promise((resolve, reject) => {
            // resolve with the path of the file uri
            resolve(parsedItem);
            // resolve();
        });


    }
  };

