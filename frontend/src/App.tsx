import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import {   
  BrowserRouter as Router,
  Route,
  Switch,
  Link, 
  Redirect
} from 'react-router-dom'

import './App.css'
import DashboardPage from './pages/dashboard'
import LoginPage from './pages/login'
import { AuthedRoute, UnauthedRoute } from './pages/routes'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex justify-center max-w-screen max-h-screen mx-auto">
          <Switch>
            <AuthedRoute path="/dashboard" component={DashboardPage}/>
            <UnauthedRoute path="/login" component={LoginPage}/>
            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>
          </Switch>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
