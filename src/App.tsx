import React, {useState, useEffect} from 'react';
import { ScreenOrientation } from '@ionic-native/screen-orientation'
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, repeatOutline, triangle, fileTray, albumsOutline, imageOutline } from 'ionicons/icons';
import { StatusBar, Style } from '@capacitor/status-bar';
// import ionic library for getting device type
import { isPlatform } from '@ionic/react';

// import Icon, { HistoryOutlined } from '@ant-design/icons';
// import history.svg from assets
import HistorySvg from './assets/history.svg';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/LocalFilesMobile';

// import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App = () => {
// rerender state variables
const [rerender, setRerender] = useState(1);
const [oritation, setOritation] = useState<string>('');

// useeffect and lock orientation

useEffect(() => {
  ScreenOrientation.lock(ScreenOrientation.ORIENTATIONS.PORTRAIT);
  setOritation(ScreenOrientation.ORIENTATIONS.PORTRAIT);

  // check device type
  if (isPlatform('android')) {
    StatusBar.setStyle({ style: Style.Dark });
  } else if (isPlatform('ios') || isPlatform('ipad') || isPlatform('iphone'))  { 
    StatusBar.setStyle({ style: Style.Light });
  }

  StatusBar.setOverlaysWebView({ overlay: false });


}, []);

return (
  <IonApp>
    <IonReactRouter>

      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tab1">
            <Tab1 />
          </Route>
          <Route exact path="/tab2">
            <Tab2 rerender={rerender}/>
          </Route>

          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar hidden id='tabBar' slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon icon={imageOutline} />
            <IonLabel>Single</IonLabel>
          </IonTabButton>
          {/* <IonTabButton tab="tab3" href="/tab3">
            <IonIcon  icon={albumsOutline}/>
            <IonLabel>Bulk</IonLabel>
          </IonTabButton> */}
          <IonTabButton onClick={
            // rerender
            () => {
              // increment rerender state variable
              setRerender(rerender + 1);
            }
          } tab="tab2" href="/tab2">
            <IonIcon icon={fileTray}/>
            <IonLabel>Files</IonLabel>
          </IonTabButton>
          
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);
        };

export default App;
