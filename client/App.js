import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';

import MainNavigator from './src/navigation/MainNavigator';
import AppStatusBar from './src/components/common/AppStatusBar'
import {theme} from './src/constants/Theme';
import { SimeProvider } from './src/provider/SimePovider';


enableScreens();

const httpLink = createHttpLink({
  uri: 'http://localhost:5000'
});

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});


export default function App() {
  return (
    <ApolloProvider client={client}>
      <SimeProvider>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              <AppStatusBar />
              <MainNavigator />
            </NavigationContainer>
          </PaperProvider>
        </SafeAreaProvider>
      </SimeProvider>
    </ApolloProvider>
  );
}