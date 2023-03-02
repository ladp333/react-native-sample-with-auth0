import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Auth0, {Auth0Provider} from 'react-native-auth0';
import DeviceInfo from 'react-native-device-info';
import config from './auth0-configuration';

export const login = async (config, callback) => {
  try {
    const {domain, clientId} = config;
    const auth0 = new Auth0({
      domain,
      clientId,
    });

    const authParams = {
      scope: 'openid email read:api offline_access native all',
      audience: 'https://digitalapi',
      adobe_mc: 'adobemc123456',
      flow: 'login',
      device: DeviceInfo.getUniqueId(),
    };

    console.log('login() start', {auth: config});

    const {refreshToken, accessToken, expiresIn} =
      await auth0.webAuth.authorize(authParams);

    console.log(`accessToken: ${accessToken}`);

    callback({refreshToken, accessToken, expiresIn});
  } catch (e) {
    console.log('Authorise error', e);
  }
};

const Home = () => {
  const {loggedIn, setIsLoggedIn} = useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => login(config, setIsLoggedIn)}
        style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>
          {loggedIn ? 'Log out' : 'Log in'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.loggedInOutText}>
        {loggedIn ? 'You are logged in' : 'You are not logged in'}
      </Text>
    </View>
  );
};

const App = () => {
  return (
    <Auth0Provider domain={config.domain} clientId={config.clientId}>
      <Home />
    </Auth0Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  error: {
    margin: 20,
    textAlign: 'center',
    color: '#D8000C',
  },
  appButtonContainer: {
    backgroundColor: '#ec0000',
    borderStyle: 'solid',
    borderColor: '#ec0000',
    borderWidth: 1,
    height: 48,
  },
  appButtonText: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'normal',
    color: '#fff',
    textAlign: 'center',
  },
  loggedInOutText: {
    marginTop: 20,
    padding: 8,
  },
});

export default App;
