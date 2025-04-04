import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
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
  return (
    <>
      <NavBar />
      <Layout>
        <Switch>
          {/* Note: More specific routes should come before general routes */}
          <Route path="/campaign/:id" component={CampaignPage} />
          <Route path="/integrity-vote/:id" component={IntegrityVote} />
          <Route path="/results/:id" component={ResultsPage} />
          
          {/* More general routes come after specific ones */}
          <Route path="/campaigns" component={Home} />
          <Route path="/create-campaign" component={CreateCampaign} />
          <Route path="/results" component={ResultsPage} />
          <Route path="/dashboard" component={Dashboard} />
          
          {/* Home route should be last for proper wildcard matching */}
          <Route path="/" component={Home} />
          
          {/* Not found page as fallback */}
          <Route component={NotFound} />
        </Switch>
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
