import { Helmet } from "react-helmet-async";

const Settings = () => {
  return (
    <section>
      <Helmet>
        <title>DevManage – Settings</title>
        <meta name="description" content="Configure DevManage preferences and account settings." />
        <link rel="canonical" href="/settings" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-2">Settings</h1>
      <p className="text-muted-foreground">Settings and preferences are coming soon.</p>
    </section>
  );
};

export default Settings;
