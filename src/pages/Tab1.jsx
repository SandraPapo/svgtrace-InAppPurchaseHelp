// import state react
import React, { useState, createContext, useEffect, useMemo } from 'react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { IonContent, IonPage, IonRow, IonToolbar, IonHeader, IonCol, IonButton, IonIcon, IonFab, IonFabButton, IonModal, IonTitle } from '@ionic/react';
import { alertController } from '@ionic/core';
// import Converter from '../components/Converter';
//  utton from antd
import { Button } from 'antd';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addCircleOutline } from 'ionicons/icons';
// import getColors from 'get-image-colors'
import { getPixelsFromImage } from './Tab1/components/getPixelsFromImage';
import { potraceWrapper } from './Tab1/components/potrace';
// imporort library needed for intent

import { InAppPurchase2 as Store } from "@awesome-cordova-plugins/in-app-purchase-2";





import logo from '../assets/logo.svg';

// import ionic librabry to check platform
import { isPlatform } from '@ionic/react';

// import row from antd
import { Row } from 'antd';

// import fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import the icons
import { faWandMagicSparkles, faPlusSquare, faLayerGroup, faPerson, faUser, faGear } from '@fortawesome/free-solid-svg-icons';

// import + icon
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// import folder open icon
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import LocalFilesMobile from './LocalFilesMobile';
import LocalFilesWeb from './LocalFilesWeb';

import './Tab1.css';
// import Converter from '../components/Converter';
// import Editor from '../components/SvgEditor/components/Editor';
// import Tab3 from './Tab3';

export const AppContext = createContext({
  svgStore: undefined,
  setSvgStore: () => { },
});

export const SubscriptionContext = createContext({
  subscriptionStore: undefined,
  setSubscriptionStore: () => { },
});



const upload = async () => {
  const image = await Camera.getPhoto({
    quality: 100,
    allowEditing: true,
    resultType: CameraResultType.Uri,
    source: CameraSource.Photos,
  });

  // image.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  var imageUrl = image.webPath;

  console.log('pixels:', await getPixelsFromImage(imageUrl));


  // Can be set to the src of an image now
  // imageElement.src = imageUrl;
};


