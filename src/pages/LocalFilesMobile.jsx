// import react and usestate
import React, { useEffect, useState, useContext } from 'react';

import { IonIcon } from '@ionic/react';
import { IonItem, IonLabel, IonThumbnail, IonList } from '@ionic/react';
// import elipsis Vertical
import { createOutline, chevronDownOutline, chevronUpOutline } from 'ionicons/icons';

import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

import { useIonActionSheet } from '@ionic/react';
// import type { OverlayEventDetail } from '@ionic/core';
// import app context
import { AppContext } from './Tab1';


import { Virtuoso } from 'react-virtuoso'
// import { type } from 'os';

const LocalFilesMobile = (props) => {

  // declare title variable in state
  const [title, setTitle] = useState('Recent Conversions');
  const [files, setFiles] = useState([]);
  const [rootDir, setRootDir] = useState('shareddocuments:///');
  const [compHeight, setCompHeight] = useState(0);
  const [present] = useIonActionSheet();
  const [result, setResult] = useState();
  const [indexExpanded, setIndexExpanded] = useState(null);
  // get path from app context
  const { svgStore, setSvgStore } = useContext(AppContext);



  // on effect hook, get files from filesystem
  React.useEffect(() => {
    // read files in Documents directory
    const getFiles = async () => {
      const { files } = await Filesystem.readdir({
        path: 'svgtrace-files/',
        directory: Directory.Documents,
        recursive: false
      });
      console.log("files:", files);

      // only keep files with .svg extension or directories or dont start wit .
      const svgFiles = files.filter(file => file.type === 'file' && file.name.includes('.svg') || (file.type === 'directory' && !file.name.startsWith('.')));



      console.log('svgFiles:', svgFiles);

      // sort files by ctime
      svgFiles.sort((a, b) => {
        return a.mtime > b.mtime ? -1 : 1;
      });

      // for each file create a preview
      const svgFilesWithPreview = await Promise.all(svgFiles.map(async file => {

        const { uri } = file;
        // if the file type is svg
        if (file.type === 'file') {
          const { data } = await Filesystem.readFile({
            path: uri,
            // directory: Directory.Documents,
            encoding: Encoding.UTF8
          });

          let blob = new Blob([data], { type: 'image/svg+xml' });
          let url = URL.createObjectURL(blob);

          //  milliseconds since 1970 to date
          const date = new Date(file.mtime * 1);
          const dateString = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          // convert from millis to date


          return {
            date: dateString,
            time: file.mtime,
            uri,
            url,
            data,
            name: file.name,
            type: file.type
          };
        } else {





          // let path = files[0].uri;
          // check if files[0].uri is not defined
          // if (files.length !== 0) {
          // make path a blank image
          // read the first file


          // make an array to return
          const array = [];






          // open the first file in the folder
          const { files } = await Filesystem.readdir({
            path: `svgtrace-files/${file.name}`,
            directory: Directory.Documents,
            recursive: false
          });

          // only keep files with .svg extension or directories or dont start wit .
          const svgFiles = files.filter(file => file.type === 'file' && file.name.includes('.svg') || (file.type === 'directory' && !file.name.startsWith('.')));

          console.log("filesList:", svgFiles);

          // loop through the files
          for (let i = 0; i < svgFiles.length; i++) {

            const { data } = await Filesystem.readFile({
              path: svgFiles[i].uri,
              // directory: Directory.Documents,
              encoding: Encoding.UTF8
            });
            let blob = new Blob([data], { type: 'image/svg+xml' });
            let url = URL.createObjectURL(blob);
            // push the files to the array

            //  milliseconds since 1970 to date
            // console.log("ehfbdyusfbsdukfbjuks: ", files);
            const date = new Date(svgFiles[i].ctime * 1);

            const dateString = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            // console.log('here');

            array.push(

              {
                date: dateString,
                time: svgFiles[i].ctime,
                uri: svgFiles[i].uri,
                url,
                name: svgFiles[i].name,
                type: svgFiles[i].type,
                // length: files.length,
                // showDir: false
              }
            );
          }


          const date = new Date(file.ctime * 1);
          const dateString = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return {
            // type: file.type,
            visible: false,
            directory: array,
            date: dateString,
            time: file.ctime,
            uri,
            // if array is empty, show a blank image
            url: array.length === 0 ? '' : array[0].url,
            // url: array[0].url,
            name: file.name,
            type: file.type
          };
          // } else {
          //   const date = new Date(file.ctime * 1);
          //   const dateString = date.toLocaleDateString('en-US', {
          //     month: 'short',
          //     day: 'numeric',
          //     year: 'numeric',
          //   });
          //   return {
          //     date: dateString,
          //     time: file.ctime,
          //     uri,
          //     // url,
          //     name: file.name,
          //     type: file.type
          //   };

          // }



        }
      }));

      console.log('svgFilesWithPreview:', svgFilesWithPreview);

      setFiles(svgFilesWithPreview);

      var urlCurrent = svgFilesWithPreview[0].uri.slice(8)

      // remove everything after last slash
      var urlRoot = urlCurrent.slice(0, urlCurrent.lastIndexOf('/'));

      // if urlcurrent does not end with .svg
      if (!urlCurrent.endsWith('.svg')) {
        // set root dir to urlroot
        urlRoot = urlCurrent.slice(0, urlRoot.lastIndexOf('/'));
      }


      setRootDir('shareddocuments:///' + urlRoot);

      // setFiles(svgFiles);
      console.log('files:', svgFilesWithPreview);

    };
    getFiles();
  }, [props.rerender]);




  return (
    // make the size the remaining size of the screen minus the header 
    <>

      {files.length < 1 ? <>
        {/* <IonList> */}
        <p style={{ paddingLeft: "10px", paddingTop: "10px" }}>Files will appear here.</p>
        {/* </IonList> */}
      </>
        :
        <Virtuoso
          style={{ height: "100%", }}
          totalCount={files.length}


          itemContent={(index) => {
            return (
              <div style={{ height: '100%' }}

                onClick={() => {
                  console.log("clicked");
                  // if it is not a directory
                  if (files[index].type !== 'directory') {

                    setSvgStore({ uri: files[index].uri });
                  } else {

                    // if it is a directory
                    // if index expanded is not equal to index
                    if (indexExpanded && indexExpanded === index) {
                      // set expanded index to index
                      setIndexExpanded(null);
                      console.log("index collapsed:", indexExpanded);
                    }
                    // if index expanded is equal to index
                    else {
                      // set expanded index to null
                      setIndexExpanded(index);
                      console.log("indexExpanded:", indexExpanded);
                    }

                  }


                }}
              >
                <IonItem key={index}
                  // remove the line
                  lines="none"
                  // padding
                  style={{
                    // padding top and bottom
                    paddingTop: '5px',
                    paddingBottom: '5px',

                    // padding: '10px' 
                  }}
                >
                  <IonThumbnail slot="start"
                  // style={{padding: '10px'}}

                  >
                    {/* if file.type is folder outline the image */}

                    {files[index].type === 'directory' ?

                      <div

                        style={{
                          //outline with an offset of 5px
                          // outline: '1px solid #000',
                          // shift div up and to the right by 5 px
                          transform: 'translate(5px, -5px)',
                          // fill with white
                          backgroundColor: 'white',
                          // curved corners
                          borderRadius: '5px',

                          // add a shadow
                          boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                        }}>
                        <div

                          style={{
                            //outline with an offset of 5px 
                            // outline: '1px solid #000',
                            // shift div downm\ and to the left by 5 px
                            transform: 'translate(-5px, 5px)',
                            // transform: 'translate(5px, -5px)',
                            // fill with white
                            backgroundColor: 'white',
                            // curved corners
                            borderRadius: '5px',

                            // add a shadow
                            boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                          }}>
                          <img src={files[index].url} style={{

                            // outline the image dark grey
                            // outline: '1px solid #000000',
                            // shift image down and to the left by 10 px
                            transform: 'translate(-5px, 5px)',
                            // fill with white
                            backgroundColor: 'white',
                            // make image 50px by 50px
                            width: '60px',
                            height: '60px',
                            // curved corners
                            borderRadius: '5px',

                            // add a shadow
                            boxShadow: '0 0 5px rgba(0,0,0,0.5)',

                          }} />
                        </div>
                      </div>
                      : <img
                        style={{
                          // add a radius and shadow
                          borderRadius: '5px',
                          boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                        }}
                        src={files[index].url} />}

                    {/* <img src={file.url} /> */}
                    {/* {getSvgFromUri(file.uri)} */}
                  </IonThumbnail>
                  <IonLabel
                    style={{
                      padding: '10px'
                    }}
                  >
                    {/* {file.name} */}
                    <h2>{files[index].name}</h2>
                    {files[index].type === 'directory' ?

                      <p>{files[index].date} - {files[index].directory.length ? files[index].directory.length : 0} items</p>
                      : <p>{files[index].date}</p>}
                    {/* get the size of the file */}
                    {/* <p>{file.size}</p> */}

                    {/* create a button that opens the file location */}
                    {/* <IonButton href={'shareddocuments:///' + files[index].uri.slice(8)} >Open</IonButton> */}
                  </IonLabel>
                  {/* add three dots to the end of item using fontawesome*/}
                  {/* if file type ends with svg */}
                  {files[index].type !== 'directory' && files[index].name.endsWith('svg') &&
                    <IonIcon size="small" icon={createOutline} slot="end"
                      onClick={() => {
                        // set the path to the uri of the file
                        // setPath(files[index].uri);
                        setSvgStore({ uri: files[index].uri });


                      }}
                    />
                  }
                  {files[index].type === 'directory' &&
                    // if indexExpanded is equal to index
                    indexExpanded !== index &&
                    <IonIcon size="small" icon={chevronDownOutline} slot="end"
                      onClick={() => {
                        setIndexExpanded(index);
                      }}
                    />
                  }
                  {files[index].type === 'directory' &&
                    // if indexExpanded is equal to index
                    indexExpanded === index &&
                    <IonIcon size="small" icon={chevronUpOutline} slot="end"
                      onClick={() => {
                        setIndexExpanded(null);
                      }}
                    />

                  }


                  {/* if show dir is true nest a IonList */}




                </IonItem>
                {/* if index expanded is equal to index */}
                {indexExpanded === index && files[index].type === 'directory' &&
                  <IonList
                    // indent the list
                    style={{ paddingLeft: '25px' }}
                  >
                    {/* map over the directory */}
                    {files[index].directory.map((file, index) => {
                      // if the file ends with svg
                      if (file.name.endsWith('svg')) {
                        return (
                          // <IonItem key={index}
                          //   // remove the line
                          //   lines="none"
                          // // padding
                          // >
                          //   test
                          // </IonItem>


                          <IonItem key={index}
                            // remove the line
                            lines="none"
                            // padding
                            style={{
                              // padding top and bottom
                              paddingTop: '5px',
                              paddingBottom: '5px',

                              // padding: '10px' 
                            }}
                            onClick={() => {
                              // if the file is a directory
                              console.log(" clicked");
                              if (file.type !== 'directory') {
                                setSvgStore({ uri: file.uri });
                              }
                            }}
                          >
                            <IonThumbnail slot="start"
                            // style={{padding: '10px'}}

                            >
                              {/* if file.type is folder outline the image */}

                              {file.type === 'directory' ?

                                <div

                                  style={{
                                    //outline with an offset of 5px
                                    // outline: '1px solid #000',
                                    // shift div up and to the right by 5 px
                                    transform: 'translate(5px, -5px)',
                                    // fill with white
                                    backgroundColor: 'white',
                                    // curved corners
                                    borderRadius: '5px',

                                    // add a shadow
                                    boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                                  }}>
                                  <div

                                    style={{
                                      //outline with an offset of 5px 
                                      // outline: '1px solid #000',
                                      // shift div downm\ and to the left by 5 px
                                      transform: 'translate(-5px, 5px)',
                                      // transform: 'translate(5px, -5px)',
                                      // fill with white
                                      backgroundColor: 'white',
                                      // curved corners
                                      borderRadius: '5px',

                                      // add a shadow
                                      boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                                    }}>
                                    <img src={files[index].url} style={{

                                      // outline the image dark grey
                                      // outline: '1px solid #000000',
                                      // shift image down and to the left by 10 px
                                      transform: 'translate(-5px, 5px)',
                                      // fill with white
                                      backgroundColor: 'white',
                                      // make image 50px by 50px
                                      width: '60px',
                                      height: '60px',
                                      // curved corners
                                      borderRadius: '5px',

                                      // add a shadow
                                      boxShadow: '0 0 5px rgba(0,0,0,0.5)',

                                    }} />
                                  </div>
                                </div>
                                : <img
                                  style={{
                                    // add a radius and shadow
                                    borderRadius: '5px',
                                    boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                                  }}
                                  src={file.url} />
                              }

                              {/* <img src={file.url} /> */}
                              {/* {getSvgFromUri(file.uri)} */}
                            </IonThumbnail>
                            <IonLabel
                              style={{
                                padding: '10px'
                              }}
                            >
                              {/* {file.name} */}
                              <h2>{file.name}</h2>
                              {file.type === 'directory' ?

                                <p>{file.date} - {file.directory.length ? file.directory.length : 0} items</p>
                                : <p>{file.date}</p>}
                              {/* get the size of the file */}
                              {/* <p>{file.size}</p> */}

                              {/* create a button that opens the file location */}
                              {/* <IonButton href={'shareddocuments:///' + files[index].uri.slice(8)} >Open</IonButton> */}
                            </IonLabel>
                            {/* add three dots to the end of item using fontawesome*/}
                            {/* if file type ends with svg */}
                            {file.type !== 'directory' && file.name.endsWith('svg') &&
                              <IonIcon size="small" icon={createOutline} slot="end"
                                onClick={() => {
                                  // set the path to the uri of the file
                                  // console.log("setting path to: ",file.uri);
                                  // setPath(file.uri);
                                  // set the path to the uri of the file
                                  setSvgStore({ uri: file.uri });


                                }}
                              />
                            }


                            {/* if show dir is true nest a IonList */}




                          </IonItem>
                        )
                      }
                    })}
                  </IonList>
                }



              </div>
            );


          }}

        />
      }
      {/* {result && <code>{JSON.stringify(result, null, 2)}</code>} */}
    </>
  );
};






export default LocalFilesMobile;
