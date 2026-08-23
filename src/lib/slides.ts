import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { DeviceInfo } from './device-info';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/presentations');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const exportToSlides = async (info: DeviceInfo): Promise<{ url: string, user: User }> => {
  let token = await getAccessToken();
  let user = auth.currentUser;
  
  if (!token || !user) {
    const res = await googleSignIn();
    if (!res) throw new Error("Authentication failed");
    token = res.accessToken;
    user = res.user;
  }

  // 1. Create a new presentation
  const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: `Device Footprint Report - ${new Date().toLocaleDateString()}`
    })
  });

  if (!createRes.ok) {
    throw new Error('Failed to create presentation');
  }

  const presentation = await createRes.json();
  const presentationId = presentation.presentationId;
  const slideId = presentation.slides[0].objectId;

  // 2. Insert text into the first slide (which is a title slide)
  // Usually, a title slide has a title and a subtitle placeholder.
  // We'll just replace the title text and subtitle text if possible, or just insert new text boxes.
  
  const textContent = `IP Address: ${info.server.ip}\n` +
    `Browser: ${info.client.userAgent.substring(0, 100)}...\n` +
    `Platform: ${info.client.platform}\n` +
    `Screen: ${info.client.screenWidth}x${info.client.screenHeight}\n` +
    `Timezone: ${info.client.timezone}\n`;

  const requests = [
    {
      createShape: {
        objectId: 'contentShape1',
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: slideId,
          size: { width: { magnitude: 600, unit: 'PT' }, height: { magnitude: 300, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 50, unit: 'PT' }
        }
      }
    },
    {
      insertText: {
        objectId: 'contentShape1',
        text: textContent,
        insertionIndex: 0
      }
    }
  ];

  const updateRes = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests })
  });

  if (!updateRes.ok) {
    throw new Error('Failed to update presentation with data');
  }

  return { url: `https://docs.google.com/presentation/d/${presentationId}/edit`, user };
};