const Tab1 = () => {

  // declare title variable in state
  const [title, setTitle] = useState('Detail Convert');
  // make a rerender variable
  const [rerender, setRerender] = useState(1);
  const [svgStore, setSvgStore] = useState();
  const [subscriptionStore, setSubscriptionStore] = useState();
  const [converterOpen, setConverterOpen] = useState(false);



  const svgValue = useMemo(
    () => ({ svgStore, setSvgStore }),
    [svgStore]
  );

  const subscriptionValue = useMemo(
    () => ({ subscriptionStore, setSubscriptionStore }),
    [subscriptionStore]
  );

  // useeffect to set the svgStore to the global state
  useEffect(() => {
    console.log("the string is:", svgStore);
    if (svgStore !== undefined) {
      // hide the tabBar by id
      // document.getElementById('tabBar').style.display = 'none';
    }
  }, [svgStore])




  useEffect(() => {
    if (isPlatform('ios')) {
      document.addEventListener(
        'deviceready',
        () => {    
          // Needed to use IAP + cordova plugins.
  
          // Set debug messages.
          // Default.
          // InAppPurchase2.verbosity = InAppPurchase2.QUIET;
          // store.verbosity = store.DEBUG;
          console.log('store', Store);
          console.log('subscription');
  
          if (Store) {
            console.log('store.register', Store.register);
            console.log('store.PAID_SUBSCRIPTION', Store.PAID_SUBSCRIPTION);
            if (Store.register)
            Store.register(
            {
              id: "svgtracepro",
              type: Store.PAID_SUBSCRIPTION,
            }
          )

          // set a trial period of 3 days
          Store.trialPeriod = 3;

          // if subscription is not active
          if (!Store.get("svgtracepro").owned) {
            console.log('subscription not active');
            // open the apple pay modal


          }
          // if subscription is active
          if (Store.get("svgtracepro").owned) {
            console.log('subscription active');
            //
          }

          
      
          // Upon approval, verify the receipt.
          Store.when("svgtracepro").approved((product) => {
            console.log('product', product);
            product.verify();
          });

  
          // Upon receipt validation, mark the subscription as owned.
          Store.when("svgtracepro").verified((product) => {
            console.log('product', product);
            product.finish();
          });

      
          // Track all store errors
          Store.error((err) => {
            console.log('err', err);
            // debugLog('Store Error', JSON.stringify(err));
          });
      
          // https://billing-dashboard.fovea.cc/setup/cordova
          Store.validator =
            'https://validator.fovea.cc/v1/validate?appName=secret';
            Store.refresh();

        }
        },
        false,
      );
    }

  }, [subscriptionStore, Store])




  return (
    <IonPage>


      {/*-- fab placed in the center of the content with a list on each side --*/}
      {/* <IonFab vertical="center" horizontal="center" slot="fixed">
            <IonFabButton  color="secondary" onClick={upload}>
              <IonIcon icon={addCircleOutline} />
            </IonFabButton>
          </IonFab> */}
      {/* pass in prop settitle */}
      <SubscriptionContext.Provider value={subscriptionValue}>
      <AppContext.Provider value={svgValue}>
        {/* if svg string is === undefined */}
        {svgStore === undefined &&
          <>
            {/* <Converter converterOpen={converterOpen} setConverterOpen={setConverterOpen} /> */}
          </>
        }

        {svgStore === undefined && !converterOpen &&
          <>
            <IonHeader>
              <IonToolbar >
                {/* make a login icon on the left */}
                {/* dont change color on click */}

                <Button type="text" fill="clear" slot="start" onClick={() => {
                   // check product.canPurchase
                    if (Store.get("svgtracepro").canPurchase) {
                      console.log('can purchase');
                      Store.order("svgtracepro");
                    }
                    else {
                      console.log('cannot purchase');
                    }

                  

                }}>
                  <FontAwesomeIcon icon={faUser} />
                </Button>
                <IonTitle className="ion-text-center">
                  <img src={logo} alt="logo" width={"150px"} style={{ padding: "10px" }} />
                </IonTitle>
                {/* make a settings icon on the right */}

                <Button type="text" fill="clear" slot="end" onClick={() => {
                  //clear localStorage of browser
                  localStorage.clear();

                }}>
                  <FontAwesomeIcon icon={faGear} />
                </Button>


              </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
              {/* <IonGrid> */}
              <IonRow
                // set the height of the row
                style={{
                  height: '125px',
                  padding: '10px',
                }}
              >
                {/* make 2 columns 1 that takes up 2/3 and one that takes up 1/3 */}

                <IonCol size="8"
                  onClick={() => {
                    // get element by id NewConvertInput
                    document.getElementById('NewConvertUpload').click();
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      // make edges round
                      borderRadius: '10px',
                      // make the background a gradient
                      background: 'linear-gradient(145deg, rgba(65,94,249,1) 0%, rgba(33,206,243,1) 83%, rgba(33,206,243,1) 100%)',
                      // make the text white
                      color: 'white',
                      // make the text centered
                      textAlign: 'center',
                      // make font bold
                      fontWeight: 'bold',
                    }}
                    onClick={() => {
                      // setTitle('Single Convert');
                      // setSvgStore(undefined);
                    }}

                  >
                    {/* make an icon with text under it */}
                    <div>
                      <FontAwesomeIcon
                        // padding around the icon
                        style={{ padding: '10px' }}
                        icon={faPlusSquare}
                        size="2x"
                      />
                      <p>Detail Convert</p>
                    </div>
                  </div>
                </IonCol>
                <IonCol size="4">
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      // make edges round
                      borderRadius: '10px',
                      // make the background a blue to purple gradient
                      background: 'linear-gradient(145deg, rgba(66,65,249,1) 0%, rgba(219,83,190,1) 100%, rgba(243,33,213,1) 100%)',
                      // make the text white
                      color: 'white',
                      // make the text centered
                      textAlign: 'center',
                      // make font bold
                      fontWeight: 'bold',
                    }}
                    onClick={() => {
                      // get element by id 
                      const element = document.getElementById('BatchConvertInput');
                      // click the element
                      element.click();
                    }}
                  >

                    {/* make an icon with text under it */}
                    <div >
                      <FontAwesomeIcon
                        style={{ padding: '10px' }}
                        icon={faLayerGroup}
                        size="2x"

                      />
                      <p>Batch</p>
                    </div>
                  </div>
                </IonCol>
                {/* <Tab3 setRerender={setRerender} rerender={rerender} /> */}

              </IonRow>

              {/* <IonRow>
                  <IonCol >
   
                  <h3 >Local</h3>
                  </IonCol>
                </IonRow> */}
              <IonRow
                style={{
                  height: 'calc(100% - 125px)',
                  // add a padding of 10px on the top and bottom
                  padding: '10px'
                }}
              >
                <IonCol>
                  {/* make a title in bold text that says 'local' */}
                  <IonRow
                    style={{
                      paddingBottom: '10px'
                    }}
                  >
                    <h4 style={{
                      fontWeight: 'bold',
                      paddingTop: '0px',
                      paddingBottom: '0px',
                      marginTop: '0px',
                      marginBottom: '0px',
                      paddingLeft: '10px',
                      paddingRight: '10px',

                    }}>Local</h4>
                    {/* make a button that opens the sharreddocument uri */}


                    {/* use faFolderOpen */}
                    {/* if isPlatform is ios  */}
                    {isPlatform('ios') && !isPlatform('mobileweb') &&


                      <Button
                        // small button
                        size="small"
                        onClick={() => {
                          // open the shared document uri
                          Filesystem.getUri({
                            path: "",
                            directory: Directory.Documents
                          }).then((uri) => {
                            // create a link and click it
                            const link = document.createElement('a');
                            link.href = `shareddocuments:///${uri.uri.slice(8)}`;
                            link.click();
                            // remove the link
                            link.remove();
                          });
                        }}
                      >
                        Open
                        <FontAwesomeIcon
                          icon={faFolderOpen}
                          style={{
                            // add padding
                            padding: '5px',
                            // align the icon to the right
                            float: 'right',

                          }}



                        />
                      </Button>
                    }

                    {isPlatform('android') && !isPlatform('mobileweb') &&
                      // put c

                      <Button
                        type='link'
                        // small button
                        size="small"
                        onClick={() => {
                          // open the shared document uri
                          Filesystem.getUri({
                            path: "",
                            directory: Directory.Documents
                          }).then(async (uri) => {

                            // create an alertController
                            // const alert = document.createElement('ion-alert');
                            // make a message for the alert using paragraph tags
                            const message =
                              `<p>Step 1: Open the file app</p>
                        <p>Step 2: Navigate to the following folder: Phone/Documents </p>
                        <p>Note: Your phone might have 2 Documents folders. Look for the other one if you dont see the files.</p>
                        `;


                            const alert = await alertController.create({
                              // header: 'Success!',
                              subHeader: 'How to access your files',
                              message: message,
                              buttons: ['OK']
                            });

                            await alert.present();


                          });
                        }}
                      >
                        Where are the files located?
                        {/* <FontAwesomeIcon
                      icon={faFolderOpen}
                      style={{
                        // add padding
                        padding: '5px',
                        // align the icon to the right
                        float: 'right',

                      }}
                    /> */}

                      </Button>
                    }



                  </IonRow>
                  {/* if isPlatform ios or android and is not mobileweb*/}
                  {(isPlatform('ios') || isPlatform('android')) && !isPlatform('mobileweb') &&
                    <LocalFilesMobile setRerender={setRerender} rerender={rerender} />
                  }
                  {(isPlatform('desktop') || isPlatform('mobileweb')) &&
                    <LocalFilesWeb setRerender={setRerender} rerender={rerender} />
                  }
                </IonCol>
              </IonRow>


              {/* </IonGrid> */}


            </IonContent>

          </>
        }
        {svgStore !== undefined &&
          <>
            {/* slide up animation */}

            {/* <IonModal */}
            {/* isOpen={svgStore !== undefined}
            > */}
            {/* <Editor /> */}
            {/* </IonModal> */}

          </>
        }
      </AppContext.Provider>
      </SubscriptionContext.Provider>

      {/* </div> */}
    </IonPage >
  );
};

export default Tab1;
