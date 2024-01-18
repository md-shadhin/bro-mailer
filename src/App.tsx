import React, { useEffect, useState } from 'react';

import './css/page.css';
import './css/modal.css';
import TypeToolbar from './components/TypeToolbar';
import EmailModal from './components/EmailModal';
import LeaveForm from './components/LeaveForm';
import { sendEmail } from './actions';

function App() {

  const [selectedType, setSelectedType] = useState<string>(localStorage.getItem('leaveType') || 'radioEarlyLeave');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dearLabel, setDearLabel] = useState<string | undefined>('Select');

  const [tokenClient, setTokenClient] = useState<any>(null); // Adjust the type as needed
  const [gapiInited, setGapiInited] = useState<boolean>(false);
  const [gisInited, setGisInited] = useState<boolean>(false);

  const setSelectedTypeId = (id: string) => {
    setSelectedType(id);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const setDearLabelValue = (value?: string) => {
    setDearLabel(value);
  };


  useEffect(() => {

    const DISCOVERY_DOCS = [
      'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
      // 'https://www.googleapis.com/discovery/v1/apis/people/v1/rest',
      'https://people.googleapis.com/$discovery/rest?version=v1'
    ];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    const SCOPES = 'https://www.googleapis.com/auth/gmail.send ' +
      'https://www.googleapis.com/auth/userinfo.profile ' +
      'https://www.googleapis.com/auth/userinfo.email ';

    const initializeGapiClient = async () => {
      await window.gapi.client.init({
        apiKey: process.env.REACT_APP_API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
      });
      setGapiInited(true);
      maybeEnableButtons();
    };

    const gapiLoaded = () => {
      window.gapi.load('client', initializeGapiClient);
    };

    const gisLoaded = () => {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
      });
      setTokenClient(tokenClient);
      setGisInited(true);
      maybeEnableButtons();
    };

    const maybeEnableButtons = () => {
      if (gapiInited && gisInited) {

      }
    };

    window.gapiLoaded = gapiLoaded;
    window.gisLoaded = gisLoaded;

    const script1 = document.createElement('script');
    script1.src = 'https://apis.google.com/js/api.js';
    script1.async = true;
    script1.defer = true;
    script1.onload = window.gapiLoaded;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.async = true;
    script2.defer = true;
    script2.onload = window.gisLoaded;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, [gapiInited, gisInited]);


  const handleAuthClick = async (type: string, body: string | null) => {
    if (tokenClient) {
      tokenClient.callback = async (resp: any) => {
        if (resp.error !== undefined) {
          throw resp;
        }

        await sendEmail(type, body);
      };

      if (window.gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: '' });
      } else {
        tokenClient.requestAccessToken({ prompt: '' });
      }
    }
  };


  return (
    <div className="wrapper">
      <TypeToolbar selectedType={selectedType} setSelectedTypeId={setSelectedTypeId} />
      <LeaveForm openModal={openModal} dearLabel={dearLabel} selectedType={selectedType} handleAuthClick={handleAuthClick} />
      <EmailModal isModalOpen={isModalOpen} closeModal={closeModal} setDearLabelValue={setDearLabelValue} />
    </div>
  
  );
}

export default App;
