
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from './hooks/useAuth';
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import CampaignPage from "@/pages/CampaignPage";
import CreateCampaign from "@/pages/CreateCampaign";
import IntegrityVote from "@/pages/IntegrityVote";
import ResultsPage from "@/pages/ResultsPage";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";
import NavBar from "./components/NavBar";

function App() {
  const { user } = useAuth();

  return (
    <>
      <NavBar user={user} />
      <Layout>
        <Switch>
          <Route path="/campaign/:id" component={CampaignPage} />
          <Route path="/integrity-vote/:id" component={IntegrityVote} />
          <Route path="/results/:id" component={ResultsPage} />
          <Route path="/campaigns" component={Home} />
          <Route path="/create-campaign">
            {() => <CreateCampaign user={user} />}
          </Route>
          <Route path="/results" component={ResultsPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
