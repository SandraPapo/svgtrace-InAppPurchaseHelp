import {  IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonRow, IonCol } from '@ionic/react';
import logoIcon from '../assets/logo-icon.svg';

const CustomHeader: React.FC<{title:string}> = ({title}) => {
  return (
      <IonHeader id='header'>
        <IonToolbar>
              {/*GRADIANT STUFF: background:'-webkit-linear-gradient(45deg,#f32177, #1081e8)', "-webkit-background-clip": "text","-webkit-text-fill-color": "transparent" */}
                <IonTitle>{title}</IonTitle>

        </IonToolbar>
      </IonHeader>
  );
};
export default CustomHeader;