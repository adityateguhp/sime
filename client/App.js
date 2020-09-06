import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';
import AsyncStorage from '@react-native-community/async-storage';

import { AuthProvider } from './src/context/auth';
import MainNavigator from './src/navigation/MainNavigator';
import AppStatusBar from './src/components/common/AppStatusBar'
import { theme } from './src/constants/Theme';
import { SimeProvider } from './src/context/SimePovider';


enableScreens();

const httpLink = createHttpLink({
  uri: 'http://192.168.1.11:5000/'
});

const authLink = setContext(async () => {
  const token = await AsyncStorage.getItem('jwtToken');
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  } else {
    client.resetStore();
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`,
      ),
    );
  }

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const link = ApolloLink.from([
  authLink,
  errorLink,
  httpLink,
]);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache
});

export default function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}