import Firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyAusIBRspLqdPctgd1tvFdTK094q1iLc6k',
  databaseURL: 'https://chatapp-ca7fd-default-rtdb.firebaseio.com/',
  projectId: 'chatapp-ca7fd',
  appId: '1:499281765774:android:dff2a0b6aef9e24f7ff0df',
};

export default Firebase.initializeApp(firebaseConfig);
