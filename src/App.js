import React from 'react';
import './App.css';
import { Home } from './containers/Home';
import { SeeAllGames } from './containers/SeeAllGames';
import Layout from './components/Layout';
import Login from './containers/Login';
import { Route, Switch, Redirect } from 'react-router-dom';

let routes = (
    <Switch>
        <Route path="/home" component={Home} />
        <Route path="/seeallgames/:id" component={SeeAllGames} />
        <Route path="/" exact component={Login} />
        <Redirect to="/" />
    </Switch>
);
export const App=()=> {
  return (
      <Layout>
        {routes}
      </Layout>
  );
};

export default App;
