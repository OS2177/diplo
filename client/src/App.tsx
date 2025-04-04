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

function App() {
  return (
    <>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/campaign/:id" component={CampaignPage} />
          <Route path="/campaigns" component={Home} />
          <Route path="/create-campaign" component={CreateCampaign} />
          <Route path="/integrity-vote/:id" component={IntegrityVote} />
          <Route path="/results" component={ResultsPage} />
          <Route path="/results/:id" component={ResultsPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
