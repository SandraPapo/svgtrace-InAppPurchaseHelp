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

  const [dir, setDir] = useState([]);



  // on effect hook, get files from filesystem
  React.useEffect(() => {

    // read all files in localStorage that start with 'svgtrace-files/'
    let files = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key.startsWith('svgtrace-files/')) {
        let file = JSON.parse(localStorage.getItem(key));
        files.push({ ...file });
      }
    }

    let mainDirectory = [];

    // group the files by directory specified in the path
    // where the path is in the form 'svgtrace-files/<dir>/<filename>' or 'svgtrace-files/<filename>'
    let groupedFiles = {};
    for (let file of files) {
      let path = file.uri;
      // remove the 'svgtrace-files/' prefix
      path = path.substring(15);
      let dir = path.split('/').slice(0, -1).join('/');
      if (dir === '') {
        mainDirectory.push(file);
        continue;
      }
      if (dir in groupedFiles) {
        groupedFiles[dir].push(file);
      } else {
        groupedFiles[dir] = [file];
      }
    }

    // push all the grouped files into the main directory
    for (let dir in groupedFiles) {
      // sort the dir by date
      groupedFiles[dir].sort((a, b) => {
        return b.time - a.time;
      });

      // get the most recent date
      let time = groupedFiles[dir][0].time;

      mainDirectory.push({
        name: dir,
        files: groupedFiles[dir],
        time: time,
        type: 'directory'
      });
    }

    // sort the main directory by time
    mainDirectory.sort((a, b) => {
      return b.time - a.time;
    });




    console.log("the main directory is: ", mainDirectory);
    setDir(mainDirectory);

  }, [props.rerender]);




  return (
    // make the size the remaining size of the screen minus the header 
    <>

      {dir.length < 1 ? <>
        {/* <IonList> */}
        <p style={{ paddingLeft: "10px", paddingTop: "10px" }}>Files will appear here.</p>
        {/* </IonList> */}
      </>
        :


        // make a Virtuoso list of the files 
        <Virtuoso
          style={{ height: '100%' }}
          totalCount={dir.length}
          itemContent={(index) => {
            return (
              <div>
                <IonItem
                  key={index}
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
                    if (dir[index].type === 'directory') {
                      if (indexExpanded === index) {
                        setIndexExpanded(null);
                      } else {
                        setIndexExpanded(index);
                      }
                    } else if (dir[index].type  === 'file') {
                        setSvgStore({ uri: dir[index].uri });
                        console.log("the uri is: ", dir[index].uri);
                      
                      // // set the svg string to the file's svg string
                      // setSvgStore(dir[index].svgStore);
                      // // set the title to the file's name
                      // setTitle(dir[index].name);
                    }
                  }}
                >

                  <IonThumbnail slot="start">
                    {/* if file.type is folder outline the image */}

                    {dir[index].type === 'directory' ?

                      <div

                        style={{
                          //outline with an offset of 5px
                          // outline: '1px solid #000',
                          // shift div up and to the right by 5 px
                          transform: 'translate(3px, -3px)',
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
                            transform: 'translate(-3px, 3px)',
                            // transform: 'translate(5px, -5px)',
                            // fill with white
                            backgroundColor: 'white',
                            // curved corners
                            borderRadius: '5px',

                            // add a shadow
                            boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                          }}>
                          <img
                            src={
                              `data:image/svg+xml;utf8,${dir[index].files[0].data}`
                            }
                            style={{

                              // outline the image dark grey
                              // outline: '1px solid #000000',
                              // shift image down and to the left by 10 px
                              transform: 'translate(-3px, 3px)',
                              // fill with white
                              backgroundColor: 'white',
                              // make image 50px by 50px
                              width: '60px',
                              height: '60px',
                              // curved corners
                              borderRadius: '5px',

                              // marginBottom: '5px',

                              // add a shadow
                              boxShadow: '0 0 5px rgba(0,0,0,0.5)',

                            }} />
                        </div>
                      </div>
                      :
                      <>
                        <img
                          style={{
                            // add a radius and shadow
                            borderRadius: '5px',
                            boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                          }}
                          src={
                            // this is not working
                            `data:image/svg+xml;utf8,${dir[index].data}` 




                          }
                        />

                      </>

                    }

                    {/* <img src={file.url} /> */}
                    {/* {getSvgFromUri(file.uri)} */}
                  </IonThumbnail>
                  <IonLabel>
                    <h2>{dir[index].name}</h2>
                    <p>{dir[index].type === 'directory' ? dir[index].files.length + ' files' : dir[index].time}</p>
                  </IonLabel>
                  {dir[index].type === 'directory' && indexExpanded === index && <IonIcon size="small" icon={chevronUpOutline} />}
                  {dir[index].type === 'directory' && indexExpanded !== index && <IonIcon size="small" icon={chevronDownOutline} />}
                </IonItem>
                {dir[index].type === 'directory' && indexExpanded === index && <div style={{ paddingLeft: "10px" }}>
                  {dir[index].files.map((file, index) => {
                    return (
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
                          // console.log(" clicked");
                          if (file.type !== 'directory') {
                            setSvgStore({ uri: file.uri });
                          }
                        }}
                      >


                        <IonThumbnail slot="start">
                          <img
                            style={{
                              // add a radius and shadow
                              borderRadius: '5px',
                              boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                            }}
                            src={
                              `data:image/svg+xml;utf8,${file.data}`
                            } />


                        </IonThumbnail>
                        <IonLabel>
                          <h2>{file.name}</h2>
                          <p>{file.time}</p>
                        </IonLabel>
                      </IonItem>
                    )
                  })}
                </div>}
              </div>
            )
          }}
        />






        // <Virtuoso
        //   style={{ height: "100%", }}
        //   totalCount={dir.length}


        //   itemContent={(index) => {
        //     return (
        //       <div style={{ height: '100%' }}

        //         onClick={() => {
        //           console.log("clicked");
        //           // if it is not a directory
        //           if (dir[index].type !== 'directory') {

        //             setSvgStore({ uri: files[index].uri });
        //           } else {

        //             // if it is a directory
        //             // if index expanded is not equal to index
        //             if (indexExpanded && indexExpanded === index) {
        //               // set expanded index to index
        //               setIndexExpanded(null);
        //               console.log("index collapsed:", indexExpanded);
        //             }
        //             // if index expanded is equal to index
        //             else {
        //               // set expanded index to null
        //               setIndexExpanded(index);
        //               console.log("indexExpanded:", indexExpanded);
        //             }

        //           }


        //         }}
        //       >
        //         <IonItem key={index}
        //           // remove the line
        //           lines="none"
        //           // padding
        //           style={{
        //             // padding top and bottom
        //             paddingTop: '5px',
        //             paddingBottom: '5px',

        //             // padding: '10px' 
        //           }}
        //         >
        //           <IonThumbnail slot="start"
        //           // style={{padding: '10px'}}

        //           >
        //             {/* if file.type is folder outline the image */}

        //             {files[index].type === 'directory' ?

        //               <div

        //                 style={{
        //                   //outline with an offset of 5px
        //                   // outline: '1px solid #000',
        //                   // shift div up and to the right by 5 px
        //                   transform: 'translate(5px, -5px)',
        //                   // fill with white
        //                   backgroundColor: 'white',
        //                   // curved corners
        //                   borderRadius: '5px',

        //                   // add a shadow
        //                   boxShadow: '0 0 5px rgba(0,0,0,0.5)',
        //                 }}>
        //                 <div

        //                   style={{
        //                     //outline with an offset of 5px 
        //                     // outline: '1px solid #000',
        //                     // shift div downm\ and to the left by 5 px
        //                     transform: 'translate(-5px, 5px)',
        //                     // transform: 'translate(5px, -5px)',
        //                     // fill with white
        //                     backgroundColor: 'white',
        //                     // curved corners
        //                     borderRadius: '5px',

        //                     // add a shadow
        //                     boxShadow: '0 0 5px rgba(0,0,0,0.5)',
        //                   }}>
        //                   <img src={files[index].url} style={{

        //                     // outline the image dark grey
        //                     // outline: '1px solid #000000',
        //                     // shift image down and to the left by 10 px
        //                     transform: 'translate(-5px, 5px)',
        //                     // fill with white
        //                     backgroundColor: 'white',
        //                     // make image 50px by 50px
        //                     width: '60px',
        //                     height: '60px',
        //                     // curved corners
        //                     borderRadius: '5px',

        //                     // add a shadow
        //                     boxShadow: '0 0 5px rgba(0,0,0,0.5)',

        //                   }} />
        //                 </div>
        //               </div>
        //               : <img
        //                 style={{
        //                   // add a radius and shadow
        //                   borderRadius: '5px',
        //                   boxShadow: '0 0 5px rgba(0,0,0,0.5)',
        //                 }}
        //                 src={files[index].url} />}

        //             {/* <img src={file.url} /> */}
        //             {/* {getSvgFromUri(file.uri)} */}
        //           </IonThumbnail>
        //           <IonLabel
        //             style={{
        //               padding: '10px'
        //             }}
        //           >
        //             {/* {file.name} */}
        //             <h2>{files[index].name}</h2>
        //             {files[index].type === 'directory' ?

        //               <p>{files[index].date} - {files[index].directory.length ? files[index].directory.length : 0} items</p>
        //               : <p>{files[index].date}</p>}
        //             {/* get the size of the file */}
        //             {/* <p>{file.size}</p> */}

        //             {/* create a button that opens the file location */}
        //             {/* <IonButton href={'shareddocuments:///' + files[index].uri.slice(8)} >Open</IonButton> */}
        //           </IonLabel>
        //           {/* add three dots to the end of item using fontawesome*/}
        //           {/* if file type ends with svg */}
        //           {files[index].type !== 'directory' && files[index].name.endsWith('svg') &&
        //             <IonIcon size="small" icon={createOutline} slot="end"
        //               onClick={() => {
        //                 // set the path to the uri of the file
        //                 // setPath(files[index].uri);
        //                 setSvgStore({ uri: files[index].uri });


        //               }}
        //             />
        //           }
        //           {files[index].type === 'directory' &&
        //             // if indexExpanded is equal to index
        //             indexExpanded !== index &&
        //             <IonIcon size="small" icon={chevronDownOutline} slot="end"
        //               onClick={() => {
        //                 setIndexExpanded(index);
        //               }}
        //             />
        //           }
        //           {files[index].type === 'directory' &&
        //             // if indexExpanded is equal to index
        //             indexExpanded === index &&
        //             <IonIcon size="small" icon={chevronUpOutline} slot="end"
        //               onClick={() => {
        //                 setIndexExpanded(null);
        //               }}
        //             />

        //           }


        //           {/* if show dir is true nest a IonList */}




        //         </IonItem>
        //         {/* if index expanded is equal to index */}
        //         {false && indexExpanded === index && files[index].type === 'directory' &&
        //           <IonList
        //             // indent the list
        //             style={{ paddingLeft: '25px' }}
        //           >
        //             {/* map over the directory */}
        //             {files[index].directory.map((file, index) => {
        //               // if the file ends with svg
        //               if (file.name.endsWith('svg')) {
        //                 return (
        //                   // <IonItem key={index}
        //                   //   // remove the line
        //                   //   lines="none"
        //                   // // padding
        //                   // >
        //                   //   test
        //                   // </IonItem>


        //                   <IonItem key={index}
        //                     // remove the line
        //                     lines="none"
        //                     // padding
        //                     style={{
        //                       // padding top and bottom
        //                       paddingTop: '5px',
        //                       paddingBottom: '5px',

        //                       // padding: '10px' 
        //                     }}
        //                     onClick={() => {
        //                       // if the file is a directory
        //                       console.log(" clicked");
        //                       if (file.type !== 'directory') {
        //                         setSvgStore({ uri: file.uri });
        //                       }
        //                     }}
        //                   >
        //                     <IonThumbnail slot="start"
        //                     // style={{padding: '10px'}}

        //                     >
        //                       {/* if file.type is folder outline the image */}

        //                       {file.type === 'directory' ?

        //                         <div

        //                           style={{
        //                             //outline with an offset of 5px
        //                             // outline: '1px solid #000',
        //                             // shift div up and to the right by 5 px
        //                             transform: 'translate(5px, -5px)',
        //                             // fill with white
        //                             backgroundColor: 'white',
        //                             // curved corners
        //                             borderRadius: '5px',

        //                             // add a shadow
        //                             boxShadow: '0 0 5px rgba(0,0,0,0.5)',
        //                           }}>
        //                           <div

        //                             style={{
        //                               //outline with an offset of 5px 
        //                               // outline: '1px solid #000',
        //                               // shift div downm\ and to the left by 5 px
        //                               transform: 'translate(-5px, 5px)',
        //                               // transform: 'translate(5px, -5px)',
        //                               // fill with white
        //                               backgroundColor: 'white',
        //                               // curved corners
        //                               borderRadius: '5px',

        //                               // add a shadow
        //                               boxShadow: '0 0 5px rgba(0,0,0,0.5)',
        //                             }}>
        //                             <img src={files[index].url} style={{

        //                               // outline the image dark grey
        //                               // outline: '1px solid #000000',
        //                               // shift image down and to the left by 10 px
        //                               transform: 'translate(-5px, 5px)',
        //                               // fill with white
        //                               backgroundColor: 'white',
        //                               // make image 50px by 50px
        //                               width: '60px',
        //                               height: '60px',
        //                               // curved corners
        //                               borderRadius: '5px',

        //                               // add a shadow
        //                               boxShadow: '0 0 5px rgba(0,0,0,0.5)',

        //                             }} />
        //                           </div>
        //                         </div>
        //                         : <img
        //                           style={{
        //                             // add a radius and shadow
        //                             borderRadius: '5px',
        //                             boxShadow: '0 0 5px rgba(0,0,0,0.5)',
        //                           }}
        //                           src={file.url} />
        //                       }

        //                       {/* <img src={file.url} /> */}
        //                       {/* {getSvgFromUri(file.uri)} */}
        //                     </IonThumbnail>
        //                     <IonLabel
        //                       style={{
        //                         padding: '10px'
        //                       }}
        //                     >
        //                       {/* {file.name} */}
        //                       <h2>{file.name}</h2>
        //                       {file.type === 'directory' ?

        //                         <p>{file.date} - {file.directory.length ? file.directory.length : 0} items</p>
        //                         : <p>{file.date}</p>}
        //                       {/* get the size of the file */}
        //                       {/* <p>{file.size}</p> */}

        //                       {/* create a button that opens the file location */}
        //                       {/* <IonButton href={'shareddocuments:///' + files[index].uri.slice(8)} >Open</IonButton> */}
        //                     </IonLabel>
        //                     {/* add three dots to the end of item using fontawesome*/}
        //                     {/* if file type ends with svg */}
        //                     {file.type !== 'directory' && file.name.endsWith('svg') &&
        //                       <IonIcon size="small" icon={createOutline} slot="end"
        //                         onClick={() => {
        //                           // set the path to the uri of the file
        //                           // console.log("setting path to: ",file.uri);
        //                           // setPath(file.uri);
        //                           // set the path to the uri of the file
        //                           setSvgStore({ uri: file.uri });


        //                         }}
        //                       />
        //                     }


        //                     {/* if show dir is true nest a IonList */}




        //                   </IonItem>
        //                 )
        //               }
        //             })}
        //           </IonList>
        //         }



        //       </div>
        //     );


        //   }}

        // />
      }
      {/* {result && <code>{JSON.stringify(result, null, 2)}</code>} */}
    </>
  );
};






export default LocalFilesMobile;
